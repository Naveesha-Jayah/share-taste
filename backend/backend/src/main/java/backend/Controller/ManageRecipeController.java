package backend.Controller;

import backend.Exception.RecipeNotFoundException;
import backend.Model.ManageRecipeModel;
import backend.Model.ManageRecipeModel.MediaItem;
import backend.Repository.ManageRecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;
import jakarta.annotation.PostConstruct;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", 
             allowedHeaders = "*", 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
             allowCredentials = "true",
             maxAge = 3600)
@RequestMapping("/api/recipes")
public class ManageRecipeController {

    @Autowired
    private ManageRecipeRepository manageRecipeRepository;

    private final String UPLOAD_DIR = "uploads";
    private final Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
    private final long MAX_VIDEO_DURATION = 30; // maximum video duration in seconds
    private final int MAX_PHOTO_COUNT = 3; // maximum number of photos per recipe

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(uploadPath);
            System.out.println("Upload directory created at: " + uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    private boolean isValidMediaType(String contentType, String type) {
        if (contentType == null) return false;
        if ("photo".equals(type)) {
            return contentType.startsWith("image/");
        } else if ("video".equals(type)) {
            return contentType.startsWith("video/");
        }
        return false;
    }

    private boolean validateMediaRequirements(List<MediaItem> mediaItems) {
        if (mediaItems == null || mediaItems.isEmpty()) {
            return false;
        }

        long videoCount = mediaItems.stream()
            .filter(item -> "video".equals(item.getType()))
            .count();

        long photoCount = mediaItems.stream()
            .filter(item -> "photo".equals(item.getType()))
            .count();

        // Either one video OR up to 3 photos, but not both
        if (videoCount > 0) {
            return videoCount == 1 && photoCount == 0;
        } else {
            return photoCount > 0 && photoCount <= MAX_PHOTO_COUNT;
        }
    }

    @PostMapping(value = "/upload-media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadMedia(@RequestParam("file") MultipartFile file, 
                                       @RequestParam("type") String type,
                                       @RequestParam(value = "duration", required = false) Long duration,
                                       @RequestParam(value = "existingMedia", required = false) String existingMediaJson) {
        try {
            // Validate file size (max 50MB)
            if (file.getSize() > 50 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "File size must be less than 50MB"));
            }

            // Validate file type
            String contentType = file.getContentType();
            if (!isValidMediaType(contentType, type)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid file type. Allowed types: image/*, video/*"));
            }

            // Parse existing media from JSON
            List<MediaItem> currentMedia = new ArrayList<>();
            if (existingMediaJson != null && !existingMediaJson.isEmpty()) {
                ObjectMapper mapper = new ObjectMapper();
                try {
                    currentMedia = mapper.readValue(existingMediaJson, 
                        mapper.getTypeFactory().constructCollectionType(List.class, MediaItem.class));
                } catch (JsonProcessingException e) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid media data format"));
                }
            }

            // Check existing media items
            if ("video".equals(type)) {
                // If trying to upload a video, check if photos exist
                if (currentMedia.stream().anyMatch(item -> "photo".equals(item.getType()))) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "Cannot add video when photos exist. Please remove photos first."));
                }
                
                // Check if video already exists
                if (currentMedia.stream().anyMatch(item -> "video".equals(item.getType()))) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "Only one video is allowed per recipe"));
                }

                // Check video duration
                if (duration == null || duration > MAX_VIDEO_DURATION) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "Video duration must be 30 seconds or less"));
                }
            } else {
                // If trying to upload a photo, check if video exists or photo limit reached
                if (currentMedia.stream().anyMatch(item -> "video".equals(item.getType()))) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "Cannot add photos when video exists. Please remove video first."));
                }

                long photoCount = currentMedia.stream()
                    .filter(item -> "photo".equals(item.getType()))
                    .count();
                if (photoCount >= MAX_PHOTO_COUNT) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "Maximum 3 photos allowed"));
                }
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String fileName = System.currentTimeMillis() + "_" + Math.round(Math.random() * 1000) + extension;
            Path filePath = uploadPath.resolve(fileName).normalize();

            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Map<String, Object> response = new HashMap<>();
            response.put("filename", fileName);
            response.put("type", type);
            if (duration != null) {
                response.put("duration", duration);
            }

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to upload media file: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createRecipe(@RequestBody ManageRecipeModel newRecipe) {
        if (!validateMediaRequirements(newRecipe.getMediaItems())) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Recipe must include at least one video (max 30 sec) and up to 3 media items total"));
        }
        return ResponseEntity.ok(manageRecipeRepository.save(newRecipe));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecipe(
            @PathVariable Long id,
            @RequestBody ManageRecipeModel recipeDetails) {
        if (!validateMediaRequirements(recipeDetails.getMediaItems())) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Recipe must include at least one video (max 30 sec) and up to 3 media items total"));
        }

        return manageRecipeRepository.findById(id)
                .map(recipe -> {
                    recipe.setRecipeName(recipeDetails.getRecipeName());
                    recipe.setRecipeDescription(recipeDetails.getRecipeDescription());
                    recipe.setPrepTime(recipeDetails.getPrepTime());
                    recipe.setCookTime(recipeDetails.getCookTime());
                    recipe.setServings(recipeDetails.getServings());
                    recipe.setDifficultyLevel(recipeDetails.getDifficultyLevel());
                    recipe.setCategory(recipeDetails.getCategory());
                    recipe.setIngredients(recipeDetails.getIngredients());
                    recipe.setInstructions(recipeDetails.getInstructions());
                    recipe.setMediaItems(recipeDetails.getMediaItems());
                    recipe.setVideoUrl(recipeDetails.getVideoUrl());
                    return ResponseEntity.ok(manageRecipeRepository.save(recipe));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<ManageRecipeModel> getAllRecipes() {
        return manageRecipeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ManageRecipeModel> getRecipeById(@PathVariable Long id) {
        ManageRecipeModel recipe = manageRecipeRepository.findById(id)
                .orElseThrow(() -> new RecipeNotFoundException(id));
        return ResponseEntity.ok(recipe);
    }

    @GetMapping("/media/{filename:.+}")
    public ResponseEntity<?> getMedia(@PathVariable String filename) {
        try {
            Path filePath = uploadPath.resolve(filename).normalize();
            
            // Security check to prevent directory traversal
            if (!filePath.getParent().equals(uploadPath)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid file path"));
            }

            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            Resource resource = new FileSystemResource(filePath.toFile());
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve media file: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        if (manageRecipeRepository.existsById(id)) {
            manageRecipeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

}
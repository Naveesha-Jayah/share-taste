package backend.Controller;

import backend.Exception.RecipeNotFoundException;
import backend.Model.ManageRecipeModel;
import backend.Model.ManageRecipeModel.MediaItem;
import backend.Repository.ManageRecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/recipes")
public class ManageRecipeController {

    @Autowired
    private ManageRecipeRepository manageRecipeRepository;

    private final String UPLOAD_DIR = "src/main/uploads/";
    private final long MAX_VIDEO_DURATION = 30; // maximum video duration in seconds
    private final int MAX_MEDIA_COUNT = 3; // maximum number of media items per recipe

    @PostMapping("/upload-media")
    public ResponseEntity<?> uploadMedia(@RequestParam("file") MultipartFile file, 
                                       @RequestParam("type") String type,
                                       @RequestParam(value = "duration", required = false) Long duration) {
        try {
            // Validate file type
            String contentType = file.getContentType();
            if (!isValidMediaType(contentType, type)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid file type. Allowed types: image/*, video/*"));
            }

            // Validate video duration
            if ("video".equals(type) && (duration == null || duration > MAX_VIDEO_DURATION)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Video duration must be 30 seconds or less"));
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File uploadDir = new File(UPLOAD_DIR);

            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            file.transferTo(filePath);

            Map<String, Object> response = new HashMap<>();
            response.put("filename", fileName);
            response.put("type", type);
            if (duration != null) {
                response.put("duration", duration);
            }

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to upload media file"));
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

    @GetMapping("/media/{filename}")
    public ResponseEntity<FileSystemResource> getMedia(@PathVariable String filename) {
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new FileSystemResource(file));
    }

    @PostMapping
    public ResponseEntity<?> createRecipe(@RequestBody ManageRecipeModel newRecipe) {
        if (newRecipe.getMediaItems() != null && newRecipe.getMediaItems().size() > MAX_MEDIA_COUNT) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Maximum of " + MAX_MEDIA_COUNT + " media items allowed"));
        }
        return ResponseEntity.ok(manageRecipeRepository.save(newRecipe));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecipe(
            @PathVariable Long id,
            @RequestBody ManageRecipeModel recipeDetails) {
        if (recipeDetails.getMediaItems() != null && 
            recipeDetails.getMediaItems().size() > MAX_MEDIA_COUNT) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Maximum of " + MAX_MEDIA_COUNT + " media items allowed"));
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        if (manageRecipeRepository.existsById(id)) {
            manageRecipeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

}
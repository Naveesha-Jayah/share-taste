package backend.Controller;

import backend.Exception.RecipeNotFoundException;
import backend.Model.ManageRecipeModel;
import backend.Repository.ManageRecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/recipes")
public class ManageRecipeController {

    @Autowired
    private ManageRecipeRepository manageRecipeRepository;

    private final String UPLOAD_DIR = "src/main/uploads/";

    @PostMapping
    public ManageRecipeModel createRecipe(@RequestBody ManageRecipeModel newRecipe) {
        return manageRecipeRepository.save(newRecipe);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File uploadDir = new File(UPLOAD_DIR);

            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            file.transferTo(filePath);

            return ResponseEntity.ok("{\"filename\": \"" + fileName + "\"}");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("{\"error\": \"Failed to upload image\"}");
        }
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

    @GetMapping("/image/{filename}")
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new FileSystemResource(file));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ManageRecipeModel> updateRecipe(
            @PathVariable Long id,
            @RequestBody ManageRecipeModel recipeDetails) {
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
                    recipe.setImagePath(recipeDetails.getImagePath());
                    recipe.setVideoUrl(recipeDetails.getVideoUrl());
                    return ResponseEntity.ok(manageRecipeRepository.save(recipe));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
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
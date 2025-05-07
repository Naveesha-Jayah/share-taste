package backend.Model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class ManageRecipeModel {
    @Id
    @GeneratedValue
    private Long id;

    private String recipeName;
    private String recipeDescription;
    private Integer prepTime;
    private Integer cookTime;
    private Integer servings;
    private String difficultyLevel;
    private String category;

    @ElementCollection
    private List<String> ingredients;

    @ElementCollection
    private List<String> instructions;

    @ElementCollection
    @CollectionTable(name = "recipe_media_items", joinColumns = @JoinColumn(name = "recipe_id"))
    private List<MediaItem> mediaItems = new ArrayList<>();

    private String videoUrl;

    @Embeddable
    public static class MediaItem {
        private String path;
        private String type;
        private Long duration;

        public MediaItem() {}

        public MediaItem(String path, String type, Long duration) {
            this.path = path;
            this.type = type;
            this.duration = duration;
        }

        public String getPath() { return path; }
        public void setPath(String path) { this.path = path; }
        
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public Long getDuration() { return duration; }
        public void setDuration(Long duration) { this.duration = duration; }
    }

    public ManageRecipeModel() {
    }

    public ManageRecipeModel(Long id, String recipeName, String recipeDescription, Integer prepTime, 
                           Integer cookTime, Integer servings, String difficultyLevel, String category, 
                           List<String> ingredients, List<String> instructions, List<MediaItem> mediaItems, 
                           String videoUrl) {
        this.id = id;
        this.recipeName = recipeName;
        this.recipeDescription = recipeDescription;
        this.prepTime = prepTime;
        this.cookTime = cookTime;
        this.servings = servings;
        this.difficultyLevel = difficultyLevel;
        this.category = category;
        this.ingredients = ingredients;
        this.instructions = instructions;
        this.mediaItems = mediaItems;
        this.videoUrl = videoUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRecipeName() {
        return recipeName;
    }

    public void setRecipeName(String recipeName) {
        this.recipeName = recipeName;
    }

    public String getRecipeDescription() {
        return recipeDescription;
    }

    public void setRecipeDescription(String recipeDescription) {
        this.recipeDescription = recipeDescription;
    }

    public Integer getPrepTime() {
        return prepTime;
    }

    public void setPrepTime(Integer prepTime) {
        this.prepTime = prepTime;
    }

    public Integer getCookTime() {
        return cookTime;
    }

    public void setCookTime(Integer cookTime) {
        this.cookTime = cookTime;
    }

    public Integer getServings() {
        return servings;
    }

    public void setServings(Integer servings) {
        this.servings = servings;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }

    public List<String> getInstructions() {
        return instructions;
    }

    public void setInstructions(List<String> instructions) {
        this.instructions = instructions;
    }

    public List<MediaItem> getMediaItems() {
        return mediaItems;
    }

    public void setMediaItems(List<MediaItem> mediaItems) {
        this.mediaItems = mediaItems;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }
}


package backend.Exception;

public class RecipeNotFoundException extends RuntimeException {
    public RecipeNotFoundException(Long id) {
        super("Could not find recipe with id: " + id);
    }

    public RecipeNotFoundException(String message) {
        super(message);
    }
}
package backend.Exception;

public class PlaningNotFoundException extends RuntimeException{
    public PlaningNotFoundException(Long id){
        super("Could not find id "+id);
    }

    public PlaningNotFoundException(String message){
        super(message);
    }
}

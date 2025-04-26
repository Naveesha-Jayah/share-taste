package backend.Exception;

public class ChallengeNotFoundException extends RuntimeException{
    public ChallengeNotFoundException(Long id){
        super ("Could not find id"+id);
    }

    public ChallengeNotFoundException(String message){
        super(message);
    }
}

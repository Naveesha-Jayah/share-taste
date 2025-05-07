package backend.Controller;

import backend.Exception.ChallengeNotFoundException;
import backend.Model.ChallengeModel;
import backend.Repository.ChallengeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "http://localhost:3000")
public class ChallengeController {

    private final ChallengeRepository challengeRepository;

    @Autowired
    public ChallengeController(ChallengeRepository challengeRepository) {
        this.challengeRepository = challengeRepository;
    }

    // Get all challenges
    @GetMapping
    public ResponseEntity<List<ChallengeModel>> getAllChallenges() {
        return ResponseEntity.ok(challengeRepository.findAll());
    }

    // Create new challenge
    @PostMapping
    public ResponseEntity<ChallengeModel> createChallenge(@RequestBody ChallengeModel challenge) {
        ChallengeModel savedChallenge = challengeRepository.save(challenge);
        return ResponseEntity.ok(savedChallenge);
    }

    // Get challenge by ID
    @GetMapping("/{id}")
    public ResponseEntity<ChallengeModel> getChallengeById(@PathVariable Long id) {
        ChallengeModel challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new ChallengeNotFoundException(id));
        return ResponseEntity.ok(challenge);
    }

    // Update challenge
    @PutMapping("/{id}")
    public ResponseEntity<ChallengeModel> updateChallenge(
            @PathVariable Long id,
            @RequestBody ChallengeModel challengeDetails) {

        return challengeRepository.findById(id)
                .map(challenge -> {
                    challenge.setChallengeTitle(challengeDetails.getChallengeTitle());
                    challenge.setChallengeDescription(challengeDetails.getChallengeDescription());
                    challenge.setCategory(challengeDetails.getCategory());
                    challenge.setDifficulty(challengeDetails.getDifficulty());
                    challenge.setStartDate(challengeDetails.getStartDate());
                    challenge.setEndDate(challengeDetails.getEndDate());
                    ChallengeModel updatedChallenge = challengeRepository.save(challenge);
                    return ResponseEntity.ok(updatedChallenge);
                })
                .orElseThrow(() -> new ChallengeNotFoundException(id));
    }

    // Delete challenge
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChallenge(@PathVariable Long id) {
        return challengeRepository.findById(id)
                .map(challenge -> {
                    challengeRepository.delete(challenge);
                    return ResponseEntity.ok().build();
                })
                .orElseThrow(() -> new ChallengeNotFoundException(id));
    }
}
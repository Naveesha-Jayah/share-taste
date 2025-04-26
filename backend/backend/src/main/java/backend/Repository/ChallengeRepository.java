package backend.Repository;

import backend.Model.ChallengeModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeRepository extends JpaRepository<ChallengeModel,Long> {
}

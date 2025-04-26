package backend.Repository;

import backend.Model.PlaningModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaningRepository extends JpaRepository<PlaningModel, Long> {
}

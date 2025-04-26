package backend.Repository;

import backend.Model.ManageRecipeModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManageRecipeRepository extends JpaRepository<ManageRecipeModel, Long> {
    // You can add custom query methods here if needed
}
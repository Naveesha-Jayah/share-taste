package backend.Controller;

import backend.Model.PlaningModel;
import backend.Repository.PlaningRepository;
import backend.Exception.PlaningNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/planing")
public class PlaningController {

    @Autowired
    private PlaningRepository planingRepository;

    // Create a new plan
    @PostMapping
    public PlaningModel newPlaningModel(@RequestBody PlaningModel newPlaningModel) {
        return planingRepository.save(newPlaningModel);
    }

    // Get all plans
    @GetMapping
    public List<PlaningModel> getAllPlans() {
        return planingRepository.findAll();
    }

    // Get a single plan by ID
    @GetMapping("/{id}")
    public PlaningModel getPlanById(@PathVariable Long id) {
        return planingRepository.findById(id)
                .orElseThrow(() -> new PlaningNotFoundException(id));
    }

    // Update a plan by ID
    @PutMapping("/{id}")
    public PlaningModel updatePlan(@RequestBody PlaningModel updatedPlan, @PathVariable Long id) {
        return planingRepository.findById(id)
                .map(plan -> {
                    plan.setPlanTitle(updatedPlan.getPlanTitle());
                    plan.setPlanDescription(updatedPlan.getPlanDescription());
                    plan.setPlanDuration(updatedPlan.getPlanDuration());
                    plan.setPlanDifficulty(updatedPlan.getPlanDifficulty());
                    plan.setPlanCategory(updatedPlan.getPlanCategory());
                    plan.setMeals(updatedPlan.getMeals());
                    return planingRepository.save(plan);
                }).orElseThrow(() -> new PlaningNotFoundException(id));
    }

    // Delete a plan by ID
    @DeleteMapping("/{id}")
    public String deletePlan(@PathVariable Long id) {
        if (!planingRepository.existsById(id)) {
            throw new PlaningNotFoundException(id);
        }
        planingRepository.deleteById(id);
        return "Plan with id " + id + " has been deleted successfully.";
    }
}

package backend.Controller;

import backend.Exception.PlaningNotFoundException;
import backend.Model.PlaningModel;
import backend.Repository.PlaningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/plans")
public class PlaningController {
    @Autowired
    private PlaningRepository planingRepository;

    @PostMapping
    public PlaningModel newPlan(@RequestBody PlaningModel newPlan) {
        return planingRepository.save(newPlan);
    }

    @GetMapping("/plans")
    List<PlaningModel> getAllPlans() {
        return planingRepository.findAll();
    }

    @GetMapping("/plans/{id}")
    PlaningModel getPlanById(@PathVariable Long id) {
        return planingRepository.findById(id)
                .orElseThrow(() -> new PlaningNotFoundException(id));
    }

    @PutMapping("/plans/{id}")
    public PlaningModel updatePlan(
            @RequestBody PlaningModel updatedPlan,
            @PathVariable Long id
    ) {
        return planingRepository.findById(id)
                .map(plan -> {
                    plan.setPlanTitle(updatedPlan.getPlanTitle());
                    plan.setPlanDescription(updatedPlan.getPlanDescription());
                    plan.setPlanDuration(updatedPlan.getPlanDuration());
                    plan.setPlanDifficulty(updatedPlan.getPlanDifficulty());
                    plan.setPlanCategory(updatedPlan.getPlanCategory());
                    plan.setMeals(updatedPlan.getMeals());
                    return planingRepository.save(plan);
                })
                .orElseThrow(() -> new PlaningNotFoundException(id));
    }

    @DeleteMapping("/plans/{id}")
    public String deletePlan(@PathVariable Long id) {
        if (!planingRepository.existsById(id)) {
            throw new PlaningNotFoundException(id);
        }
        planingRepository.deleteById(id);
        return "Plan with id " + id + " has been deleted successfully.";
    }
}
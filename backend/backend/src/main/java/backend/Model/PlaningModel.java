package backend.Model;


import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.List;

@Entity
public class PlaningModel {
    @Id
    @GeneratedValue

    private Long id;

    private String planTitle;
    private String PlanDescription;
    private String planDuration;
    private String planDifficulty;
    private String planCategory;

    @ElementCollection
    private List<String>meals;


    public  PlaningModel(){

    }

    public PlaningModel(Long id, String planTitle, String planDescription, String planDuration, String planDifficulty, String planCategory, List<String> meals) {
        this.id = id;
        this.planTitle = planTitle;
        PlanDescription = planDescription;
        this.planDuration = planDuration;
        this.planDifficulty = planDifficulty;
        this.planCategory = planCategory;
        this.meals = meals;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlanTitle() {
        return planTitle;
    }

    public void setPlanTitle(String planTitle) {
        this.planTitle = planTitle;
    }

    public String getPlanDescription() {
        return PlanDescription;
    }

    public void setPlanDescription(String planDescription) {
        PlanDescription = planDescription;
    }

    public String getPlanDuration() {
        return planDuration;
    }

    public void setPlanDuration(String planDuration) {
        this.planDuration = planDuration;
    }

    public String getPlanDifficulty() {
        return planDifficulty;
    }

    public void setPlanDifficulty(String planDifficulty) {
        this.planDifficulty = planDifficulty;
    }

    public String getPlanCategory() {
        return planCategory;
    }

    public void setPlanCategory(String planCategory) {
        this.planCategory = planCategory;
    }

    public List<String> getMeals() {
        return meals;
    }

    public void setMeals(List<String> meals) {
        this.meals = meals;
    }
}

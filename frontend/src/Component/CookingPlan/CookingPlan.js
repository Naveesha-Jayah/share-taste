import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CookingPlan.css';

const PlanForm = () => {
  const [plans, setPlans] = useState([]);
  const [plan, setPlan] = useState({
    id: null,
    planTitle: '',
    planDescription: '',
    planDuration: '1 week',
    planDifficulty: 'Easy',
    planCategory: 'Weight Loss',
    meals: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newMeal, setNewMeal] = useState('');

  const categories = ['Weight Loss', 'Muscle Gain', 'Vegan', 'Keto', 'Mediterranean', 'Detox', 'Balanced'];
  const durations = ['1 week', '2 weeks', '1 month', '3 months', '6 months'];

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('http://localhost:8081/plans/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlan({ ...plan, [name]: value });
  };

  const handleMealChange = (e) => {
    setNewMeal(e.target.value);
  };

  const addMeal = () => {
    if (newMeal.trim() !== '') {
      setPlan({
        ...plan,
        meals: [...plan.meals, newMeal.trim()]
      });
      setNewMeal('');
    }
  };

  const removeMeal = (index) => {
    const updatedMeals = [...plan.meals];
    updatedMeals.splice(index, 1);
    setPlan({ ...plan, meals: updatedMeals });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8081/plans/plans/${plan.id}`, plan);
        alert('Plan Updated Successfully!');
      } else {
        await axios.post('http://localhost:8081/plans', plan);
        alert('Plan Created Successfully!');
      }
      resetForm();
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} plan.`);
    }
  };

  const editPlan = (planToEdit) => {
    setPlan({
      id: planToEdit.id,
      planTitle: planToEdit.planTitle,
      planDescription: planToEdit.planDescription,
      planDuration: planToEdit.planDuration,
      planDifficulty: planToEdit.planDifficulty,
      planCategory: planToEdit.planCategory,
      meals: [...planToEdit.meals]
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deletePlan = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await axios.delete(`http://localhost:8081/plans/plans/${id}`);
        alert('Plan deleted successfully!');
        fetchPlans();
      } catch (error) {
        console.error('Error deleting plan:', error);
        alert('Failed to delete plan.');
      }
    }
  };

  const resetForm = () => {
    setPlan({
      id: null,
      planTitle: '',
      planDescription: '',
      planDuration: '1 week',
      planDifficulty: 'Easy',
      planCategory: 'Weight Loss',
      meals: []
    });
    setIsEditing(false);
  };

  return (
    <div className="plan-container">
      <div className="plan-form">
        <h2 className="section-title">{isEditing ? 'Edit Plan' : 'Create New Plan'}</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="label">Title:</label>
            <input
              type="text"
              name="planTitle"
              placeholder="e.g., Summer Weight Loss Plan"
              value={plan.planTitle}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          
          <div className="form-group">
            <label className="label">Description:</label>
            <textarea
              name="planDescription"
              placeholder="Describe your plan..."
              value={plan.planDescription}
              onChange={handleChange}
              required
              className="input textarea"
            />
          </div>
          
          <div className="form-group">
            <label className="label">Duration:</label>
            <select
              name="planDuration"
              value={plan.planDuration}
              onChange={handleChange}
              required
              className="input"
            >
              {durations.map((duration, index) => (
                <option key={index} value={duration}>{duration}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="label">Difficulty:</label>
            <select
              name="planDifficulty"
              value={plan.planDifficulty}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="label">Category:</label>
            <select
              name="planCategory"
              value={plan.planCategory}
              onChange={handleChange}
              required
              className="input"
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="label">Meals:</label>
            <div className="meal-list">
              {plan.meals.map((meal, index) => (
                <div key={index} className="meal-item">
                  <span>{meal}</span>
                  <button
                    type="button"
                    className="remove-meal-btn"
                    onClick={() => removeMeal(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="meal-input-group">
              <input
                type="text"
                placeholder="Enter meal details (e.g., Breakfast: Oatmeal)"
                value={newMeal}
                onChange={handleMealChange}
                className="input meal-input"
              />
              <button
                type="button"
                className="add-meal-btn"
                onClick={addMeal}
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {isEditing ? 'Update Plan' : 'Create Plan'}
            </button>
            {isEditing && (
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="plans-list">
        <h2 className="section-title">Current Plans</h2>
        {plans.length === 0 ? (
          <p>No plans available. Create your first plan!</p>
        ) : (
          <div>
            {plans.map((plan) => (
              <div key={plan.id} className="plan-item">
                <div className="plan-header">
                  <h3 className="plan-title">{plan.planTitle}</h3>
                  <span className="plan-category">{plan.planCategory}</span>
                </div>
                
                <div className="plan-meta">
                  <span className="meta-item">
                    <span>⏱️</span>
                    <span>{plan.planDuration}</span>
                  </span>
                  <span className="meta-item">
                    <span>🔥</span>
                    <span>{plan.planDifficulty}</span>
                  </span>
                </div>
                
                <p className="plan-description">{plan.planDescription}</p>
                
                {plan.meals && plan.meals.length > 0 && (
                  <div className="meal-list">
                    <p><strong>Meals:</strong></p>
                    {plan.meals.map((meal, index) => (
                      <div key={index} className="meal-item">
                        <span>{meal}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="plan-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => editPlan(plan)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deletePlan(plan.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanForm;
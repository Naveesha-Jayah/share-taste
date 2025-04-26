import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      <style jsx>{`
        .plan-container {
          display: flex;
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
          background-color: #f5f5f5;
          min-height: 100vh;
        }

        .plan-form {
          flex: 0 0 350px;
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 20px;
          height: fit-content;
        }

        .plans-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        h2 {
          color: #333;
          font-size: 22px;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #ff6b6b;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        input, textarea, select {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 15px;
          background-color: #fff;
          transition: border 0.3s;
        }

        input:focus, textarea:focus, select:focus {
          border-color: #ff6b6b;
          outline: none;
        }

        textarea {
          min-height: 120px;
          resize: vertical;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 25px;
        }

        button {
          padding: 12px 18px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 15px;
        }

        .submit-btn {
          background-color: #ff6b6b;
          color: white;
          flex: 1;
        }

        .submit-btn:hover {
          background-color: #ff5252;
          transform: translateY(-2px);
        }

        .cancel-btn {
          background-color: #e0e0e0;
          color: #555;
        }

        .cancel-btn:hover {
          background-color: #d0d0d0;
          transform: translateY(-2px);
        }

        .plan-item {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
        }

        .plan-item:hover {
          transform: translateY(-5px);
        }

        .plan-item h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 20px;
          font-weight: 700;
        }

        .plan-item p {
          margin: 8px 0;
          color: #555;
          font-size: 15px;
          line-height: 1.5;
        }

        .plan-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .edit-btn {
          background-color: #4dabf7;
          color: white;
        }

        .edit-btn:hover {
          background-color: #339af0;
          transform: translateY(-2px);
        }

        .delete-btn {
          background-color: #ff8787;
          color: white;
        }

        .delete-btn:hover {
          background-color: #ff6b6b;
          transform: translateY(-2px);
        }

        .meal-list {
          margin-top: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 10px;
        }

        .meal-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #eee;
          background: white;
          margin-bottom: 8px;
          border-radius: 6px;
        }

        .meal-actions {
          display: flex;
          gap: 5px;
        }

        .meal-input-group {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .meal-input {
          flex: 1;
        }

        .add-meal-btn {
          background-color: #51cf66;
          color: white;
          padding: 0 15px;
        }

        .add-meal-btn:hover {
          background-color: #40c057;
          transform: translateY(-2px);
        }

        .remove-meal-btn {
          background-color: #ff8787;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
        }

        .remove-meal-btn:hover {
          background-color: #ff6b6b;
        }

        .plan-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #555;
          font-size: 14px;
        }

        .meta-icon {
          color: #ff6b6b;
        }

        .plan-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .plan-category {
          background-color: #ffe3e3;
          color: #ff6b6b;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .plan-container {
            flex-direction: column;
          }
          
          .plan-form {
            position: static;
            flex: 1;
          }
          
          .plan-meta {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>

      <div className="plan-form">
        <h2>{isEditing ? 'Edit Plan' : 'Create New Plan'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="planTitle"
              placeholder="e.g., Summer Weight Loss Plan"
              value={plan.planTitle}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="planDescription"
              placeholder="Describe your plan..."
              value={plan.planDescription}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Duration:</label>
            <select
              name="planDuration"
              value={plan.planDuration}
              onChange={handleChange}
              required
            >
              {durations.map((duration, index) => (
                <option key={index} value={duration}>{duration}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Difficulty:</label>
            <select
              name="planDifficulty"
              value={plan.planDifficulty}
              onChange={handleChange}
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Category:</label>
            <select
              name="planCategory"
              value={plan.planCategory}
              onChange={handleChange}
              required
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Meals:</label>
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
                className="meal-input"
                placeholder="Enter meal details (e.g., Breakfast: Oatmeal)"
                value={newMeal}
                onChange={handleMealChange}
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
        <h2>Current Plans</h2>
        {plans.length === 0 ? (
          <p>No plans available. Create your first plan!</p>
        ) : (
          <div>
            {plans.map((plan) => (
              <div key={plan.id} className="plan-item">
                <div className="plan-header">
                  <h3>{plan.planTitle}</h3>
                  <span className="plan-category">{plan.planCategory}</span>
                </div>
                
                <div className="plan-meta">
                  <span className="meta-item">
                    <span className="meta-icon">⏱️</span>
                    <span>{plan.planDuration}</span>
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">🔥</span>
                    <span>{plan.planDifficulty}</span>
                  </span>
                </div>
                
                <p>{plan.planDescription}</p>
                
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
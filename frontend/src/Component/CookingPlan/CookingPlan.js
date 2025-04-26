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
    <div style={styles.container}>
      <div style={styles.planForm}>
        <h2 style={styles.sectionTitle}>{isEditing ? 'Edit Plan' : 'Create New Plan'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title:</label>
            <input
              type="text"
              name="planTitle"
              placeholder="e.g., Summer Weight Loss Plan"
              value={plan.planTitle}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Description:</label>
            <textarea
              name="planDescription"
              placeholder="Describe your plan..."
              value={plan.planDescription}
              onChange={handleChange}
              required
              style={{...styles.input, minHeight: '120px'}}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Duration:</label>
            <select
              name="planDuration"
              value={plan.planDuration}
              onChange={handleChange}
              required
              style={styles.input}
            >
              {durations.map((duration, index) => (
                <option key={index} value={duration}>{duration}</option>
              ))}
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Difficulty:</label>
            <select
              name="planDifficulty"
              value={plan.planDifficulty}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Category:</label>
            <select
              name="planCategory"
              value={plan.planCategory}
              onChange={handleChange}
              required
              style={styles.input}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Meals:</label>
            <div style={styles.mealList}>
              {plan.meals.map((meal, index) => (
                <div key={index} style={styles.mealItem}>
                  <span>{meal}</span>
                  <button
                    type="button"
                    style={styles.removeMealBtn}
                    onClick={() => removeMeal(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div style={styles.mealInputGroup}>
              <input
                type="text"
                placeholder="Enter meal details (e.g., Breakfast: Oatmeal)"
                value={newMeal}
                onChange={handleMealChange}
                style={{...styles.input, flex: 1}}
              />
              <button
                type="button"
                style={styles.addMealBtn}
                onClick={addMeal}
              >
                Add
              </button>
            </div>
          </div>
          
          <div style={styles.formActions}>
            <button type="submit" style={styles.submitBtn}>
              {isEditing ? 'Update Plan' : 'Create Plan'}
            </button>
            {isEditing && (
              <button type="button" style={styles.cancelBtn} onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.plansList}>
        <h2 style={styles.sectionTitle}>Current Plans</h2>
        {plans.length === 0 ? (
          <p>No plans available. Create your first plan!</p>
        ) : (
          <div>
            {plans.map((plan) => (
              <div key={plan.id} style={styles.planItem}>
                <div style={styles.planHeader}>
                  <h3 style={styles.planTitle}>{plan.planTitle}</h3>
                  <span style={styles.planCategory}>{plan.planCategory}</span>
                </div>
                
                <div style={styles.planMeta}>
                  <span style={styles.metaItem}>
                    <span>⏱️</span>
                    <span>{plan.planDuration}</span>
                  </span>
                  <span style={styles.metaItem}>
                    <span>🔥</span>
                    <span>{plan.planDifficulty}</span>
                  </span>
                </div>
                
                <p style={styles.planDescription}>{plan.planDescription}</p>
                
                {plan.meals && plan.meals.length > 0 && (
                  <div style={styles.mealList}>
                    <p><strong>Meals:</strong></p>
                    {plan.meals.map((meal, index) => (
                      <div key={index} style={styles.mealItem}>
                        <span>{meal}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div style={styles.planActions}>
                  <button 
                    style={styles.editBtn}
                    onClick={() => editPlan(plan)}
                  >
                    Edit
                  </button>
                  <button 
                    style={styles.deleteBtn}
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

const styles = {
  container: {
    display: 'flex',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#F7FFF7',
    minHeight: '100vh',
  },
  planForm: {
    flex: '0 0 350px',
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: '20px',
    height: 'fit-content',
  },
  plansList: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sectionTitle: {
    color: '#292F36',
    fontSize: '22px',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #FF6B6B',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 600,
    color: '#292F36',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    backgroundColor: '#fff',
    transition: 'border 0.3s',
  },
  formActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '25px',
  },
  submitBtn: {
    padding: '12px 18px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '15px',
    backgroundColor: '#FF6B6B',
    color: 'white',
    flex: 1,
  },
  cancelBtn: {
    padding: '12px 18px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '15px',
    backgroundColor: '#e0e0e0',
    color: '#555',
  },
  planItem: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s',
  },
  planTitle: {
    margin: '0 0 15px 0',
    color: '#292F36',
    fontSize: '20px',
    fontWeight: 700,
  },
  planDescription: {
    margin: '8px 0',
    color: '#555',
    fontSize: '15px',
    lineHeight: 1.5,
  },
  planActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  editBtn: {
    padding: '12px 18px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '15px',
    backgroundColor: '#4ECDC4',
    color: 'white',
  },
  deleteBtn: {
    padding: '12px 18px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '15px',
    backgroundColor: '#FF6B6B',
    color: 'white',
  },
  mealList: {
    marginTop: '15px',
    background: '#f8f9fa',
    borderRadius: '8px',
    padding: '10px',
  },
  mealItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #eee',
    background: 'white',
    marginBottom: '8px',
    borderRadius: '6px',
  },
  mealInputGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
  addMealBtn: {
    backgroundColor: '#4ECDC4',
    color: 'white',
    padding: '0 15px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  removeMealBtn: {
    backgroundColor: '#FF6B6B',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    border: 'none',
    cursor: 'pointer',
  },
  planMeta: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#555',
    fontSize: '14px',
  },
  planHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  planCategory: {
    backgroundColor: '#ffe3e3',
    color: '#FF6B6B',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
  },
  '@media (max-width: 768px)': {
    container: {
      flexDirection: 'column',
    },
    planForm: {
      position: 'static',
      flex: 1,
    },
    planMeta: {
      flexDirection: 'column',
      gap: '8px',
    },
  },
};

export default PlanForm;
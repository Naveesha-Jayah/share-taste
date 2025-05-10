import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './page.css';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8081';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:3000';

const UserProfile = () => {
  const [recipes, setRecipes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [activeTab, setActiveTab] = useState('recipes');
  const [isLoading, setIsLoading] = useState({
    recipes: true,
    plans: true,
    challenges: true
  });

  // Helper functions for colors
  const getCategoryColor = (category, type) => {
    const colors = {
      recipe: {
        'Main Course': '#FF6B6B',
        'Appetizer': '#4ECDC4',
        'Dessert': '#A0E7A0',
        'Salad': '#FFB347',
        'Soup': '#77A1D3',
        'Breakfast': '#C9A0DC'
      },
      plan: {
        'Weight Loss': '#FF6B6B',
        'Muscle Gain': '#4ECDC4',
        'Vegan': '#A0E7A0',
        'Keto': '#FFB347',
        'Mediterranean': '#77A1D3',
        'Detox': '#C9A0DC',
        'Balanced': '#E0E0E0'
      },
      challenge: {
        'Fitness': '#FF6B6B',
        'Nutrition': '#4ECDC4',
        'Mindfulness': '#A0E7A0',
        'Productivity': '#FFB347',
        'Learning': '#77A1D3',
        'Social': '#C9A0DC'
      }
    };
    return colors[type][category] || '#E0E0E0';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': '#A0E7A0',
      'Medium': '#FFB347',
      'Hard': '#FF6B6B',
      'Expert': '#C9A0DC'
    };
    return colors[difficulty] || '#E0E0E0';
  };

  useEffect(() => {
    fetchRecipes();
    fetchPlans();
    fetchChallenges();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('/api/recipes');
      setRecipes(response.data);
      setIsLoading(prev => ({ ...prev, recipes: false }));
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setIsLoading(prev => ({ ...prev, recipes: false }));
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/plans/plans');
      setPlans(response.data);
      setIsLoading(prev => ({ ...prev, plans: false }));
    } catch (error) {
      console.error('Error fetching plans:', error);
      setIsLoading(prev => ({ ...prev, plans: false }));
    }
  };

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('/api/challenges');
      setChallenges(response.data);
      setIsLoading(prev => ({ ...prev, challenges: false }));
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setIsLoading(prev => ({ ...prev, challenges: false }));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="stats-container">
          <div className="stat-card">
            <h3>{recipes.length}</h3>
            <p>Recipes</p>
          </div>
          <div className="stat-card">
            <h3>{plans.length}</h3>
            <p>Plans</p>
          </div>
          <div className="stat-card">
            <h3>{challenges.length}</h3>
            <p>Challenges</p>
          </div>
        </div>
      </div>

      <div className="content-tabs">
        <button 
          className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          My Recipes
        </button>
        <button 
          className={`tab-btn ${activeTab === 'plans' ? 'active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          My Plans
        </button>
        <button 
          className={`tab-btn ${activeTab === 'challenges' ? 'active' : ''}`}
          onClick={() => setActiveTab('challenges')}
        >
          My Challenges
        </button>
      </div>

      <div className="content-section">
        {activeTab === 'recipes' && (
          <div className="recipes-content">
            {isLoading.recipes ? (
              <div className="loading-spinner">Loading recipes...</div>
            ) : recipes.length === 0 ? (
              <div className="empty-state">
                <p>No recipes available. Create your first recipe!</p>
              </div>
            ) : (
              <div className="recipes-grid">
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="recipe-card">
                    <div className="recipe-header">
                      <h3 className="recipe-title">{recipe.recipeName}</h3>
                      <div className="tag-container">
                        <span 
                          className="recipe-category" 
                          style={{ backgroundColor: getCategoryColor(recipe.category, 'recipe') }}
                        >
                          {recipe.category}
                        </span>
                        <span 
                          className="recipe-difficulty" 
                          style={{ backgroundColor: getDifficultyColor(recipe.difficultyLevel) }}
                        >
                          {recipe.difficultyLevel}
                        </span>
                      </div>
                    </div>
                    
                    {recipe.mediaItems && recipe.mediaItems.length > 0 && (
                      <div className="recipe-media-preview">
                        {recipe.mediaItems[0].type === 'photo' ? (
                          <img
                            src={`http://localhost:8081/api/recipes/media/${recipe.mediaItems[0].path}`}
                            alt={recipe.recipeName}
                            className="thumbnail-image"
                          />
                        ) : (
                          <video
                            src={`http://localhost:8081/api/recipes/media/${recipe.mediaItems[0].path}`}
                            className="thumbnail-video"
                          />
                        )}
                      </div>
                    )}
                    
                    <div className="recipe-meta">
                      <span className="meta-item">
                        <span>⏱️</span>
                        <span>Prep: {recipe.prepTime} min</span>
                      </span>
                      <span className="meta-item">
                        <span>🍳</span>
                        <span>Cook: {recipe.cookTime} min</span>
                      </span>
                      <span className="meta-item">
                        <span>🍽️</span>
                        <span>Servings: {recipe.servings}</span>
                      </span>
                    </div>
                    
                    <p className="recipe-description">{recipe.recipeDescription}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="plans-content">
            {isLoading.plans ? (
              <div className="loading-spinner">Loading plans...</div>
            ) : plans.length === 0 ? (
              <div className="empty-state">
                <p>No plans available. Create your first plan!</p>
              </div>
            ) : (
              <div className="plans-grid">
                {plans.map((plan) => (
                  <div key={plan.id} className="plan-card">
                    <div className="plan-header">
                      <h3 className="plan-title">{plan.planTitle}</h3>
                      <span 
                        className="plan-category"
                        style={{ backgroundColor: getCategoryColor(plan.planCategory, 'plan') }}
                      >
                        {plan.planCategory}
                      </span>
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
                      <div className="meal-preview">
                        <p><strong>Sample Meals:</strong></p>
                        <ul>
                          {plan.meals.slice(0, 3).map((meal, index) => (
                            <li key={index}>{meal}</li>
                          ))}
                          {plan.meals.length > 3 && <li>+{plan.meals.length - 3} more</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="challenges-content">
            {isLoading.challenges ? (
              <div className="loading-spinner">Loading challenges...</div>
            ) : challenges.length === 0 ? (
              <div className="empty-state">
                <p>No challenges available. Create your first challenge!</p>
              </div>
            ) : (
              <div className="challenges-grid">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="challenge-card">
                    <div className="challenge-header">
                      <h3 className="challenge-title">{challenge.challengeTitle}</h3>
                      <div className="tag-container">
                        <span 
                          className="challenge-category" 
                          style={{ backgroundColor: getCategoryColor(challenge.category, 'challenge') }}
                        >
                          {challenge.category}
                        </span>
                        <span 
                          className="challenge-difficulty" 
                          style={{ backgroundColor: getDifficultyColor(challenge.difficulty) }}
                        >
                          {challenge.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <div className="challenge-meta">
                      <span className="meta-item">
                        <span>📅</span>
                        <span>Starts: {formatDate(challenge.startDate)}</span>
                      </span>
                      <span className="meta-item">
                        <span>🏁</span>
                        <span>Ends: {formatDate(challenge.endDate)}</span>
                      </span>
                    </div>
                    
                    <p className="challenge-description">{challenge.challengeDescription}</p>
                    
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${calculateChallengeProgress(challenge.startDate, challenge.endDate)}%` }}
                        />
                      </div>
                      <span className="progress-text">
                        {calculateChallengeProgress(challenge.startDate, challenge.endDate)}% complete
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to calculate challenge progress
const calculateChallengeProgress = (startDate, endDate) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = Date.now();
  
  if (now < start) return 0;
  if (now > end) return 100;
  
  const totalDuration = end - start;
  const elapsed = now - start;
  return Math.round((elapsed / totalDuration) * 100);
};

export default UserProfile;
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import './Recipe.css';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8081';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:3000';

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="error-container">
    <h2>Something went wrong</h2>
    <p>{error?.message || 'An unexpected error occurred'}</p>
    <button 
      onClick={resetErrorBoundary}
      className="retry-button"
    >
      Try Again
    </button>
  </div>
);

const RecipeForm = () => {
  const [recipes, setRecipes] = useState([]);
  const [recipe, setRecipe] = useState({
    id: null,
    recipeName: '',
    recipeDescription: '',
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    difficultyLevel: 'Easy',
    category: 'Main Course',
    ingredients: [''],
    instructions: [''],
    mediaItems: [],
    videoUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRef = useRef(null);
  const [mediaValidation, setMediaValidation] = useState({
    hasVideo: false,
    photoCount: 0,
    isValid: false
  });

  const categories = ['Main Course', 'Appetizer', 'Dessert', 'Salad', 'Soup', 'Breakfast'];
  const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('/api/recipes');
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ''] });
  };

  const removeIngredient = (index) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients.splice(index, 1);
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addInstruction = () => {
    setRecipe({ ...recipe, instructions: [...recipe.instructions, ''] });
  };

  const removeInstruction = (index) => {
    const newInstructions = [...recipe.instructions];
    newInstructions.splice(index, 1);
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  const validateMediaRequirements = (mediaItems) => {
    const hasVideo = mediaItems.some(item => item.type === 'video');
    const photoCount = mediaItems.filter(item => item.type === 'photo').length;
    
    // Either one video OR up to 3 photos, but not both
    const isValid = hasVideo ? (photoCount === 0) : (photoCount > 0 && photoCount <= 3);
    
    setMediaValidation({ 
      hasVideo,
      photoCount,
      isValid
    });
    return isValid;
  };

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    // Check if we're trying to upload more than allowed
    const currentPhotos = recipe.mediaItems.filter(item => item.type === 'photo').length;
    const hasVideo = recipe.mediaItems.some(item => item.type === 'video');
    
    for (const file of files) {
      const isVideo = file.type.startsWith('video/');
      
      // Validate based on current state
      if (isVideo) {
        if (hasVideo) {
          alert('Only one video is allowed per recipe');
          continue;
        }
        if (currentPhotos > 0) {
          alert('Cannot add video when photos exist. Please remove photos first.');
          continue;
        }
      } else {
        // Photo upload validation
        if (hasVideo) {
          alert('Cannot add photos when video exists. Please remove video first.');
          continue;
        }
        if (currentPhotos >= 3) {
          alert('Maximum 3 photos allowed');
          continue;
        }
      }

      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', isVideo ? 'video' : 'photo');
      formData.append('existingMedia', JSON.stringify(recipe.mediaItems));

      if (isVideo) {
        try {
          // Create video element to get duration
          const video = document.createElement('video');
          video.preload = 'metadata';

          const duration = await new Promise((resolve, reject) => {
            video.onloadedmetadata = () => {
              URL.revokeObjectURL(video.src);
              if (video.duration > 30) {
                reject(new Error('Video must be 30 seconds or less'));
              }
              resolve(Math.round(video.duration));
            };
            video.onerror = () => reject(new Error('Failed to load video metadata'));
            video.src = URL.createObjectURL(file);
          });

          formData.append('duration', duration);
        } catch (error) {
          alert(error.message);
          continue;
        }
      }

      try {
        setUploadProgress(0);
        const response = await axios.post('/api/recipes/upload-media', 
          formData,
          {
            headers: { 
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json'
            },
            timeout: 300000, // 5 minutes timeout
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          }
        );

        const { filename, type, duration } = response.data;
        const updatedMediaItems = [...recipe.mediaItems, { path: filename, type, duration }];
        setRecipe(prev => ({
          ...prev,
          mediaItems: updatedMediaItems
        }));
        validateMediaRequirements(updatedMediaItems);
      } catch (error) {
        console.error('Error uploading media:', error);
        let errorMessage = 'Failed to upload media';
        
        if (error.response) {
          errorMessage = error.response.data.error || errorMessage;
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'Upload timed out. Please try again with a smaller file or check your connection.';
        } else if (!error.response) {
          errorMessage = 'Cannot connect to server. Please check if the server is running.';
        }
        
        alert(errorMessage);
      } finally {
        setUploadProgress(0);
      }
    }
  };

  const removeMedia = (index) => {
    const updatedMediaItems = recipe.mediaItems.filter((_, i) => i !== index);
    setRecipe(prev => ({
      ...prev,
      mediaItems: updatedMediaItems
    }));
    validateMediaRequirements(updatedMediaItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mediaValidation.isValid) {
      alert('You must include either one video or up to 3 photos');
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`/api/recipes/${recipe.id}`, recipe);
        alert('Recipe Updated Successfully!');
      } else {
        await axios.post('/api/recipes', recipe);
        alert('Recipe Created Successfully!');
      }
      resetForm();
      fetchRecipes();
    } catch (error) {
      console.error('Error saving recipe:', error);
      const errorMessage = error.response?.data?.error || `Failed to ${isEditing ? 'update' : 'create'} recipe.`;
      alert(errorMessage);
    }
  };

  const editRecipe = (recipeToEdit) => {
    setRecipe({
      id: recipeToEdit.id,
      recipeName: recipeToEdit.recipeName,
      recipeDescription: recipeToEdit.recipeDescription,
      prepTime: recipeToEdit.prepTime,
      cookTime: recipeToEdit.cookTime,
      servings: recipeToEdit.servings,
      difficultyLevel: recipeToEdit.difficultyLevel,
      category: recipeToEdit.category,
      ingredients: [...recipeToEdit.ingredients],
      instructions: [...recipeToEdit.instructions],
      mediaItems: [...(recipeToEdit.mediaItems || [])],
      videoUrl: recipeToEdit.videoUrl
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteRecipe = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`/api/recipes/${id}`);
        alert('Recipe deleted successfully!');
        fetchRecipes();
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Failed to delete recipe.');
      }
    }
  };

  const resetForm = () => {
    setRecipe({
      id: null,
      recipeName: '',
      recipeDescription: '',
      prepTime: 0,
      cookTime: 0,
      servings: 1,
      difficultyLevel: 'Easy',
      category: 'Main Course',
      ingredients: [''],
      instructions: [''],
      mediaItems: [],
      videoUrl: ''
    });
    setUploadProgress(0);
    setIsEditing(false);
  };

  // Helper functions for colors
  const getCategoryColor = (category) => {
    const colors = {
      'Main Course': '#FF6B6B',
      'Appetizer': '#4ECDC4',
      'Dessert': '#A0E7A0',
      'Salad': '#FFB347',
      'Soup': '#77A1D3',
      'Breakfast': '#C9A0DC'
    };
    return colors[category] || '#E0E0E0';
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

  return (
    <div className="container">
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // Reset the state here
          setRecipe({
            id: null,
            recipeName: '',
            recipeDescription: '',
            prepTime: 0,
            cookTime: 0,
            servings: 1,
            difficultyLevel: 'Easy',
            category: 'Main Course',
            ingredients: [''],
            instructions: [''],
            mediaItems: [],
            videoUrl: ''
          });
        }}
      >
        <div className="recipe-form">
          <h2 className="section-title">{isEditing ? 'Edit Recipe' : 'Create New Recipe'}</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label className="label">Recipe Name:</label>
              <input
                type="text"
                name="recipeName"
                placeholder="e.g., Spaghetti Carbonara"
                value={recipe.recipeName}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
            
            <div className="form-group">
              <label className="label">Description:</label>
              <textarea
                name="recipeDescription"
                placeholder="Describe your recipe..."
                value={recipe.recipeDescription}
                onChange={handleChange}
                required
                className="input textarea"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="label">Prep Time (min):</label>
                <input
                  type="number"
                  name="prepTime"
                  min="0"
                  value={recipe.prepTime}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              
              <div className="form-group">
                <label className="label">Cook Time (min):</label>
                <input
                  type="number"
                  name="cookTime"
                  min="0"
                  value={recipe.cookTime}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              
              <div className="form-group">
                <label className="label">Servings:</label>
                <input
                  type="number"
                  name="servings"
                  min="1"
                  value={recipe.servings}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="label">Category:</label>
                <select
                  name="category"
                  value={recipe.category}
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
                <label className="label">Difficulty:</label>
                <select
                  name="difficultyLevel"
                  value={recipe.difficultyLevel}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  {difficulties.map((difficulty, index) => (
                    <option key={index} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label className="label">Ingredients:</label>
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="list-item">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    required
                    className="input"
                    placeholder={`Ingredient ${index + 1}`}
                  />
                  {recipe.ingredients.length > 1 && (
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeIngredient(index)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-item-btn"
                onClick={addIngredient}
              >
                + Add Ingredient
              </button>
            </div>
            
            <div className="form-group">
              <label className="label">Instructions:</label>
              {recipe.instructions.map((instruction, index) => (
                <div key={index} className="list-item">
                  <textarea
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    required
                    className="input textarea"
                    placeholder={`Step ${index + 1}`}
                  />
                  {recipe.instructions.length > 1 && (
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeInstruction(index)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-item-btn"
                onClick={addInstruction}
              >
                + Add Instruction Step
              </button>
            </div>
            
            <div className="form-group">
              <label className="label">
                Media Files (3 max, must include at least one video up to 30 seconds):
              </label>
              <div className="media-requirements">
                <p>Media Requirements:</p>
                <ul>
                  <li className={mediaValidation.isValid ? "requirement-met" : "requirement-not-met"}>
                    {mediaValidation.hasVideo ? 
                      '✓ One video uploaded (max 30 sec)' : 
                      (mediaValidation.photoCount > 0 ? 
                        `✓ ${mediaValidation.photoCount}/3 photos uploaded` : 
                        '✗ Add either one video OR up to 3 photos')}
                  </li>
                </ul>
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                multiple
                className="input"
                disabled={recipe.mediaItems.length >= 3}
              />
              {uploadProgress > 0 && (
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
              <div className="media-preview-container">
                {recipe.mediaItems.map((media, index) => (
                  <div key={index} className="media-preview">
                    {media.type === 'photo' ? (
                      <img
                        src={`http://localhost:8081/api/recipes/media/${media.path}`}
                        alt="Preview"
                        className="preview-image"
                      />
                    ) : (
                      <div className="video-container">
                        <video
                          src={`http://localhost:8081/api/recipes/media/${media.path}`}
                          className="preview-video"
                          controls
                        />
                        <span className="video-duration">{media.duration}s</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="remove-media-btn"
                    >
                      Remove {media.type}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="label">Video URL (optional):</label>
                <input
                  type="url"
                  name="videoUrl"
                  placeholder="https://youtube.com/example"
                  value={recipe.videoUrl}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {isEditing ? 'Update Recipe' : 'Create Recipe'}
              </button>
              {isEditing && (
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="recipes-list">
          <h2 className="section-title">Your Recipes</h2>
          {recipes.length === 0 ? (
            <div className="empty-state">
              <p>No recipes available. Create your first recipe!</p>
            </div>
          ) : (
            <div>
              {recipes.map((recipe) => (
                <div key={recipe.id} className="recipe-item">
                  <div className="recipe-header">
                    <h3 className="recipe-title">{recipe.recipeName}</h3>
                    <div className="tag-container">
                      <span className="recipe-category" style={{ backgroundColor: getCategoryColor(recipe.category) }}>
                        {recipe.category}
                      </span>
                      <span className="recipe-difficulty" style={{ backgroundColor: getDifficultyColor(recipe.difficultyLevel) }}>
                        {recipe.difficultyLevel}
                      </span>
                    </div>
                  </div>
                  
                  {recipe.mediaItems && recipe.mediaItems.length > 0 && (
                    <div className="recipe-media-grid">
                      {recipe.mediaItems.map((media, index) => (
                        <div key={index} className="recipe-media">
                          {media.type === 'photo' ? (
                            <img
                              src={`http://localhost:8081/api/recipes/media/${media.path}`}
                              alt={recipe.recipeName}
                              className="thumbnail-image"
                            />
                          ) : (
                            <video
                              src={`http://localhost:8081/api/recipes/media/${media.path}`}
                              className="thumbnail-video"
                              controls
                            />
                          )}
                        </div>
                      ))}
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
                  
                  <div className="recipe-section">
                    <h4 className="section-header">Ingredients</h4>
                    <ul className="list">
                      {recipe.ingredients.map((ingredient, i) => (
                        <li key={i} className="list-item">{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="recipe-section">
                    <h4 className="section-header">Instructions</h4>
                    <ol className="list">
                      {recipe.instructions.map((instruction, i) => (
                        <li key={i} className="list-item">{instruction}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="recipe-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => editRecipe(recipe)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteRecipe(recipe.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default RecipeForm;
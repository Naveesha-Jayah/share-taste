import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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

  const categories = ['Main Course', 'Appetizer', 'Dessert', 'Salad', 'Soup', 'Breakfast'];
  const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/recipes');
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

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (recipe.mediaItems.length + files.length > 3) {
      alert('You can only upload up to 3 media files per recipe');
      return;
    }

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      const isVideo = file.type.startsWith('video/');
      formData.append('type', isVideo ? 'video' : 'photo');

      if (isVideo) {
        // Create video element to get duration
        const video = document.createElement('video');
        video.preload = 'metadata';

        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src);
            if (video.duration > 30) {
              alert('Video must be 30 seconds or less');
              resolve(false);
            }
            formData.append('duration', Math.round(video.duration));
            resolve(true);
          };
          video.src = URL.createObjectURL(file);
        });
      }

      try {
        const response = await axios.post('http://localhost:8081/api/recipes/upload-media', 
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          }
        );

        const { filename, type, duration } = response.data;
        setRecipe(prev => ({
          ...prev,
          mediaItems: [...prev.mediaItems, { path: filename, type, duration }]
        }));
      } catch (error) {
        console.error('Error uploading media:', error);
        alert(error.response?.data?.error || 'Failed to upload media');
      }
    }
    setUploadProgress(0);
  };

  const removeMedia = (index) => {
    setRecipe(prev => ({
      ...prev,
      mediaItems: prev.mediaItems.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8081/api/recipes/${recipe.id}`, recipe);
        alert('Recipe Updated Successfully!');
      } else {
        await axios.post('http://localhost:8081/api/recipes', recipe);
        alert('Recipe Created Successfully!');
      }
      resetForm();
      fetchRecipes();
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} recipe.`);
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
        await axios.delete(`http://localhost:8081/api/recipes/${id}`);
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

  return (
    <div style={styles.container}>
      <div style={styles.recipeForm}>
        <h2 style={styles.sectionTitle}>{isEditing ? 'Edit Recipe' : 'Create New Recipe'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Recipe Name:</label>
            <input
              type="text"
              name="recipeName"
              placeholder="e.g., Spaghetti Carbonara"
              value={recipe.recipeName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Description:</label>
            <textarea
              name="recipeDescription"
              placeholder="Describe your recipe..."
              value={recipe.recipeDescription}
              onChange={handleChange}
              required
              style={{...styles.input, minHeight: '100px'}}
            />
          </div>
          
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Prep Time (min):</label>
              <input
                type="number"
                name="prepTime"
                min="0"
                value={recipe.prepTime}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Cook Time (min):</label>
              <input
                type="number"
                name="cookTime"
                min="0"
                value={recipe.cookTime}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Servings:</label>
              <input
                type="number"
                name="servings"
                min="1"
                value={recipe.servings}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>
          
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category:</label>
              <select
                name="category"
                value={recipe.category}
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
              <label style={styles.label}>Difficulty:</label>
              <select
                name="difficultyLevel"
                value={recipe.difficultyLevel}
                onChange={handleChange}
                required
                style={styles.input}
              >
                {difficulties.map((difficulty, index) => (
                  <option key={index} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Ingredients:</label>
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} style={styles.listItem}>
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  required
                  style={styles.input}
                  placeholder={`Ingredient ${index + 1}`}
                />
                {recipe.ingredients.length > 1 && (
                  <button
                    type="button"
                    style={styles.removeItemBtn}
                    onClick={() => removeIngredient(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              style={styles.addItemBtn}
              onClick={addIngredient}
            >
              + Add Ingredient
            </button>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Instructions:</label>
            {recipe.instructions.map((instruction, index) => (
              <div key={index} style={styles.listItem}>
                <textarea
                  value={instruction}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  required
                  style={{...styles.input, minHeight: '80px'}}
                  placeholder={`Step ${index + 1}`}
                />
                {recipe.instructions.length > 1 && (
                  <button
                    type="button"
                    style={styles.removeItemBtn}
                    onClick={() => removeInstruction(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              style={styles.addItemBtn}
              onClick={addInstruction}
            >
              + Add Instruction Step
            </button>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Media Files (Max 3):</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              multiple
              style={styles.input}
              disabled={recipe.mediaItems.length >= 3}
            />
            {uploadProgress > 0 && (
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${uploadProgress}%`
                  }}
                />
              </div>
            )}
            <div style={styles.mediaPreviewContainer}>
              {recipe.mediaItems.map((media, index) => (
                <div key={index} style={styles.mediaPreview}>
                  {media.type === 'photo' ? (
                    <img
                      src={`http://localhost:8081/api/recipes/media/${media.path}`}
                      alt="Preview"
                      style={styles.previewImage}
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      src={`http://localhost:8081/api/recipes/media/${media.path}`}
                      style={styles.previewVideo}
                      controls
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    style={styles.removeMediaBtn}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Video URL (optional):</label>
              <input
                type="url"
                name="videoUrl"
                placeholder="https://youtube.com/example"
                value={recipe.videoUrl}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          
          <div style={styles.formActions}>
            <button type="submit" style={styles.submitBtn}>
              {isEditing ? 'Update Recipe' : 'Create Recipe'}
            </button>
            {isEditing && (
              <button type="button" style={styles.cancelBtn} onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.recipesList}>
        <h2 style={styles.sectionTitle}>Your Recipes</h2>
        {recipes.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No recipes available. Create your first recipe!</p>
          </div>
        ) : (
          <div>
            {recipes.map((recipe) => (
              <div key={recipe.id} style={styles.recipeItem}>
                <div style={styles.recipeHeader}>
                  <h3 style={styles.recipeTitle}>{recipe.recipeName}</h3>
                  <div style={styles.tagContainer}>
                    <span style={{...styles.recipeCategory, backgroundColor: getCategoryColor(recipe.category)}}>
                      {recipe.category}
                    </span>
                    <span style={{...styles.recipeDifficulty, backgroundColor: getDifficultyColor(recipe.difficultyLevel)}}>
                      {recipe.difficultyLevel}
                    </span>
                  </div>
                </div>
                
                {recipe.mediaItems && recipe.mediaItems.length > 0 && (
                  <div style={styles.recipeMediaGrid}>
                    {recipe.mediaItems.map((media, index) => (
                      <div key={index} style={styles.recipeMedia}>
                        {media.type === 'photo' ? (
                          <img
                            src={`http://localhost:8081/api/recipes/media/${media.path}`}
                            alt={recipe.recipeName}
                            style={styles.thumbnailImage}
                          />
                        ) : (
                          <video
                            src={`http://localhost:8081/api/recipes/media/${media.path}`}
                            style={styles.thumbnailVideo}
                            controls
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div style={styles.recipeMeta}>
                  <span style={styles.metaItem}>
                    <span>⏱️</span>
                    <span>Prep: {recipe.prepTime} min</span>
                  </span>
                  <span style={styles.metaItem}>
                    <span>🍳</span>
                    <span>Cook: {recipe.cookTime} min</span>
                  </span>
                  <span style={styles.metaItem}>
                    <span>🍽️</span>
                    <span>Servings: {recipe.servings}</span>
                  </span>
                </div>
                
                <p style={styles.recipeDescription}>{recipe.recipeDescription}</p>
                
                <div style={styles.recipeSection}>
                  <h4 style={styles.sectionHeader}>Ingredients</h4>
                  <ul style={styles.list}>
                    {recipe.ingredients.map((ingredient, i) => (
                      <li key={i} style={styles.listItem}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                
                <div style={styles.recipeSection}>
                  <h4 style={styles.sectionHeader}>Instructions</h4>
                  <ol style={styles.list}>
                    {recipe.instructions.map((instruction, i) => (
                      <li key={i} style={styles.listItem}>{instruction}</li>
                    ))}
                  </ol>
                </div>
                
                <div style={styles.recipeActions}>
                  <button 
                    style={styles.editBtn}
                    onClick={() => editRecipe(recipe)}
                  >
                    Edit
                  </button>
                  <button 
                    style={styles.deleteBtn}
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
    </div>
  );
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

const styles = {
  container: {
    display: 'flex',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#F7FFF7',
    minHeight: '100vh',
  },
  recipeForm: {
    flex: '0 0 500px',
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: '20px',
    height: 'fit-content',
    overflowY: 'auto',
    maxHeight: '95vh',
  },
  recipesList: {
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
  formRow: {
    display: 'flex',
    gap: '20px',
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
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  addItemBtn: {
    padding: '8px 12px',
    border: '1px dashed #ddd',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: '#555',
    fontSize: '14px',
    marginTop: '5px',
  },
  removeItemBtn: {
    padding: '5px 10px',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: '#FF6B6B',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
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
  recipeItem: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s',
  },
  recipeTitle: {
    margin: '0 0 15px 0',
    color: '#292F36',
    fontSize: '20px',
    fontWeight: 700,
  },
  recipeDescription: {
    margin: '8px 0',
    color: '#555',
    fontSize: '15px',
    lineHeight: 1.5,
  },
  recipeSection: {
    margin: '15px 0',
  },
  sectionHeader: {
    margin: '10px 0',
    color: '#292F36',
    fontSize: '16px',
  },
  list: {
    paddingLeft: '20px',
    margin: '10px 0',
  },
  recipeActions: {
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
  recipeMeta: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#555',
    fontSize: '14px',
  },
  recipeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  recipeCategory: {
    color: 'white',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
  },
  recipeDifficulty: {
    color: 'white',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
  },
  tagContainer: {
    display: 'flex',
    gap: '10px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    color: '#555',
  },
  progressBar: {
    width: '100%',
    height: '4px',
    backgroundColor: '#f0f0f0',
    borderRadius: '2px',
    marginTop: '8px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: '2px',
    transition: 'width 0.3s ease-in-out',
  },
  mediaPreviewContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '10px',
    marginTop: '10px',
  },
  mediaPreview: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  previewVideo: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  removeMediaBtn: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    backgroundColor: 'rgba(255, 107, 107, 0.9)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 8px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  recipeMediaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '15px',
  },
  recipeMedia: {
    borderRadius: '8px',
    overflow: 'hidden',
    aspectRatio: '16/9',
  },
  thumbnailVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  '@media (max-width: 768px)': {
    container: {
      flexDirection: 'column',
    },
    recipeForm: {
      position: 'static',
      flex: 1,
      width: '100%',
    },
    formRow: {
      flexDirection: 'column',
      gap: '20px',
    },
  },
};

export default RecipeForm;
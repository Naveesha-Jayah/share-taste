import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Challenge.css';

const ChallengeForm = () => {
  const [challenges, setChallenges] = useState([]);
  const [challenge, setChallenge] = useState({
    id: null,
    challengeTitle: '',
    challengeDescription: '',
    category: 'Fitness',
    difficulty: 'Easy',
    startDate: '',
    endDate: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const categories = ['Fitness', 'Nutrition', 'Mindfulness', 'Productivity', 'Learning', 'Social'];
  const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('http://localhost:8081/challenges/challenges');
      setChallenges(response.data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChallenge({ ...challenge, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8081/challenges/challenges/${challenge.id}`, challenge);
        alert('Challenge Updated Successfully!');
      } else {
        await axios.post('http://localhost:8081/challenges', challenge);
        alert('Challenge Created Successfully!');
      }
      resetForm();
      fetchChallenges();
    } catch (error) {
      console.error('Error saving challenge:', error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} challenge.`);
    }
  };

  const editChallenge = (challengeToEdit) => {
    setChallenge({
      id: challengeToEdit.id,
      challengeTitle: challengeToEdit.challengeTitle,
      challengeDescription: challengeToEdit.challengeDescription,
      category: challengeToEdit.category,
      difficulty: challengeToEdit.difficulty,
      startDate: challengeToEdit.startDate,
      endDate: challengeToEdit.endDate
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteChallenge = async (id) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        await axios.delete(`http://localhost:8081/challenges/challenges/${id}`);
        alert('Challenge deleted successfully!');
        fetchChallenges();
      } catch (error) {
        console.error('Error deleting challenge:', error);
        alert('Failed to delete challenge.');
      }
    }
  };

  const resetForm = () => {
    setChallenge({
      id: null,
      challengeTitle: '',
      challengeDescription: '',
      category: 'Fitness',
      difficulty: 'Easy',
      startDate: '',
      endDate: ''
    });
    setIsEditing(false);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Fitness': '#FF6B6B',
      'Nutrition': '#4ECDC4',
      'Mindfulness': '#A0E7A0',
      'Productivity': '#FFB347',
      'Learning': '#77A1D3',
      'Social': '#C9A0DC'
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
    <div className="challenge-container">
      <div className="challenge-form">
        <h2 className="section-title">{isEditing ? 'Edit Challenge' : 'Create New Challenge'}</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="label">Title:</label>
            <input
              type="text"
              name="challengeTitle"
              placeholder="e.g., 30-Day Fitness Challenge"
              value={challenge.challengeTitle}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          
          <div className="form-group">
            <label className="label">Description:</label>
            <textarea
              name="challengeDescription"
              placeholder="Describe the challenge rules and benefits..."
              value={challenge.challengeDescription}
              onChange={handleChange}
              required
              className="input textarea"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="label">Category:</label>
              <select
                name="category"
                value={challenge.category}
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
                name="difficulty"
                value={challenge.difficulty}
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
          
          <div className="form-row">
            <div className="form-group">
              <label className="label">Start Date:</label>
              <input
                type="date"
                name="startDate"
                value={challenge.startDate}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
            
            <div className="form-group">
              <label className="label">End Date:</label>
              <input
                type="date"
                name="endDate"
                value={challenge.endDate}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {isEditing ? 'Update Challenge' : 'Create Challenge'}
            </button>
            {isEditing && (
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="challenges-list">
        <h2 className="section-title">Current Challenges</h2>
        {challenges.length === 0 ? (
          <div className="empty-state">
            <p>No challenges available. Create your first challenge!</p>
          </div>
        ) : (
          <div>
            {challenges.map((challenge) => (
              <div key={challenge.id} className="challenge-item">
                <div className="challenge-header">
                  <h3 className="challenge-title">{challenge.challengeTitle}</h3>
                  <div className="tag-container">
                    <span 
                      className="challenge-category" 
                      style={{ backgroundColor: getCategoryColor(challenge.category) }}
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
                    <span>Starts: {new Date(challenge.startDate).toLocaleDateString()}</span>
                  </span>
                  <span className="meta-item">
                    <span>🏁</span>
                    <span>Ends: {new Date(challenge.endDate).toLocaleDateString()}</span>
                  </span>
                </div>
                
                <p className="challenge-description">{challenge.challengeDescription}</p>
                
                <div className="challenge-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => editChallenge(challenge)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteChallenge(challenge.id)}
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

export default ChallengeForm;
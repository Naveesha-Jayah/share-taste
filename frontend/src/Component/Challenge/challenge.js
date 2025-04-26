import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  return (
    <div style={styles.container}>
      <div style={styles.challengeForm}>
        <h2 style={styles.sectionTitle}>{isEditing ? 'Edit Challenge' : 'Create New Challenge'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title:</label>
            <input
              type="text"
              name="challengeTitle"
              placeholder="e.g., 30-Day Fitness Challenge"
              value={challenge.challengeTitle}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Description:</label>
            <textarea
              name="challengeDescription"
              placeholder="Describe the challenge rules and benefits..."
              value={challenge.challengeDescription}
              onChange={handleChange}
              required
              style={{...styles.input, minHeight: '120px'}}
            />
          </div>
          
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category:</label>
              <select
                name="category"
                value={challenge.category}
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
                name="difficulty"
                value={challenge.difficulty}
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
          
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Start Date:</label>
              <input
                type="date"
                name="startDate"
                value={challenge.startDate}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>End Date:</label>
              <input
                type="date"
                name="endDate"
                value={challenge.endDate}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>
          
          <div style={styles.formActions}>
            <button type="submit" style={styles.submitBtn}>
              {isEditing ? 'Update Challenge' : 'Create Challenge'}
            </button>
            {isEditing && (
              <button type="button" style={styles.cancelBtn} onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.challengesList}>
        <h2 style={styles.sectionTitle}>Current Challenges</h2>
        {challenges.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No challenges available. Create your first challenge!</p>
          </div>
        ) : (
          <div>
            {challenges.map((challenge) => (
              <div key={challenge.id} style={styles.challengeItem}>
                <div style={styles.challengeHeader}>
                  <h3 style={styles.challengeTitle}>{challenge.challengeTitle}</h3>
                  <div style={styles.tagContainer}>
                    <span style={{...styles.challengeCategory, backgroundColor: getCategoryColor(challenge.category)}}>
                      {challenge.category}
                    </span>
                    <span style={{...styles.challengeDifficulty, backgroundColor: getDifficultyColor(challenge.difficulty)}}>
                      {challenge.difficulty}
                    </span>
                  </div>
                </div>
                
                <div style={styles.challengeMeta}>
                  <span style={styles.metaItem}>
                    <span>📅</span>
                    <span>Starts: {new Date(challenge.startDate).toLocaleDateString()}</span>
                  </span>
                  <span style={styles.metaItem}>
                    <span>🏁</span>
                    <span>Ends: {new Date(challenge.endDate).toLocaleDateString()}</span>
                  </span>
                </div>
                
                <p style={styles.challengeDescription}>{challenge.challengeDescription}</p>
                
                <div style={styles.challengeActions}>
                  <button 
                    style={styles.editBtn}
                    onClick={() => editChallenge(challenge)}
                  >
                    Edit
                  </button>
                  <button 
                    style={styles.deleteBtn}
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

// Helper functions for colors
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
  challengeForm: {
    flex: '0 0 350px',
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: '20px',
    height: 'fit-content',
  },
  challengesList: {
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
  challengeItem: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s',
  },
  challengeTitle: {
    margin: '0 0 15px 0',
    color: '#292F36',
    fontSize: '20px',
    fontWeight: 700,
  },
  challengeDescription: {
    margin: '8px 0',
    color: '#555',
    fontSize: '15px',
    lineHeight: 1.5,
  },
  challengeActions: {
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
  challengeMeta: {
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
  challengeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  challengeCategory: {
    color: 'white',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
  },
  challengeDifficulty: {
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
  '@media (max-width: 768px)': {
    container: {
      flexDirection: 'column',
    },
    challengeForm: {
      position: 'static',
      flex: 1,
    },
    formRow: {
      flexDirection: 'column',
      gap: '20px',
    },
  },
};

export default ChallengeForm;
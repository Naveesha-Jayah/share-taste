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
    <div className="challenge-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .challenge-container {
          display: flex;
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #f8fafc;
          min-height: 100vh;
        }

        .challenge-form {
          flex: 0 0 380px;
          background: white;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 30px;
          height: fit-content;
          border: 1px solid #e2e8f0;
        }

        .challenges-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        h2 {
          color: #1e293b;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e2e8f0;
        }

        .form-group {
          margin-bottom: 25px;
        }

        label {
          display: block;
          margin-bottom: 10px;
          font-weight: 600;
          color: #334155;
          font-size: 14px;
        }

        input, textarea, select {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 15px;
          background-color: #fff;
          transition: all 0.2s;
          color: #334155;
        }

        input:focus, textarea:focus, select:focus {
          border-color: #6366f1;
          outline: none;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        textarea {
          min-height: 120px;
          resize: vertical;
          line-height: 1.5;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 30px;
        }

        button {
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .submit-btn {
          background-color: #6366f1;
          color: white;
          flex: 1;
        }

        .submit-btn:hover {
          background-color: #4f46e5;
          transform: translateY(-1px);
        }

        .cancel-btn {
          background-color: #f1f5f9;
          color: #64748b;
        }

        .cancel-btn:hover {
          background-color: #e2e8f0;
          transform: translateY(-1px);
        }

        .challenge-item {
          background: white;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.2s;
          border: 1px solid #e2e8f0;
        }

        .challenge-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
        }

        .challenge-item h3 {
          margin: 0 0 15px 0;
          color: #1e293b;
          font-size: 20px;
          font-weight: 700;
        }

        .challenge-item p {
          margin: 10px 0;
          color: #475569;
          font-size: 15px;
          line-height: 1.6;
        }

        .challenge-actions {
          display: flex;
          gap: 12px;
          margin-top: 25px;
        }

        .edit-btn {
          background-color: #6366f1;
          color: white;
          padding: 10px 16px;
        }

        .edit-btn:hover {
          background-color: #4f46e5;
          transform: translateY(-1px);
        }

        .delete-btn {
          background-color: #ef4444;
          color: white;
          padding: 10px 16px;
        }

        .delete-btn:hover {
          background-color: #dc2626;
          transform: translateY(-1px);
        }

        .challenge-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 20px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
        }

        .meta-icon {
          color: #6366f1;
          font-size: 16px;
        }

        .challenge-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .challenge-category {
          background-color: #e0e7ff;
          color: #4338ca;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
        }

        .challenge-difficulty {
          background-color: #ede9fe;
          color: #6d28d9;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
        }

        .date-range {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }

        .date-group {
          flex: 1;
        }

        .empty-state {
          background: white;
          border-radius: 16px;
          padding: 40px 20px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }

        .empty-state p {
          color: #64748b;
          margin-top: 15px;
        }

        .tag-container {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .challenge-container {
            flex-direction: column;
          }
          
          .challenge-form {
            position: static;
            flex: 1;
          }
          
          .date-range {
            flex-direction: column;
            gap: 20px;
          }
        }
      `}</style>

      <div className="challenge-form">
        <h2>{isEditing ? 'Edit Challenge' : 'Create New Challenge'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="challengeTitle"
              placeholder="e.g., 30-Day Fitness Challenge"
              value={challenge.challengeTitle}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="challengeDescription"
              placeholder="Describe the challenge rules and benefits..."
              value={challenge.challengeDescription}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Category:</label>
            <select
              name="category"
              value={challenge.category}
              onChange={handleChange}
              required
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Difficulty:</label>
            <select
              name="difficulty"
              value={challenge.difficulty}
              onChange={handleChange}
              required
            >
              {difficulties.map((difficulty, index) => (
                <option key={index} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
          
          <div className="date-range">
            <div className="form-group date-group">
              <label>Start Date:</label>
              <input
                type="date"
                name="startDate"
                value={challenge.startDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group date-group">
              <label>End Date:</label>
              <input
                type="date"
                name="endDate"
                value={challenge.endDate}
                onChange={handleChange}
                required
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
        <h2>Current Challenges</h2>
        {challenges.length === 0 ? (
          <div className="empty-state">
            <h3>No challenges yet</h3>
            <p>Create your first challenge to get started!</p>
          </div>
        ) : (
          <div>
            {challenges.map((challenge) => (
              <div key={challenge.id} className="challenge-item">
                <div className="challenge-header">
                  <h3>{challenge.challengeTitle}</h3>
                  <div className="tag-container">
                    <span className="challenge-category">{challenge.category}</span>
                    <span className="challenge-difficulty">{challenge.difficulty}</span>
                  </div>
                </div>
                
                <div className="challenge-meta">
                  <span className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span><strong>Starts:</strong> {new Date(challenge.startDate).toLocaleDateString()}</span>
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">🏁</span>
                    <span><strong>Ends:</strong> {new Date(challenge.endDate).toLocaleDateString()}</span>
                  </span>
                </div>
                
                <p>{challenge.challengeDescription}</p>
                
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
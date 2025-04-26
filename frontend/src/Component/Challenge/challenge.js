import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChallengeForm = () => {
  const [challenges, setChallenges] = useState([]);
  const [challenge, setChallenge] = useState({
    id: null,
    challengeTitle: '',
    challengeDescription: '',
    category: '',
    difficulty: 'Easy',
    startDate: '',
    endDate: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('http://localhost:8081/challenges');
      setChallenges(response.data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const handleChange = (e) => {
    setChallenge({ ...challenge, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8081/challenges/${challenge.id}`, challenge);
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
      startDate: challengeToEdit.startDate.split('T')[0],
      endDate: challengeToEdit.endDate.split('T')[0],
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteChallenge = async (id) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        await axios.delete(`http://localhost:8081/challenges/${id}`);
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
      category: '',
      difficulty: 'Easy',
      startDate: '',
      endDate: '',
    });
    setIsEditing(false);
  };

  return (
    <div className="challenge-container">
      <style jsx>{`
        .challenge-container {
          display: flex;
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
          background-color: #f0f2f5;
          min-height: 100vh;
        }

        .challenge-form {
          flex: 0 0 350px;
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 20px;
          height: fit-content;
        }

        .challenges-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        h2 {
          color: #1c1e21;
          font-size: 20px;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #dddfe2;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          color: #1c1e21;
        }

        input, textarea, select {
          width: 100%;
          padding: 10px;
          border: 1px solid #dddfe2;
          border-radius: 6px;
          font-size: 15px;
          background-color: #f0f2f5;
        }

        textarea {
          min-height: 100px;
          resize: vertical;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        button {
          padding: 10px 15px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-btn {
          background-color: #1877f2;
          color: white;
          flex: 1;
        }

        .submit-btn:hover {
          background-color: #166fe5;
        }

        .cancel-btn {
          background-color: #e4e6eb;
          color: #4b4f56;
        }

        .cancel-btn:hover {
          background-color: #d8dadf;
        }

        .challenge-item {
          background: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .challenge-item h3 {
          margin: 0 0 10px 0;
          color: #1c1e21;
          font-size: 18px;
        }

        .challenge-item p {
          margin: 5px 0;
          color: #65676b;
          font-size: 14px;
        }

        .challenge-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .edit-btn {
          background-color: #e7f3ff;
          color: #1877f2;
        }

        .edit-btn:hover {
          background-color: #d8e7ff;
        }

        .delete-btn {
          background-color: #ffecec;
          color: #fa383e;
        }

        .delete-btn:hover {
          background-color: #ffdddd;
        }

        @media (max-width: 768px) {
          .challenge-container {
            flex-direction: column;
          }
          
          .challenge-form {
            position: static;
            flex: 1;
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
              placeholder="Challenge Title"
              value={challenge.challengeTitle}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="challengeDescription"
              placeholder="Challenge Description"
              value={challenge.challengeDescription}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Category:</label>
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={challenge.category}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Difficulty:</label>
            <select
              name="difficulty"
              value={challenge.difficulty}
              onChange={handleChange}
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={challenge.startDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={challenge.endDate}
              onChange={handleChange}
              required
            />
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
          <p>No challenges available</p>
        ) : (
          <div>
            {challenges.map((challenge) => (
              <div key={challenge.id} className="challenge-item">
                <h3>{challenge.challengeTitle}</h3>
                <p><strong>Category:</strong> {challenge.category}</p>
                <p><strong>Difficulty:</strong> {challenge.difficulty}</p>
                <p><strong>Duration:</strong> {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}</p>
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
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewChallenges = () => {
  const [challenges, setChallenges] = useState([]);

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

  return (
    <div className="view-challenges">
      <h2>All Challenges</h2>
      <ul>
        {challenges.map((challenge) => (
          <li key={challenge.id}>
            <h3>{challenge.challengeTitle}</h3>
            <p>{challenge.challengeDescription}</p>
            <p><strong>Category:</strong> {challenge.category}</p>
            <p><strong>Difficulty:</strong> {challenge.difficulty}</p>
            <p><strong>Start:</strong> {challenge.startDate}</p>
            <p><strong>End:</strong> {challenge.endDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewChallenges;

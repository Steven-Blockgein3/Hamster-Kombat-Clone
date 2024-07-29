import React, { useState, useEffect } from 'react';
import { getLeaderboard, setLeaderboard } from '../utils/localStorage';

function Leaderboard() {
  const [leaderboard, setLeaderboardState] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedLeaderboard = getLeaderboard();
    if (storedLeaderboard.length === 0) {
      // Initialize some default leaderboard data if none exists
      const defaultLeaderboard = [
        { id: 'user1', coins: 1000, level: 10 },
        { id: 'user2', coins: 800, level: 8 },
        { id: 'user3', coins: 600, level: 6 },
        { id: 'user4', coins: 400, level: 4 },
        { id: 'user5', coins: 200, level: 2 },
      ];
      setLeaderboard(defaultLeaderboard);
      setLeaderboardState(defaultLeaderboard);
    } else {
      setLeaderboardState(storedLeaderboard);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <div className="leaderboard">
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      {leaderboard.length > 0 ? (
        <ol>
          {leaderboard.map((user, index) => (
            <li key={user.id} className="mb-2">
              {index + 1}. {user.id.substring(0, 6)} - {user.coins} coins (Level {user.level})
            </li>
          ))}
        </ol>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default Leaderboard;

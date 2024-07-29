import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('coins', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        setLeaderboard(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
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

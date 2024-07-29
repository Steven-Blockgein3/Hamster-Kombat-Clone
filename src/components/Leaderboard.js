import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const q = query(collection(db, 'users'), orderBy('coins', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      setLeaderboard(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard">
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      <ol>
        {leaderboard.map((user, index) => (
          <li key={user.id} className="mb-2">
            {index + 1}. {user.id.substring(0, 6)} - {user.coins} coins (Level {user.level})
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Leaderboard;

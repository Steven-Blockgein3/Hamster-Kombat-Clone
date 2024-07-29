import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, analytics, rtdb } from '../firebase';
import { motion } from 'framer-motion';
import { FaCoins } from 'react-icons/fa';
import { logEvent } from 'firebase/analytics';
import { ref, onValue } from 'firebase/database';

function Home() {
  const { user, setUser } = useOutletContext();
  const [isMining, setIsMining] = useState(false);
  const [miningPower, setMiningPower] = useState(1);
  const [message, setMessage] = useState('');
  const [globalEvent, setGlobalEvent] = useState(null);

  const updateUserData = useCallback(async (newData) => {
    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, newData);
    setUser(prevUser => ({ ...prevUser, ...newData }));
  }, [user.id, setUser]);

  useEffect(() => {
    let miningInterval;
    let energyInterval;

    if (isMining && user.energy > 0) {
      miningInterval = setInterval(() => {
        const miningReward = miningPower * (globalEvent?.coinMultiplier || 1);
        updateUserData({
          coins: user.coins + miningReward,
          energy: Math.max(user.energy - 1, 0)
        });
      }, 1000);
    } else {
      setIsMining(false);
    }

    // Energy regeneration
    energyInterval = setInterval(() => {
      if (user.energy < 100) {
        updateUserData({ energy: Math.min(user.energy + 1, 100) });
      }
    }, 10000);  // Regenerate 1 energy every 10 seconds

    return () => {
      clearInterval(miningInterval);
      clearInterval(energyInterval);
    };
  }, [isMining, user.energy, user.coins, updateUserData, miningPower, globalEvent]);

  useEffect(() => {
    // Level up system
    const requiredCoins = user.level * 100;
    if (user.coins >= requiredCoins) {
      updateUserData({ 
        level: user.level + 1, 
        coins: user.coins - requiredCoins,
        achievements: arrayUnion(`Reached Level ${user.level + 1}`)
      });
      setMessage(`Congratulations! You've reached level ${user.level + 1}!`);
      setMiningPower(prevPower => prevPower + 1);
      logEvent(analytics, 'level_up', { level: user.level + 1 });
    }
  }, [user.coins, user.level, updateUserData]);

  useEffect(() => {
    // Listen for global events
    const eventRef = ref(rtdb, 'globalEvents');
    const unsubscribe = onValue(eventRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGlobalEvent(data);
        setMessage(`Global Event: ${data.name}! ${data.description}`);
      } else {
        setGlobalEvent(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleMining = () => {
    if (user.energy > 0) {
      setIsMining(!isMining);
      logEvent(analytics, isMining ? 'stop_mining' : 'start_mining');
    } else {
      setMessage("Not enough energy to mine!");
    }
  };

  return (
    <div className="home">
      <h2 className="text-2xl font-bold mb-4">Mining Dashboard</h2>
      <div className="mb-4">
        <p>Coins: {user.coins}</p>
        <p>Energy: {user.energy}/100</p>
        <p>Level: {user.level}</p>
        <p>Mining Power: {miningPower}</p>
      </div>
      <motion.button
        className={`px-4 py-2 rounded text-white ${isMining ? 'bg-red-500' : 'bg-green-500'}`}
        onClick={handleMining}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMining ? 'Stop Mining' : 'Start Mining'}
      </motion.button>
      {isMining && (
        <motion.div
          className="mt-4"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <FaCoins size={40} color="#FFD700" />
        </motion.div>
      )}
      {message && (
        <motion.p
          className="mt-4 text-green-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {message}
        </motion.p>
      )}
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Next Level</h3>
        <p>Coins needed: {user.level * 100 - user.coins}</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${(user.coins / (user.level * 100)) * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Achievements</h3>
        <ul>
          {user.achievements && user.achievements.map((achievement, index) => (
            <li key={index}>{achievement}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;

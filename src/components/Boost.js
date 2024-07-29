import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Boost() {
  const { user, setUser } = useOutletContext();
  const [confirmBoost, setConfirmBoost] = useState(null);

  const handleBoost = async (type) => {
    let updatedUser = { ...user };

    switch (type) {
      case 'energy':
        updatedUser.energy = Math.min((user.energy || 0) + 50, user.maxEnergy || 100);
        break;
      case 'coins':
        updatedUser.coins = (user.coins || 0) + 100;
        break;
      case 'level':
        updatedUser.level = (user.level || 1) + 1;
        break;
      default:
        return;
    }

    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, updatedUser);
      setUser(updatedUser);
      console.log(`Successfully boosted ${type}!`);
    } catch (error) {
      console.error(`Error boosting ${type}:`, error);
      console.error(`Failed to boost ${type}. Please try again.`);
    }
    setConfirmBoost(null);
  };

  const renderConfirmDialog = () => {
    if (!confirmBoost) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded">
          <p>Are you sure you want to boost {confirmBoost}?</p>
          <div className="mt-4 flex justify-end">
            <button
              className="mr-2 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setConfirmBoost(null)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => handleBoost(confirmBoost)}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="boost">
      <h2 className="text-xl font-bold mb-4">Boosts</h2>
      <button
        className="mb-2 px-4 py-2 rounded bg-yellow-500 text-white"
        onClick={() => setConfirmBoost('energy')}
      >
        Boost Energy (+50)
      </button>
      <button
        className="mb-2 px-4 py-2 rounded bg-green-500 text-white"
        onClick={() => setConfirmBoost('coins')}
      >
        Boost Coins (+100)
      </button>
      <button
        className="mb-2 px-4 py-2 rounded bg-purple-500 text-white"
        onClick={() => setConfirmBoost('level')}
      >
        Boost Level (+1)
      </button>
      {renderConfirmDialog()}
    </div>
  );
}

export default Boost;

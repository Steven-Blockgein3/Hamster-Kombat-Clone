import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { doc, updateDoc, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

function Marketplace() {
  const { user, setUser } = useOutletContext();
  const [loading, setLoading] = useState(false);

  const upgrades = [
    { name: 'Mining Speed Boost', cost: 100, effect: 'Increases mining speed by 10%' },
    { name: 'Energy Capacity Upgrade', cost: 200, effect: 'Increases max energy by 20' },
    { name: 'Coin Multiplier', cost: 300, effect: 'Increases coin gain by 5%' },
  ];

  const buyUpgrade = async (upgrade) => {
    if (user.coins < upgrade.cost) {
      toast.warning("Not enough coins to purchase this upgrade.");
      return;
    }

    setLoading(true);
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', user.id);
        const userDoc = await transaction.get(userRef);
        
        if (!userDoc.exists()) {
          throw "User document does not exist!";
        }

        const userData = userDoc.data();
        if (userData.coins < upgrade.cost) {
          throw "Not enough coins!";
        }

        const updatedUser = { 
          ...userData, 
          coins: (userData.coins || 0) - upgrade.cost,
          miningSpeed: userData.miningSpeed || 1,
          maxEnergy: userData.maxEnergy || 100,
          coinMultiplier: userData.coinMultiplier || 1
        };
        
        // Apply upgrade effect
        switch(upgrade.name) {
          case 'Mining Speed Boost':
            updatedUser.miningSpeed = (updatedUser.miningSpeed || 1) * 1.1;
            break;
          case 'Energy Capacity Upgrade':
            updatedUser.maxEnergy = (updatedUser.maxEnergy || 100) + 20;
            break;
          case 'Coin Multiplier':
            updatedUser.coinMultiplier = (updatedUser.coinMultiplier || 1) * 1.05;
            break;
          default:
            throw "Invalid upgrade!";
        }

        transaction.update(userRef, updatedUser);
        setUser(updatedUser);
      });

      toast.success(`Successfully purchased ${upgrade.name}!`);
    } catch (error) {
      console.error("Error buying upgrade:", error);
      toast.error(typeof error === 'string' ? error : "Failed to purchase upgrade. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="marketplace">
      <h2 className="text-xl font-bold mb-4">Marketplace</h2>
      {upgrades.map((upgrade, index) => (
        <div key={index} className="mb-4 p-4 border rounded">
          <h3 className="font-semibold">{upgrade.name}</h3>
          <p>{upgrade.effect}</p>
          <p>Cost: {upgrade.cost} coins</p>
          <button
            className={`mt-2 px-4 py-2 rounded ${user.coins >= upgrade.cost ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'} text-white`}
            onClick={() => buyUpgrade(upgrade)}
            disabled={loading || user.coins < upgrade.cost}
          >
            {loading ? 'Processing...' : 'Buy Upgrade'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Marketplace;

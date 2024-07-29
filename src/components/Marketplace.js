import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

function Marketplace() {
  const { user, setUser } = useOutletContext();

  const upgrades = [
    { name: 'Mining Speed Boost', cost: 100, effect: 'Increases mining speed by 10%' },
    { name: 'Energy Capacity Upgrade', cost: 200, effect: 'Increases max energy by 20' },
    { name: 'Coin Multiplier', cost: 300, effect: 'Increases coin gain by 5%' },
  ];

  const buyUpgrade = async (upgrade) => {
    if (user.coins >= upgrade.cost) {
      try {
        const updatedUser = { ...user, coins: user.coins - upgrade.cost };
        
        // Apply upgrade effect (this is a simplified example)
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
            break;
        }

        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, updatedUser);
        setUser(updatedUser);
        toast.success(`Successfully purchased ${upgrade.name}!`);
      } catch (error) {
        console.error("Error buying upgrade:", error);
        toast.error("Failed to purchase upgrade. Please try again.");
      }
    } else {
      toast.warning("Not enough coins to purchase this upgrade.");
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
            className="mt-2 px-4 py-2 rounded bg-blue-500 text-white"
            onClick={() => buyUpgrade(upgrade)}
            disabled={user.coins < upgrade.cost}
          >
            Buy Upgrade
          </button>
        </div>
      ))}
    </div>
  );
}

export default Marketplace;

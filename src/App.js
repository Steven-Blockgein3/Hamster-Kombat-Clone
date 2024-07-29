import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { getUser, setUser, updateUser } from './utils/localStorage';

function App() {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUserState(storedUser);
    } else {
      const newUser = {
        id: 'user-' + Date.now(),
        coins: 0,
        energy: 100,
        level: 1,
        achievements: [],
        lastDailyReward: null,
      };
      setUser(newUser);
      setUserState(newUser);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Check for daily reward
    if (user) {
      const now = new Date();
      const lastReward = user.lastDailyReward ? new Date(user.lastDailyReward) : null;
      if (!lastReward || now.getDate() !== lastReward.getDate()) {
        // Give daily reward
        const updatedUser = updateUser({ 
          coins: (user.coins || 0) + 50, 
          lastDailyReward: now.toISOString() 
        });
        setUserState(updatedUser);
      }
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to access this application.</div>;
  }

  return (
    <div className="app">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold">Telegram Web App</h1>
        <div>
          <p>Coins: {user.coins}</p>
          <p>Energy: {user.energy}</p>
          <p>Level: {user.level}</p>
        </div>
      </header>
      <main className="p-4">
        <Outlet context={{ user, setUser: setUserState }} />
      </main>
      <nav className="fixed bottom-0 w-full bg-gray-200 p-4">
        <Link to="/" className="mx-2">Home</Link>
        <Link to="/tasks" className="mx-2">Tasks</Link>
        <Link to="/stats" className="mx-2">Stats</Link>
        <Link to="/boost" className="mx-2">Boost</Link>
        <Link to="/referral" className="mx-2">Referral</Link>
        <Link to="/marketplace" className="mx-2">Marketplace</Link>
        <Link to="/leaderboard" className="mx-2">Leaderboard</Link>
      </nav>
    </div>
  );
}

export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

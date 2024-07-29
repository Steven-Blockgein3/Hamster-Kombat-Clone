import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, analytics, messaging } from './firebase';
import { logEvent } from 'firebase/analytics';
import { onMessage } from 'firebase/messaging';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true);
      if (authUser) {
        try {
          const userRef = doc(db, 'users', authUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            setUser({ id: authUser.uid, ...userSnap.data() });
          } else {
            const newUser = {
              id: authUser.uid,
              coins: 0,
              energy: 100,
              level: 1,
              achievements: [],
              lastDailyReward: null,
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
          }

          // Set up real-time listener for user data
          const unsubscribeUser = onSnapshot(userRef, (doc) => {
            setUser({ id: doc.id, ...doc.data() });
          });

          // Log user login event
          logEvent(analytics, 'login');

          // Set up push notifications
          onMessage(messaging, (payload) => {
            console.log('Message received. ', payload);
            // Handle the received message
          });

          return () => unsubscribeUser();
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
        navigate('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Check for daily reward
    if (user) {
      const now = new Date();
      const lastReward = user.lastDailyReward ? new Date(user.lastDailyReward) : null;
      if (!lastReward || now.getDate() !== lastReward.getDate()) {
        // Give daily reward
        const userRef = doc(db, 'users', user.id);
        setDoc(userRef, { 
          coins: user.coins + 50, 
          lastDailyReward: now.toISOString() 
        }, { merge: true });
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
        <Outlet context={{ user, setUser }} />
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

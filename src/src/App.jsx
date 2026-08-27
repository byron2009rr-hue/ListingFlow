import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Auth from './Auth';
import Landing from './Landing';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setAuthLoading(false);
    });
    return () => subscription?.unsubscribe();
  }, []);

  if (authLoading) return <div style={{ color: '#d4af37', padding: '20px' }}>Loading...</div>;
  if (!user) return !showAuth ? <Landing onGetStarted={() => setShowAuth(true)} onContact={() => {}} /> : <Auth />;

  return (
    <div style={{ background: 'linear-gradient(135deg, #0f1f3c 0%, #1a2f52 100%)', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#d4af37' }}>ListingFlow</h1>
        <button onClick={() => supabase.auth.signOut()} style={{ padding: '10px 20px', background: '#d4af37', color: '#0f1f3c', border: 'none', borderRadius: '5px' }}>Logout</button>
        <p style={{ color: '#e8e8e8' }}>Welcome to ListingFlow</p>
      </div>
    </div>
  );
}

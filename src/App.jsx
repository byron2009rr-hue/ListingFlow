import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Auth from './Auth';
import Landing from './Landing';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [userTier, setUserTier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generationCount, setGenerationCount] = useState(0);
  const [generationLimit, setGenerationLimit] = useState(5);
  const [lastResetDate, setLastResetDate] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showContact, setShowContact] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    // Check active sessions
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session?.user) {
          setUser(session.user);
          // Fetch user profile for tier info
          const { data, error } = await supabase
            .from('user_profiles')
            .select('tier, generation_count, generation_limit, last_reset_date')
            .eq('user_id', session.user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            // PGRST116 = no rows found, which is ok for new users
            console.error('Profile fetch error:', error);
          }

          if (data) {
            setUserTier(data.tier || 'free');
            setGenerationCount(data.generation_count || 0);
            setGenerationLimit(data.generation_limit || 5);
            setLastResetDate(data.last_reset_date);
          } else {
            // New user, create default profile
            setUserTier('free');
            setGenerationCount(0);
            setGenerationLimit(5);
            await createUserProfile(session.user.id, 'free');
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          setUserTier(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const createUserProfile = async (userId, tier) => {
    const { error } = await supabase
      .from('user_profiles')
      .insert([
        {
          user_id: userId,
          tier: tier,
          generation_count: 0,
          generation_limit: 5,
          created_at: new Date().toISOString(),
        },
      ]);
    if (error) console.error('Failed to create profile:', error);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setUserTier(null);
  };

  const handleTierUpgrade = async (newTier) => {
    if (!user) return;

    const tierLimits = { free: 5, standard: Infinity, pro: Infinity };
    const { error } = await supabase
      .from('user_profiles')
      .update({
        tier: newTier,
        generation_limit: tierLimits[newTier],
        upgraded_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Tier upgrade failed:', error);
    } else {
      setUserTier(newTier);
      setGenerationLimit(tierLimits[newTier]);
    }
  };

  const incrementGenerationCount = async () => {
    if (!user) return;

    const newCount = generationCount + 1;
    const { error } = await supabase
      .from('user_profiles')
      .update({ generation_count: newCount })
      .eq('user_id', user.id);

    if (!error) {
      setGenerationCount(newCount);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-lg">Loading ListingFlow...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {!session ? (
        <Auth onAuthSuccess={(session) => setSession(session)} />
      ) : (
        <Dashboard
          user={user}
          userTier={userTier}
          generationCount={generationCount}
          generationLimit={generationLimit}
          onSignOut={handleSignOut}
          onTierUpgrade={handleTierUpgrade}
          onGenerate={incrementGenerationCount}
          showFeedback={showFeedback}
          setShowFeedback={setShowFeedback}
          feedbackMessage={feedbackMessage}
          setFeedbackMessage={setFeedbackMessage}
          showContact={showContact}
          setShowContact={setShowContact}
          contactMessage={contactMessage}
          setContactMessage={setContactMessage}
        />
      )}
    </div>
  );
}

export default App;
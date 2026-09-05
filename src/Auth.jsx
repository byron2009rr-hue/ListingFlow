import React, { useState } from 'react';
import { supabase } from './supabase';
import './Auth.css';

function Auth({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tier, setTier] = useState('free');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (data?.user) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
              {
                user_id: data.user.id,
                tier: tier,
                generation_count: 0,
                generation_limit: 5,
                created_at: new Date().toISOString(),
              },
            ]);

          if (profileError) throw profileError;
        }

        setEmail('');
        setPassword('');
        setIsSignUp(false);
        setError('Account created! Please sign in.');
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data?.session) {
          onAuthSuccess(data.session);
        }
      }
    } catch (err) {
      setError(err.message || 'Auth error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>ListingFlow</h1>
        <p>AI-Powered Real Estate Content Generator</p>

        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isSignUp && (
            <div className="tier-selector">
              <label>Choose your tier:</label>
              <select value={tier} onChange={(e) => setTier(e.target.value)}>
                <option value="free">Free (5 generations/month)</option>
                <option value="standard">Standard ($29/month)</option>
                <option value="pro">Pro Bilingual ($59/month)</option>
              </select>
            </div>
          )}

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <button onClick={() => setIsSignUp(!isSignUp)} className="toggle-btn">
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default Auth;
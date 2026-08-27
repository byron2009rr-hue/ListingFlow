import React, { useState } from 'react';
import { supabase } from './supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        if (!selectedTier) {
          setError('Please select a plan');
          setLoading(false);
          return;
        }
        if (!agreedToTerms) {
          setError('You must agree to the Terms of Service');
          setLoading(false);
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) {
          setError(signUpError.message);
        } else {
          const { error: insertError } = await supabase.from('users').insert([
            { id: data.user.id, email, tier: selectedTier, generations_used: 0, status: 'pending' }
          ]);
          if (insertError) {
            setError('Error creating account');
          } else {
            alert('Account created! Awaiting admin approval.');
            setEmail('');
            setPassword('');
            setSelectedTier(null);
            setAgreedToTerms(false);
            setIsSignUp(false);
          }
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(signInError.message);
        }
      }
    } catch (err) {
      setError(err.message || 'Error');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1f3c 0%, #1a2f52 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '10px', maxWidth: '500px', width: '100%', border: '2px solid #d4af37' }}>
        <h1 style={{ color: '#d4af37', textAlign: 'center', marginTop: 0 }}>ListingFlow</h1>
        <h2 style={{ color: '#d4af37', textAlign: 'center', fontSize: '20px' }}>{isSignUp ? 'Create Account' : 'Sign In'}</h2>

        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#d4af37', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #d4af37', fontSize: '14px', boxSizing: 'border-box' }} required />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#d4af37', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #d4af37', fontSize: '14px', boxSizing: 'border-box' }} required />
          </div>

          {isSignUp && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#d4af37', display: 'block', marginBottom: '12px', fontWeight: 'bold' }}>Choose Your Plan</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <button type="button" onClick={() => setSelectedTier('free')} style={{ padding: '15px', background: selectedTier === 'free' ? '#d4af37' : 'rgba(212,175,55,0.2)', color: selectedTier === 'free' ? '#0f1f3c' : '#d4af37', border: '2px solid #d4af37', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
                    <div>Free</div>
                    <div style={{ fontSize: '10px' }}>5 gens</div>
                  </button>
                  <button type="button" onClick={() => setSelectedTier('standard')} style={{ padding: '15px', background: selectedTier === 'standard' ? '#d4af37' : 'rgba(212,175,55,0.2)', color: selectedTier === 'standard' ? '#0f1f3c' : '#d4af37', border: '2px solid #d4af37', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
                    <div>Standard</div>
                    <div style={{ fontSize: '10px' }}>$29/mo</div>
                  </button>
                  <button type="button" onClick={() => setSelectedTier('pro_bilingual')} style={{ padding: '15px', background: selectedTier === 'pro_bilingual' ? '#d4af37' : 'rgba(212,175,55,0.2)', color: selectedTier === 'pro_bilingual' ? '#0f1f3c' : '#d4af37', border: '2px solid #d4af37', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
                    <div>Pro</div>
                    <div style={{ fontSize: '10px' }}>$59/mo</div>
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#d4af37', display: 'flex', alignItems: 'flex-start', gap: '10px', fontWeight: 'bold', fontSize: '12px' }}>
                  <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} style={{ cursor: 'pointer', marginTop: '3px' }} />
                  <span>I agree to the <a href="/terms" style={{ color: '#d4af37', textDecoration: 'underline' }}>Terms of Service</a> and understand all AI-generated content must be reviewed before use.</span>
                </label>
              </div>
            </>
          )}

          {error && <div style={{ color: '#ff6b6b', marginBottom: '20px', fontSize: '12px', padding: '10px', background: 'rgba(255,0,0,0.1)', borderRadius: '5px' }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#d4af37', color: '#0f1f3c', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginBottom: '15px' }}>
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
          <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(''); setSelectedTier(null); setAgreedToTerms(false); }} style={{ width: '100%', padding: '12px', background: 'transparent', color: '#d4af37', border: '2px solid #d4af37', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
            {isSignUp ? 'Back to Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

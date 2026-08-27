import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Auth from './Auth';
import Landing from './Landing';

const ADMIN_EMAIL = 'supportlistingflow@gmail.com';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [language, setLanguage] = useState('en');
  const [tab, setTab] = useState('mls');
  const [address, setAddress] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [squareFeet, setSquareFeet] = useState('');
  const [price, setPrice] = useState('');
  const [features, setFeatures] = useState('');
  const [results, setResults] = useState({ mls: '', social: '', flyer: '' });
  const [loading, setLoading] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [userTier, setUserTier] = useState('free');
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ type: 'bug', message: '' });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session?.user) {
        setUser(null);
        setIsAdmin(false);
        setUserTier('free');
        setGenerationCount(0);
        setAuthLoading(false);
        return;
      }

      if (session.user.email === ADMIN_EMAIL) {
        setUser(session.user);
        setIsAdmin(true);
        fetchPendingUsers();
        setAuthLoading(false);
      } else {
        const { data } = await supabase.from('users').select('tier, generations_used').eq('id', session.user.id);
        if (data?.[0]) {
          setUserTier(data[0].tier);
          setGenerationCount(data[0].generations_used || 0);
          setUser(session.user);
          setIsAdmin(false);
          setAuthLoading(false);
        }
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchPendingUsers = async () => {
    setAdminLoading(true);
    try {
      const { data, error } = await supabase.from('users').select('*').eq('status', 'pending');
      if (error) throw error;
      setPendingUsers(data || []);
    } catch (err) {
      console.error('Error fetching:', err);
      setPendingUsers([]);
    }
    setAdminLoading(false);
  };

  const approveUser = async (userId, tier) => {
    try {
      await supabase.from('users').update({ status: 'active', tier }).eq('id', userId);
      fetchPendingUsers();
      alert('User approved!');
    } catch (err) {
      alert('Error approving user');
    }
  };

  const rejectUser = async (userId) => {
    try {
      await supabase.from('users').update({ status: 'rejected' }).eq('id', userId);
      fetchPendingUsers();
      alert('User rejected');
    } catch (err) {
      alert('Error rejecting user');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackLoading(true);
    
    try {
      await supabase.from('feedback').insert([
        {
          user_id: user.id,
          user_email: user.email,
          type: feedbackForm.type,
          message: feedbackForm.message,
          created_at: new Date()
        }
      ]);

      try {
        await fetch('/api/send-feedback-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: user.email,
            type: feedbackForm.type,
            message: feedbackForm.message
          })
        });
      } catch (emailErr) {
        console.log('Email sent gracefully failed');
      }

      alert('Thank you for your feedback!');
      setShowFeedback(false);
      setFeedbackForm({ type: 'bug', message: '' });
    } catch (err) {
      alert('Error submitting feedback');
    }
    setFeedbackLoading(false);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    
    try {
      await supabase.from('contact_messages').insert([
        {
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          created_at: new Date()
        }
      ]);

      try {
        await fetch('/api/send-contact-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: contactForm.name,
            email: contactForm.email,
            message: contactForm.message
          })
        });
      } catch (emailErr) {
        console.log('Email sent gracefully failed');
      }

      alert('Message sent! We\'ll get back to you soon.');
      setShowContact(false);
      setContactForm({ name: '', email: '', message: '' });
    } catch (err) {
      alert('Error sending message');
    }
    setContactLoading(false);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('flyer-result');
    if (element && window.html2pdf) {
      window.html2pdf().set({ margin: 10, filename: 'listing-flyer.pdf' }).save(element);
    } else {
      alert('Download not available');
    }
  };

  if (authLoading) return <div style={{ color: '#d4af37', padding: '20px' }}>Loading...</div>;
  if (!user) return !showAuth ? <Landing onGetStarted={() => setShowAuth(true)} onContact={() => setShowContact(true)} /> : <Auth />;

  if (isAdmin) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #0f1f3c 0%, #1a2f52 100%)', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h1 style={{ color: '#d4af37', margin: 0 }}>Admin Dashboard</h1>
            <button onClick={() => supabase.auth.signOut()} style={{ padding: '10px 20px', background: '#d4af37', color: '#0f1f3c', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Logout</button>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '10px' }}>
            <h2 style={{ color: '#d4af37' }}>Pending Signups</h2>
            {adminLoading ? (
              <p style={{ color: '#e8e8e8' }}>Loading...</p>
            ) : pendingUsers.length === 0 ? (
              <p style={{ color: '#e8e8e8' }}>No pending users</p>
            ) : (
              <table style={{ width: '100%', color: '#e8e8e8', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #d4af37' }}>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#d4af37' }}>Email</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#d4af37' }}>Date</th>
                    <th style={{ padding: '10px', textAlign: 'center', color: '#d4af37' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                      <td style={{ padding: '10px' }}>{p.email}</td>
                      <td style={{ padding: '10px' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '10px', textAlign: 'center', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button onClick={() => approveUser(p.id, 'free')} style={{ padding: '8px 15px', background: '#4ade80', color: '#0f1f3c', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Free</button>
                        <button onClick={() => approveUser(p.id, 'standard')} style={{ padding: '8px 15px', background: '#fbbf24', color: '#0f1f3c', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Standard</button>
                        <button onClick={() => approveUser(p.id, 'pro_bilingual')} style={{ padding: '8px 15px', background: '#60a5fa', color: '#0f1f3c', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Pro</button>
                        <button onClick={() => rejectUser(p.id)} style={{ padding: '8px 15px', background: '#ff6b6b', color: '#0f1f3c', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button onClick={fetchPendingUsers} style={{ marginTop: '20px', padding: '10px 20px', background: '#d4af37', color: '#0f1f3c', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Refresh</button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (userTier === 'free' && generationCount >= 5) {
      alert('You\'ve used all 5 free generations. Upgrade to Standard or Pro for unlimited access.');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          address, 
          bedrooms, 
          bathrooms, 
          squareFeet, 
          price, 
          features, 
          type: tab, 
          language,
          userId: user.id,
          userTier: userTier,
          currentGenCount: generationCount
        })
      });
      const data = await res.json();
      
      if (tab === 'mls') {
        setResults({ ...results, mls: data.description });
      } else if (tab === 'social') {
        setResults({ ...results, social: data.socialCaption });
      } else if (tab === 'flyer') {
        setResults({ ...results, flyer: data.flyerText });
      }
      
      setGenerationCount(generationCount + 1);
    } catch (err) {
      alert('Error generating content: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #0f1f3c 0%, #1a2f52 100%)', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#d4af37', margin: 0, fontSize: '48px' }}>ListingFlow</h1>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '14px' }}>{userTier === 'free' ? 'Free' : userTier === 'standard' ? 'Standard' : 'Pro Bilingual'}</span>
            <button onClick={() => setShowFeedback(true)} style={{ padding: '10px 15px', background: 'rgba(212,175,55,0.3)', color: '#d4af37', border: '1px solid #d4af37', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>📝 Feedback</button>
            <button onClick={() => supabase.auth.signOut()} style={{ padding: '10px 20px', background: '#d4af37', color: '#0f1f3c', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Logout</button>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '5px', marginBottom: '20px', color: '#d4af37', textAlign: 'center' }}>
          {userTier === 'free' ? `Generations: ${generationCount}/5 ${generationCount < 5 ? `(${5 - generationCount} remaining)` : '(limit reached)'}` : 'Generations: Unlimited'}
        </div>

        {userTier === 'free' && generationCount >= 5 && (
          <div style={{ background: 'rgba(255,107,107,0.2)', padding: '15px', borderRadius: '5px', marginBottom: '20px', color: '#ff6b6b', textAlign: 'center', border: '1px solid #ff6b6b' }}>
            You've reached your free generation limit. Upgrade to Standard ($29/mo) or Pro Bilingual ($59/mo) for unlimited generations.
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', justifyContent: 'center' }}>
          <button onClick={() => setTab('mls')} style={{ padding: '12px 30px', background: tab === 'mls' ? '#d4af37' : 'rgba(212,175,55,0.3)', color: tab === 'mls' ? '#0f1f3c' : '#d4af37', border: '2px solid #d4af37', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>MLS Description</button>
          <button onClick={() => setTab('social')} style={{ padding: '12px 30px', background: tab === 'social' ? '#d4af37' : 'rgba(212,175,55,0.3)', color: tab === 'social' ? '#0f1f3c' : '#d4af37', border: '2px solid #d4af37', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Social Captions</button>
          <button onClick={() => setTab('flyer')} style={{ padding: '12px 30px', background: tab === 'flyer' ? '#d4af37' : 'rgba(212,175,55,0.3)', color: tab === 'flyer' ? '#0f1f3c' : '#d4af37', border: '2px solid #d4af37', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Open House Flyer</button>
        </div>

        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '10px', marginBottom: '20px' }}>
          {userTier === 'pro_bilingual' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#d4af37', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: '100%', padding: '10px', background: '#d4af37', color: '#0f1f3c', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                <option value="en">English</option>
                <option value="es">Spanish (Español)</option>
              </select>
            </div>
          )}

          <div style={{ marginBottom: '20px' }}><label style={{ color: '#d4af37', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Property Address</label><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="1234 Oak Cliff Ave" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #d4af37', fontSize: '14px', boxSizing: 'border-box' }} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}><div><label style={{ color: '#d4af37', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Bedrooms</label><input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} placeholder="3" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #d4af37', fontSize: '14px', boxSizing: 'border-box' }} required /></div><div><label style={{ color: '#d4af37', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Bathrooms</label><input type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} placeholder="2" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #d4af37', fontSize: '14px', boxSizing: 'border-box' }} required /></div></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}><div><label style={{ color: '#d4af37', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Square Feet</label><input type="number" value={squareFeet} onChange={(e) => setSquareFeet(e.target.value)} placeholder="2000" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #d4af37', fontSize: '14px', boxSizing: 'border-box' }} required /></div><div><label style={{ color: '#d4af37', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Price</label><input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="$450,000" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #d4af37', fontSize: '14px', boxSizing: 'border-box' }} required /></div></div>
          <div style={{ marginBottom: '20px' }}><label style={{ color: '#d4af37', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Key Features</label><textarea value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="Updated kitchen, hardwood floors, pool..." style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #d4af37', fontSize: '14px', minHeight: '80px', boxSizing: 'border-box' }} required /></div>
          <button type="submit" disabled={loading || (userTier === 'free' && generationCount >= 5)} style={{ width: '100%', padding: '12px', background: '#d4af37', color: '#0f1f3c', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading || (userTier === 'free' && generationCount >= 5) ? 0.5 : 1 }}>{loading ? 'Generating...' : 'Generate Content'}</button>
        </form>

        {results[tab] && (
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '10px' }}>
            {tab === 'flyer' ? (
              <>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
                  <button onClick={() => window.print()} style={{ padding: '10px 20px', background: '#d4af37', color: '#0f1f3c', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>🖨️ Print</button>
                  <button onClick={handleDownloadPDF} style={{ padding: '10px 20px', background: '#d4af37', color: '#0f1f3c', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>📥 Download PDF</button>
                </div>
                <div id="flyer-result" dangerouslySetInnerHTML={{ __html: results[tab] }} />
              </>
            ) : (
              <>
                <h2 style={{ color: '#d4af37' }}>{tab === 'social' ? 'Social Media Captions' : 'MLS Description'}</h2>
                <p style={{ color: '#e8e8e8', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{results[tab]}</p>
              </>
            )}
          </div>
        )}
      </div>

      {showFeedback && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '10px', maxWidth: '500px', width: '90%', border: '2px solid #d4af37' }}>
            <h2 style={{ color: '#d4af37', marginTop: 0 }}>Send Feedback</h2>
            <form onSubmit={handleFeedbackSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#d4af37', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Type</label>
                <select value={feedbackForm.type} onChange={(e) => setFeedbackForm({ ...feedbackForm, type: e.target.value })} style={{ width: '100%', padding: '10px', background: '#d4af37', color: '#0f1f3c', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="concern">Concern</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#d4af37', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Message</label>
                <textarea value={feedbackForm.message} onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })} placeholder="Let us know your thoughts..." style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #d4af37', fontSize: '14px', minHeight: '100px', boxSizing: 'border-box', color: '#0f1f3c' }} required />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={feedbackLoading} style={{ flex: 1, padding: '12px', background: '#d4af37', color: '#0f1f3c', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: feedbackLoading ? 'not-allowed' : 'pointer', opacity: feedbackLoading ? 0.7 : 1 }}>{feedbackLoading ? 'Sending...' : 'Send'}</button>
                <button type="button" onClick={() => setShowFeedback(false)} style={{ flex: 1, padding: '12px', background: 'transparent', color: '#d4af37', border: '2px solid #d4af37', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showContact && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '10px', maxWidth: '500px', width: '90%', border: '2px solid #d4af37' }}>
            <h2 style={{ color: '#d4af37', marginTop: 0 }}>Contact Us</h2>
            <form onSubmit={handleContactSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#d4af37', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Name</label>
                <input type="text" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} placeholder="Your name" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #d4af37', fontSize: '14px', boxSizing: 'border-box' }} required />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#d4af37', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email</label>
                <input type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} placeholder="your@email.com" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #d4af37', fontSize: '14px', boxSizing: 'border-box' }} required />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#d4af37', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Message</label>
                <textarea value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder="Your message..." style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #d4af37', fontSize: '14px', minHeight: '100px', boxSizing: 'border-box', color: '#0f1f3c' }} required />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={contactLoading} style={{ flex: 1, padding: '12px', background: '#d4af37', color: '#0f1f3c', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: contactLoading ? 'not-allowed' : 'pointer', opacity: contactLoading ? 0.7 : 1 }}>{contactLoading ? 'Sending...' : 'Send'}</button>
                <button type="button" onClick={() => setShowContact(false)} style={{ flex: 1, padding: '12px', background: 'transparent', color: '#d4af37', border: '2px solid #d4af37', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

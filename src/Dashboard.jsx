import React, { useState } from 'react';
import './Dashboard.css';

function Dashboard({
  user,
  userTier,
  generationCount,
  generationLimit,
  onSignOut,
  onTierUpgrade,
  onGenerate,
  showFeedback,
  setShowFeedback,
  feedbackMessage,
  setFeedbackMessage,
  showContact,
  setShowContact,
  contactMessage,
  setContactMessage,
}) {
  const [activeTab, setActiveTab] = useState('generate');
  const [generationType, setGenerationType] = useState('mls');
  const [propertyData, setPropertyData] = useState('');
  const [language, setLanguage] = useState('english');
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [contentHistory, setContentHistory] = useState([]);

  const canGenerate = generationLimit === Infinity || generationCount < generationLimit;
  const generationsRemaining = generationLimit === Infinity ? '∞' : generationLimit - generationCount;

  const handleGenerate = async () => {
    if (!propertyData.trim() || !canGenerate) return;

    setGenerating(true);
    try {
      const response = await fetch('/api/generate.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: generationType,
          content: propertyData,
          language: userTier === 'pro' ? language : 'english',
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedContent(data.content);
        setContentHistory([{ type: generationType, content: data.content }, ...contentHistory]);
        setPropertyData('');
        onGenerate();
      } else {
        alert('Generation failed: ' + data.error);
      }
    } catch (err) {
      console.error('Generation error:', err);
      alert('Error generating content');
    } finally {
      setGenerating(false);
    }
  };

  const handleSendFeedback = async () => {
    if (!feedbackMessage.trim()) return;

    try {
      const response = await fetch('/api/send-feedback-email.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          message: feedbackMessage,
          type: 'general',
        }),
      });

      if (response.ok) {
        setFeedbackMessage('');
        setShowFeedback(false);
        alert('Thank you for your feedback!');
      } else {
        alert('Failed to send feedback');
      }
    } catch (err) {
      console.error('Feedback error:', err);
    }
  };

  const handleSendContact = async () => {
    if (!contactMessage.trim()) return;

    try {
      const response = await fetch('/api/send-contact-email.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.email,
          email: user.email,
          subject: 'ListingFlow Contact',
          message: contactMessage,
        }),
      });

      if (response.ok) {
        setContactMessage('');
        setShowContact(false);
        alert('Message sent successfully!');
      } else {
        alert('Failed to send message');
      }
    } catch (err) {
      console.error('Contact error:', err);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>ListingFlow</h1>
        <div className="header-right">
          <div className="user-info">
            <span>{user?.email}</span>
            <span className="tier-badge">{userTier?.toUpperCase()}</span>
          </div>
          <button onClick={onSignOut} className="btn-secondary">Sign Out</button>
        </div>
      </header>

      <div className="dashboard-container">
        <nav className="sidebar">
          <button
            className={`nav-item ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            Generate Content
          </button>
          <button
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button
            className={`nav-item ${activeTab === 'billing' ? 'active' : ''}`}
            onClick={() => setActiveTab('billing')}
          >
            Billing & Tier
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>

        <main className="content-area">
          {activeTab === 'generate' && (
            <div className="generate-section">
              <h2>AI Content Generator</h2>
              <p className="generations-info">
                Generations remaining: <strong>{generationsRemaining}</strong>
              </p>

              {!canGenerate && (
                <div className="alert alert-warning">
                  You've reached your generation limit. Upgrade to continue!
                </div>
              )}

              <div className="form-group">
                <label>Content Type</label>
                <select
                  value={generationType}
                  onChange={(e) => setGenerationType(e.target.value)}
                  disabled={!canGenerate}
                >
                  <option value="mls">MLS Listing Description</option>
                  <option value="social">Social Media Captions</option>
                  <option value="flyer">Property Flyer Copy</option>
                </select>
              </div>

              {userTier === 'pro' && (
                <div className="form-group">
                  <label>Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="english">English</option>
                    <option value="spanish">Español</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Property Details</label>
                <textarea
                  value={propertyData}
                  onChange={(e) => setPropertyData(e.target.value)}
                  placeholder="Paste property info, address, features, etc."
                  rows="6"
                  disabled={!canGenerate}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!canGenerate || !propertyData.trim() || generating}
                className="btn-primary"
              >
                {generating ? 'Generating...' : 'Generate Content'}
              </button>

              {generatedContent && (
                <div className="generated-content">
                  <h3>Generated Content</h3>
                  <div className="content-box">
                    <p>{generatedContent}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedContent)}
                    className="btn-secondary"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-section">
              <h2>Generation History</h2>
              {contentHistory.length === 0 ? (
                <p>No generations yet. Start creating!</p>
              ) : (
                <div className="history-list">
                  {contentHistory.map((item, idx) => (
                    <div key={idx} className="history-item">
                      <h4>{item.type.toUpperCase()}</h4>
                      <p>{item.content.substring(0, 200)}...</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="billing-section">
              <h2>Billing & Tier Management</h2>
              <div className="tier-card">
                <h3>Current Tier: {userTier?.toUpperCase()}</h3>
                <p>Generations used: {generationCount} / {generationLimit === Infinity ? '∞' : generationLimit}</p>
              </div>

              <div className="tier-options">
                <div className="tier-option">
                  <h4>Free</h4>
                  <p className="price">$0/month</p>
                  <ul>
                    <li>5 generations/month</li>
                    <li>English only</li>
                    <li>Basic features</li>
                  </ul>
                  {userTier !== 'free' && <button onClick={() => onTierUpgrade('free')}>Downgrade</button>}
                </div>

                <div className="tier-option">
                  <h4>Standard</h4>
                  <p className="price">$29/month</p>
                  <ul>
                    <li>Unlimited generations</li>
                    <li>English only</li>
                    <li>Priority support</li>
                  </ul>
                  {userTier !== 'standard' && (
                    <button onClick={() => onTierUpgrade('standard')} className="btn-primary">
                      Upgrade Now
                    </button>
                  )}
                </div>

                <div className="tier-option featured">
                  <h4>Pro Bilingual</h4>
                  <p className="price">$59/month</p>
                  <ul>
                    <li>Unlimited generations</li>
                    <li>English & Spanish</li>
                    <li>Priority support</li>
                    <li>Admin dashboard</li>
                  </ul>
                  {userTier !== 'pro' && (
                    <button onClick={() => onTierUpgrade('pro')} className="btn-primary">
                      Upgrade Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2>Settings & Support</h2>
              <div className="settings-group">
                <button onClick={() => setShowFeedback(true)} className="btn-secondary">
                  Send Feedback
                </button>
                <button onClick={() => setShowContact(true)} className="btn-secondary">
                  Contact Support
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {showFeedback && (
        <div className="modal">
          <div className="modal-content">
            <h3>Send Feedback</h3>
            <textarea
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder="Tell us what you think..."
              rows="5"
            />
            <div className="modal-buttons">
              <button onClick={handleSendFeedback} className="btn-primary">Send</button>
              <button onClick={() => setShowFeedback(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showContact && (
        <div className="modal">
          <div className="modal-content">
            <h3>Contact Support</h3>
            <textarea
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="How can we help?"
              rows="5"
            />
            <div className="modal-buttons">
              <button onClick={handleSendContact} className="btn-primary">Send</button>
              <button onClick={() => setShowContact(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
import React from 'react';
import './Landing.css';

function Landing() {
  return (
    <div className="landing">
      <header className="landing-header">
        <h1>ListingFlow</h1>
        <p>AI-Powered Real Estate Content Generator</p>
      </header>

      <section className="features">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>MLS Descriptions</h3>
            <p>Generate compelling listing descriptions optimized for search engines.</p>
          </div>
          <div className="feature-card">
            <h3>Social Captions</h3>
            <p>Create engaging social media posts with hashtags for Instagram and Facebook.</p>
          </div>
          <div className="feature-card">
            <h3>Flyer Copy</h3>
            <p>Marketing copy ready for property flyers and brochures.</p>
          </div>
        </div>
      </section>

      <section className="pricing">
        <h2>Pricing</h2>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h4>Free</h4>
            <p className="price">$0</p>
            <p>5 generations/month</p>
          </div>
          <div className="pricing-card">
            <h4>Standard</h4>
            <p className="price">$29</p>
            <p>Unlimited generations</p>
          </div>
          <div className="pricing-card featured">
            <h4>Pro Bilingual</h4>
            <p className="price">$59</p>
            <p>Unlimited + Spanish</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
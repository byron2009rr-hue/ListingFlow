import React from 'react';

export default function Landing({ onGetStarted, onContact }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #0f1f3c 0%, #1a2f52 100%)', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #d4af37' }}>
        <h1 style={{ color: '#d4af37', margin: 0 }}>ListingFlow</h1>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#features" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 'bold' }}>Features</a>
          <a href="#pricing" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 'bold' }}>Pricing</a>
          <button onClick={onContact} style={{ color: '#d4af37', background: 'transparent', border: '1px solid #d4af37', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Contact</button>
        </div>
      </nav>

      <section style={{ textAlign: 'center', padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color: '#d4af37', fontSize: '48px', marginBottom: '20px' }}>AI-Powered Real Estate Content in Seconds</h2>
        <p style={{ color: '#e8e8e8', fontSize: '18px', marginBottom: '40px' }}>Generate MLS descriptions, social media captions, and open house flyers instantly. Perfect for busy agents.</p>
        <button onClick={onGetStarted} style={{ padding: '15px 40px', background: '#d4af37', color: '#0f1f3c', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>Get Started Free</button>
      </section>

      <section id="features" style={{ padding: '80px 40px', background: 'rgba(255,255,255,0.02)' }}>
        <h3 style={{ color: '#d4af37', textAlign: 'center', fontSize: '32px', marginBottom: '60px' }}>Features</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(212,175,55,0.1)', padding: '30px', borderRadius: '10px', border: '1px solid #d4af37' }}>
            <h4 style={{ color: '#d4af37' }}>MLS Descriptions</h4>
            <p style={{ color: '#e8e8e8' }}>Compelling property descriptions that highlight key features and attract qualified buyers.</p>
          </div>
          <div style={{ background: 'rgba(212,175,55,0.1)', padding: '30px', borderRadius: '10px', border: '1px solid #d4af37' }}>
            <h4 style={{ color: '#d4af37' }}>Social Captions</h4>
            <p style={{ color: '#e8e8e8' }}>Engaging captions for Instagram, Facebook, and LinkedIn to reach more potential buyers.</p>
          </div>
          <div style={{ background: 'rgba(212,175,55,0.1)', padding: '30px', borderRadius: '10px', border: '1px solid #d4af37' }}>
            <h4 style={{ color: '#d4af37' }}>Open House Flyers</h4>
            <p style={{ color: '#e8e8e8' }}>Professional flyers ready to print or share digitally with all key property information.</p>
          </div>
        </div>
      </section>

      <section id="pricing" style={{ padding: '80px 40px' }}>
        <h3 style={{ color: '#d4af37', textAlign: 'center', fontSize: '32px', marginBottom: '60px' }}>Pricing</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(212,175,55,0.1)', padding: '40px', borderRadius: '10px', border: '2px solid #d4af37', textAlign: 'center' }}>
            <h4 style={{ color: '#d4af37', fontSize: '24px' }}>Free</h4>
            <p style={{ color: '#d4af37', fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>$0</p>
            <ul style={{ color: '#e8e8e8', textAlign: 'left', listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '8px 0' }}>✓ 5 generations</li>
              <li style={{ padding: '8px 0' }}>✓ English only</li>
              <li style={{ padding: '8px 0' }}>✓ Basic features</li>
            </ul>
          </div>
          <div style={{ background: 'rgba(212,175,55,0.1)', padding: '40px', borderRadius: '10px', border: '2px solid #d4af37', textAlign: 'center' }}>
            <h4 style={{ color: '#d4af37', fontSize: '24px' }}>Standard</h4>
            <p style={{ color: '#d4af37', fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>$29<span style={{ fontSize: '16px' }}>/mo</span></p>
            <ul style={{ color: '#e8e8e8', textAlign: 'left', listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '8px 0' }}>✓ Unlimited generations</li>
              <li style={{ padding: '8px 0' }}>✓ English only</li>
              <li style={{ padding: '8px 0' }}>✓ All features</li>
            </ul>
          </div>
          <div style={{ background: 'rgba(212,175,55,0.1)', padding: '40px', borderRadius: '10px', border: '2px solid #d4af37', textAlign: 'center' }}>
            <h4 style={{ color: '#d4af37', fontSize: '24px' }}>Pro Bilingual</h4>
            <p style={{ color: '#d4af37', fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>$59<span style={{ fontSize: '16px' }}>/mo</span></p>
            <ul style={{ color: '#e8e8e8', textAlign: 'left', listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '8px 0' }}>✓ Unlimited generations</li>
              <li style={{ padding: '8px 0' }}>✓ English & Spanish</li>
              <li style={{ padding: '8px 0' }}>✓ All features</li>
            </ul>
          </div>
        </div>
      </section>

      <footer style={{ padding: '40px', textAlign: 'center', borderTop: '1px solid #d4af37', color: '#e8e8e8' }}>
        <p>&copy; 2026 ListingFlow. All rights reserved.</p>
        <p>Email: <a href="mailto:supportlistingflow@gmail.com" style={{ color: '#d4af37', textDecoration: 'none' }}>supportlistingflow@gmail.com</a></p>
      </footer>
    </div>
  );
}

import React from 'react'

function LandingPage({ onGetStarted, onLoginClick }) {
  return (
    <div style={styles.landingContainer}>
      {/* Header / Navbar */}
      <header style={styles.navbar}>
        <div style={styles.logo}>🌱 AGROVERSE AI</div>
        <nav style={styles.navLinks}>
          <a href="#features" style={styles.link}>Features</a>
          <a href="#about" style={styles.link}>About Us</a>
          <a href="#contact" style={styles.link}>Contact</a>
        </nav>
        <div style={styles.authButtons}>
          <button style={styles.loginBtn} onClick={onLoginClick}>Sign In</button>
          <button style={styles.signupBtn} onClick={onGetStarted}>Sign Up</button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroText}>
          <h1 style={styles.heroTitle}>Smart Farming, Better Tomorrow</h1>
          <p style={styles.heroSubtitle}>
            Transform your agricultural journey with AI-driven crop recommendations, 
            climate insights, soil analysis, and real-time farm mapping.
          </p>
          <button style={styles.ctaBtn} onClick={onGetStarted}>
            Get Started Free 🚀
          </button>
        </div>
        <div style={styles.heroImage}>
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2909/2909760.png" 
            alt="Agroverse AI" 
            style={{ width: '80%', maxWidth: '400px' }} 
          />
        </div>
      </section>

      {/* Features Overview Section */}
      <section id="features" style={styles.featuresSection}>
        <h2 style={{ textAlign: 'center', color: '#166534', marginBottom: '30px', fontSize: '32px' }}>
          Why Choose Agroverse AI?
        </h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <h3>🌾 Crop Recommendation</h3>
            <p>Get personalized crop suggestions based on your soil type and water availability.</p>
          </div>
          <div style={styles.featureCard}>
            <h3>🌦️ Climate Insights</h3>
            <p>Access real-time climate data powered by NASA APIs for weather planning.</p>
          </div>
          <div style={styles.featureCard}>
            <h3>🧪 Soil pH Analysis</h3>
            <p>Check soil health and receive actionable tips to improve soil fertility.</p>
          </div>
          <div style={styles.featureCard}>
            <h3>📍 Satellite Farm Mapping</h3>
            <p>Monitor your farmland with Leaflet interactive satellite imagery.</p>
          </div>
        </div>
      </section>

      {/* 🟢 ১. About Us Section (নতুন যুক্ত করা হয়েছে) */}
      <section id="about" style={styles.aboutSection}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: '#166534', marginBottom: '20px', fontSize: '32px' }}>About Agroverse AI</h2>
          <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.8' }}>
            Agroverse AI is an advanced agricultural intelligence platform designed to empower farmers with modern technology. 
            By integrating real-time weather analytics, satellite monitoring, and machine learning crop planning, 
            we aim to maximize yield, enhance sustainability, and make smart farming accessible for everyone.
          </p>
        </div>
      </section>

      {/* 🟢 ২. Contact Section (নতুন যুক্ত করা হয়েছে) */}
      <section id="contact" style={styles.contactSection}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: '#166534', marginBottom: '15px', fontSize: '32px' }}>Get in Touch</h2>
          <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '30px' }}>
            Have questions or need help integrating Agroverse AI into your farming operations? Reach out to us!
          </p>
          <div style={styles.contactCardsGroup}>
            <div style={styles.contactCard}>
              <h4>📍 Office Location</h4>
              <p>Purulia, West Bengal, India</p>
            </div>
            <div style={styles.contactCard}>
              <h4>📧 Email Us</h4>
              <p>support@agroverse.ai</p>
            </div>
            <div style={styles.contactCard}>
              <h4>📞 Call Support</h4>
              <p>+91 98765 43210</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2026 Agroverse AI. Empowering Farmers Everywhere 🌱</p>
      </footer>
    </div>
  )
}

const styles = {
  landingContainer: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f8fafc',
    color: '#1e293b',
    minHeight: '100vh',
    scrollBehavior: 'smooth', // স্মুথ স্ক্রলিং এর জন্য
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#15803d',
  },
  navLinks: {
    display: 'flex',
    gap: '25px',
  },
  link: {
    textDecoration: 'none',
    color: '#475569',
    fontWeight: '600',
    transition: 'color 0.2s',
  },
  authButtons: {
    display: 'flex',
    gap: '15px',
  },
  loginBtn: {
    padding: '8px 20px',
    border: '1px solid #16a34a',
    backgroundColor: 'transparent',
    color: '#16a34a',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  signupBtn: {
    padding: '8px 20px',
    border: 'none',
    backgroundColor: '#16a34a',
    color: '#ffffff',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '80px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
    flexWrap: 'wrap',
  },
  heroText: {
    flex: '1 1 500px',
  },
  heroTitle: {
    fontSize: '48px',
    color: '#14532d',
    marginBottom: '20px',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '30px',
  },
  ctaBtn: {
    padding: '14px 32px',
    fontSize: '18px',
    backgroundColor: '#16a34a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)',
  },
  heroImage: {
    flex: '1 1 400px',
    display: 'flex',
    justifyContent: 'center',
  },
  featuresSection: {
    padding: '80px 40px',
    backgroundColor: '#ffffff',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    padding: '24px',
    backgroundColor: '#f0fdf4',
    borderRadius: '12px',
    border: '1px solid #dcfce7',
  },
  // 🟢 About Section এর স্টাইল
  aboutSection: {
    padding: '80px 40px',
    backgroundColor: '#f1f5f9',
  },
  // 🟢 Contact Section এর স্টাইল
  contactSection: {
    padding: '80px 40px',
    backgroundColor: '#ffffff',
  },
  contactCardsGroup: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '20px',
    flexWrap: 'wrap',
    marginTop: '30px',
  },
  contactCard: {
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    flex: '1 1 200px',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#0f172a',
    color: '#94a3b8',
  }
}

export default LandingPage
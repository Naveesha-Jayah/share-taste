import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#292F36',
      lineHeight: 1.5,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      backgroundColor: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 0',
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem',
    },
    logo: {
      fontSize: '1.8rem',
      fontWeight: 700,
      color: '#FF6B6B',
    },
    logoSpan: {
      color: '#4ECDC4',
    },
    navLinks: {
      display: 'flex',
      gap: '2rem',
    },
    navLink: {
      textDecoration: 'none',
      color: '#292F36',
      fontWeight: 500,
    },
    authButtons: {
      display: 'flex',
      gap: '1rem',
    },
    btn: {
      padding: '0.6rem 1.2rem',
      borderRadius: '4px',
      fontWeight: 600,
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.3s ease',
    },
    btnPrimary: {
      backgroundColor: '#FF6B6B',
      color: 'white',
    },
    btnOutline: {
      backgroundColor: 'transparent',
      border: '2px solid #FF6B6B',
      color: '#FF6B6B',
    },
    hero: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      textAlign: 'center',
      padding: '4rem 2rem',
    },
    heroContent: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    heroTitle: {
      fontSize: '3.5rem',
      marginBottom: '1.5rem',
      textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
    },
    heroSubtitle: {
      fontSize: '1.5rem',
      margin: '0 auto 3rem',
      textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
    },
    features: {
      padding: '4rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center',
    },
    featuresTitle: {
      fontSize: '2.5rem',
      marginBottom: '2rem',
      color: '#292F36',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      marginTop: '3rem',
    },
    featureCard: {
      padding: '2rem',
      borderRadius: '8px',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    },
    featureIcon: {
      fontSize: '2.5rem',
      marginBottom: '1rem',
      color: '#FF6B6B',
    },
    featureTitle: {
      fontSize: '1.5rem',
      marginBottom: '1rem',
      color: '#292F36',
    },
    featureText: {
      color: '#666',
    },
    ctaSection: {
      backgroundColor: '#F7FFF7',
      padding: '4rem 2rem',
      textAlign: 'center',
    },
    ctaContent: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    ctaTitle: {
      fontSize: '2.5rem',
      marginBottom: '1.5rem',
      color: '#292F36',
    },
    ctaText: {
      fontSize: '1.2rem',
      marginBottom: '2rem',
      color: '#666',
    },
    footer: {
      backgroundColor: '#292F36',
      color: 'white',
      padding: '2rem',
      textAlign: 'center',
    },
    footerLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginTop: '1rem',
    },
    footerLink: {
      color: 'white',
      textDecoration: 'none',
    },
  };

  const handleGetStarted = () => {
    navigate('/page');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <div style={styles.logo}>Taste<span style={styles.logoSpan}>Share</span></div>
          <div style={styles.navLinks}>
            <a href="/recipe" style={styles.navLink}>Recipes</a>
            <a href="/challenge" style={styles.navLink}>Challenges</a>
            <a href="/plan" style={styles.navLink}>Meal Plans</a>
            <a href="/community" style={styles.navLink}>Community</a>
          </div>
          <div style={styles.authButtons}>
            <button style={{...styles.btn, ...styles.btnOutline}}>Log In</button>
            <button style={{...styles.btn, ...styles.btnPrimary}}>Sign Up</button>
          </div>
        </nav>
      </header>

      <main>
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>Discover & Share Culinary Delights</h1>
            <p style={styles.heroSubtitle}>Join TasteShare to explore recipes, participate in challenges, and connect with food enthusiasts worldwide</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={handleGetStarted}
                style={{...styles.btn, ...styles.btnPrimary, padding: '0.8rem 2rem'}}
              >
                Get Started
              </button>
              <button style={{...styles.btn, ...styles.btnOutline, padding: '0.8rem 2rem', borderColor: 'white', color: 'white'}}>
                Learn More
              </button>
            </div>
          </div>
        </section>

        <section style={styles.features}>
          <h2 style={styles.featuresTitle}>Why Choose TasteShare?</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🍳</div>
              <h3 style={styles.featureTitle}>Discover Recipes</h3>
              <p style={styles.featureText}>Find thousands of recipes from professional chefs and home cooks alike.</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🏆</div>
              <h3 style={styles.featureTitle}>Join Challenges</h3>
              <p style={styles.featureText}>Participate in cooking challenges and showcase your culinary skills.</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📅</div>
              <h3 style={styles.featureTitle}>Meal Planning</h3>
              <p style={styles.featureText}>Create and share meal plans to stay organized and eat healthier.</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>👥</div>
              <h3 style={styles.featureTitle}>Community</h3>
              <p style={styles.featureText}>Connect with other food lovers and share your culinary creations.</p>
            </div>
          </div>
        </section>

        <section style={styles.ctaSection}>
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>Ready to start your culinary journey?</h2>
            <p style={styles.ctaText}>Join thousands of food enthusiasts who are already sharing and discovering amazing recipes and meal plans.</p>
            <button style={{...styles.btn, ...styles.btnPrimary, padding: '0.8rem 2rem', fontSize: '1.1rem'}}>Sign Up Now</button>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <div>
          <div style={styles.logo}>Taste<span style={styles.logoSpan}>Share</span></div>
          <div style={styles.footerLinks}>
            <a href="/about" style={styles.footerLink}>About</a>
            <a href="/contact" style={styles.footerLink}>Contact</a>
            <a href="/privacy" style={styles.footerLink}>Privacy</a>
            <a href="/terms" style={styles.footerLink}>Terms</a>
          </div>
          <p style={{ marginTop: '1rem' }}>© {new Date().getFullYear()} TasteShare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
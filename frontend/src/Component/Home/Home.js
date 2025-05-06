import React from 'react';

function Home() {
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#292F36',
      lineHeight: 1.5,
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
      textAlign: 'center',
      padding: '4rem 2rem',
      backgroundColor: '#F7FFF7',
      backgroundImage: 'url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
    },
    heroContent: {
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: '2rem',
      borderRadius: '8px'
    },
    heroTitle: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },
    heroSubtitle: {
      fontSize: '1.2rem',
      margin: '0 auto 2rem',
    },
    section: {
      padding: '3rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    sectionTitle: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      transition: 'transform 0.3s ease',
    },
    cardImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
    },
    cardContent: {
      padding: '1.5rem',
    },
    cardStats: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '1rem',
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

  // Image URLs from Unsplash
  const images = {
    recipe1: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    recipe2: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    challenge1: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    challenge2: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    mealplan1: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    mealplan2: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
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
            <button style={{...styles.btn, ...styles.btnPrimary}}>Get Started</button>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Featured Recipes</h2>
          <div style={styles.cardContainer}>
            <div style={styles.card}>
              <img src={images.recipe1} alt="Spicy Thai Noodles" style={styles.cardImage} />
              <div style={styles.cardContent}>
                <h3>Spicy Thai Noodles</h3>
                <p>By Chef Maria</p>
                <div style={styles.cardStats}>
                  <span>❤️ 120</span>
                  <span>💬 24</span>
                </div>
              </div>
            </div>
            <div style={styles.card}>
              <img src={images.recipe2} alt="Avocado Toast" style={styles.cardImage} />
              <div style={styles.cardContent}>
                <h3>Avocado Toast</h3>
                <p>By Home Cook Jamie</p>
                <div style={styles.cardStats}>
                  <span>❤️ 95</span>
                  <span>💬 18</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Current Challenges</h2>
          <div style={styles.cardContainer}>
            <div style={styles.card}>
              <img src={images.challenge1} alt="30-Minute Meals" style={styles.cardImage} />
              <div style={styles.cardContent}>
                <h3>30-Minute Meals</h3>
                <p>Ends in 5 days</p>
                <button style={{...styles.btn, ...styles.btnPrimary, width: '100%'}}>Join Challenge</button>
              </div>
            </div>
            <div style={styles.card}>
              <img src={images.challenge2} alt="Vegetarian Week" style={styles.cardImage} />
              <div style={styles.cardContent}>
                <h3>Vegetarian Week</h3>
                <p>Ongoing</p>
                <button style={{...styles.btn, ...styles.btnPrimary, width: '100%'}}>Join Challenge</button>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Popular Meal Plans</h2>
          <div style={styles.cardContainer}>
            <div style={styles.card}>
              <img src={images.mealplan1} alt="7-Day Keto Plan" style={styles.cardImage} />
              <div style={styles.cardContent}>
                <h3>7-Day Keto Plan</h3>
                <p>By Nutrition Expert</p>
                <button style={{...styles.btn, ...styles.btnPrimary, width: '100%'}}>View Plan</button>
              </div>
            </div>
            <div style={styles.card}>
              <img src={images.mealplan2} alt="Family Dinners" style={styles.cardImage} />
              <div style={styles.cardContent}>
                <h3>Family Dinners</h3>
                <p>By Home Chef</p>
                <button style={{...styles.btn, ...styles.btnPrimary, width: '100%'}}>View Plan</button>
              </div>
            </div>
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
        </div>
      </footer>
    </div>
  );
}

export default Home;
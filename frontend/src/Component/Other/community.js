import React from 'react';

function Community() {
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#292F36',
      lineHeight: 1.5,
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
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
      marginBottom: '2rem',
      borderRadius: '8px',
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      position: 'relative',
    },
    heroTitle: {
      fontSize: '2.5rem',
      marginBottom: '1rem',
      color: 'white',
      textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
    },
    heroSubtitle: {
      fontSize: '1.2rem',
      margin: '0 auto 2rem',
      color: 'rgba(255,255,255,0.9)',
      maxWidth: '800px',
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
    },
    sectionTitle: {
      fontSize: '2rem',
      marginBottom: '2rem',
      color: '#292F36',
      borderBottom: '2px solid #4ECDC4',
      paddingBottom: '0.5rem',
      display: 'inline-block',
    },
    searchBar: {
      display: 'flex',
      marginBottom: '2rem',
    },
    searchInput: {
      flex: 1,
      padding: '0.8rem',
      border: '1px solid #ddd',
      borderRadius: '4px 0 0 4px',
      fontSize: '1rem',
    },
    searchButton: {
      padding: '0.8rem 1.5rem',
      backgroundColor: '#4ECDC4',
      color: 'white',
      border: 'none',
      borderRadius: '0 4px 4px 0',
      cursor: 'pointer',
      fontWeight: 600,
    },
    communityGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '2rem',
      marginBottom: '3rem',
    },
    communityCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      transition: 'transform 0.3s ease',
      ':hover': {
        transform: 'translateY(-5px)',
      },
    },
    cardHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid #eee',
    },
    cardTitle: {
      fontSize: '1.3rem',
      marginBottom: '0.5rem',
      color: '#292F36',
    },
    cardSubtitle: {
      color: '#666',
      fontSize: '0.9rem',
    },
    cardBody: {
      padding: '1.5rem',
    },
    cardStats: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '1rem',
      color: '#666',
    },
    stat: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    discussionList: {
      listStyle: 'none',
      padding: 0,
    },
    discussionItem: {
      padding: '1.5rem',
      borderBottom: '1px solid #eee',
      ':last-child': {
        borderBottom: 'none',
      },
    },
    discussionHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      marginRight: '1rem',
      objectFit: 'cover',
    },
    discussionTitle: {
      fontSize: '1.1rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
    },
    discussionMeta: {
      display: 'flex',
      gap: '1rem',
      color: '#666',
      fontSize: '0.9rem',
    },
    footer: {
      backgroundColor: '#292F36',
      color: 'white',
      padding: '2rem',
      textAlign: 'center',
      marginTop: '3rem',
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

  // Sample data
  const popularCommunities = [
    {
      id: 1,
      name: 'Vegetarian Chefs',
      members: 1250,
      discussions: 342,
      description: 'A community for vegetarian cooking enthusiasts to share recipes and tips.'
    },
    {
      id: 2,
      name: 'Baking Masters',
      members: 980,
      discussions: 215,
      description: 'Everything about baking - from bread to pastries and everything in between.'
    },
    {
      id: 3,
      name: 'Quick & Easy Meals',
      members: 2100,
      discussions: 587,
      description: 'For busy people who want to make delicious meals in no time.'
    }
  ];

  const recentDiscussions = [
    {
      id: 1,
      title: 'Best substitutes for eggs in baking?',
      author: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      replies: 24,
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      title: 'My sourdough starter keeps dying - help!',
      author: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      replies: 15,
      lastActivity: '5 hours ago'
    },
    {
      id: 3,
      title: 'Favorite kitchen gadgets under $50?',
      author: 'Emma Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      replies: 42,
      lastActivity: '1 day ago'
    },
    {
      id: 4,
      title: 'Meal prep ideas for the week',
      author: 'David Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      replies: 18,
      lastActivity: '1 day ago'
    }
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <div style={styles.logo}>Taste<span style={styles.logoSpan}>Share</span></div>
          <div style={styles.navLinks}>
            <a href="/recipe" style={styles.navLink}>Recipes</a>
            <a href="/challenge" style={styles.navLink}>Challenges</a>
            <a href="/plan" style={styles.navLink}>Meal Plans</a>
            <a href="/community" style={{...styles.navLink, color: '#FF6B6B'}}>Community</a>
          </div>
          <div style={styles.authButtons}>
            <button style={{...styles.btn, ...styles.btnOutline}}>Log In</button>
            <button style={{...styles.btn, ...styles.btnPrimary}}>Sign Up</button>
          </div>
        </nav>
      </header>

      <main>
        <section style={styles.hero}>
          <h1 style={styles.heroTitle}>TasteShare Community</h1>
          <p style={styles.heroSubtitle}>
            Connect with fellow food enthusiasts, share your culinary experiences, and get inspired by others.
            Join discussions, ask questions, and be part of our growing community.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button style={{...styles.btn, ...styles.btnPrimary, padding: '0.8rem 2rem'}}>Start a Discussion</button>
            <button style={{...styles.btn, ...styles.btnOutline, padding: '0.8rem 2rem', borderColor: 'white', color: 'white'}}>Browse All Communities</button>
          </div>
        </section>

        <div style={styles.searchBar}>
          <input 
            type="text" 
            placeholder="Search discussions, communities, or members..." 
            style={styles.searchInput}
          />
          <button style={styles.searchButton}>Search</button>
        </div>

        <section>
          <h2 style={styles.sectionTitle}>Popular Communities</h2>
          <div style={styles.communityGrid}>
            {popularCommunities.map(community => (
              <div key={community.id} style={styles.communityCard}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{community.name}</h3>
                  <p style={styles.cardSubtitle}>{community.description}</p>
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.cardStats}>
                    <div style={styles.stat}>👥 {community.members.toLocaleString()} members</div>
                    <div style={styles.stat}>💬 {community.discussions.toLocaleString()} discussions</div>
                  </div>
                  <button style={{...styles.btn, ...styles.btnPrimary, width: '100%', marginTop: '1rem'}}>
                    Join Community
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={styles.sectionTitle}>Recent Discussions</h2>
          <ul style={styles.discussionList}>
            {recentDiscussions.map(discussion => (
              <li key={discussion.id} style={styles.discussionItem}>
                <div style={styles.discussionHeader}>
                  <img src={discussion.avatar} alt={discussion.author} style={styles.avatar} />
                  <div>
                    <h3 style={styles.discussionTitle}>{discussion.title}</h3>
                    <div style={styles.discussionMeta}>
                      <span>by {discussion.author}</span>
                      <span>💬 {discussion.replies} replies</span>
                      <span>⏱️ {discussion.lastActivity}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
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

export default Community;
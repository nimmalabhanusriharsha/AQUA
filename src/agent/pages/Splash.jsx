import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/agentAuth';
import logo from '../../assets/splash-logo.png';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated()) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }, 2000); // 2 second splash

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="auth-container" style={styles.container}>
      <div className="auth-box" style={styles.content}>
        <img src={logo} alt="Royals Marine Food" style={styles.logoImage} />
      </div>

      <div style={styles.loaderContainer}>
        <div style={styles.loaderBar}>
          <div style={styles.loaderProgress}></div>
        </div>
        <p style={styles.loadingText}>LOADING SYSTEM...</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    maxWidth: '400px',
    height: 'auto',
    marginBottom: '20px',
  },

  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: 'var(--color-primary)',
    marginBottom: '8px',
    letterSpacing: '0.5px',
  },
  titleDark: {
    color: 'var(--color-secondary)',
  },
  subtitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--color-primary)',
    marginBottom: '8px',
  },
  accentText: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-accent)',
    letterSpacing: '1px',
    marginBottom: '24px',
  },
  description: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    maxWidth: '250px',
    lineHeight: '1.5',
  },
  loaderContainer: {
    width: '100%',
    paddingBottom: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  loaderBar: {
    width: '160px',
    height: '4px',
    backgroundColor: '#e2e8f0',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  loaderProgress: {
    width: '40%',
    height: '100%',
    backgroundColor: 'var(--color-primary)',
    borderRadius: '2px',
    animation: 'loading 2s infinite ease-in-out',
  },
  loadingText: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    letterSpacing: '1px',
  }
};

// Add animation keyframes to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes loading {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(250%); }
    }
  `;
  document.head.appendChild(style);
}

export default Splash;

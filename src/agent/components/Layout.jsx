import React, { useEffect, useState } from 'react';
import BottomNavigation from './BottomNavigation';
import { getSession } from '../utils/agentAuth';
import logo from '../../assets/logo.png';

const Layout = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const syncSession = () => {
      const s = getSession();
      if (s) {
        setSession(s);
      }
    };

    syncSession();

    window.addEventListener('agentProfileUpdated', syncSession);
    window.addEventListener('storage', syncSession);

    return () => {
      window.removeEventListener('agentProfileUpdated', syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  return (
    <div style={styles.appWrapper}>
      <div style={styles.phoneContainer}>
        {/* Sticky Top Header */}
        <header style={styles.header}>
          {/* Top Left Corner: Minimized Logo */}
          <div style={styles.headerLeft}>
            <div style={styles.logoWrapper}>
              <img 
                src={logo} 
                alt="Royals Marine Logo" 
                style={styles.minimizedLogo} 
              />
            </div>
          </div>

          {/* Top Right Corner: Agent Name & Avatar */}
          <div style={styles.headerRight}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {session?.photo && (
                <img 
                  src={session.photo} 
                  alt="Profile" 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #2563D9' }} 
                />
              )}
              <div style={styles.agentName}>
                {session?.name || 'Agent User'}
              </div>
            </div>
          </div>
        </header>

        {/* Inner Content View */}
        <main style={styles.contentInner}>
          {children}
        </main>

        {/* Mobile APK Bottom Navigation */}
        <div style={styles.bottomNavContainer}>
          <BottomNavigation />
        </div>
      </div>
    </div>
  );
};

const styles = {
  appWrapper: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#F3F6FA', // Page Background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  phoneContainer: {
    width: '100%',
    maxWidth: '480px',
    height: '100vh',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxShadow: '0 0 25px rgba(23, 35, 60, 0.08)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #DCE4EE',
    flexShrink: 0,
    zIndex: 50,
    boxShadow: '0 2px 6px rgba(23, 35, 60, 0.03)',
    height: '64px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  minimizedLogo: {
    height: '42px',
    maxWidth: '145px',
    objectFit: 'contain',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    textAlign: 'right',
  },
  agentName: {
    fontSize: '16px', // Big Agent Name
    fontWeight: '700',
    color: '#17233C', // Dark Navy
    lineHeight: '1.2',
  },
  contentInner: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    padding: '16px',
    paddingBottom: '85px',
    width: '100%',
    boxSizing: 'border-box',
  },
  bottomNavContainer: {
    flexShrink: 0,
    zIndex: 40,
  }
};

export default Layout;



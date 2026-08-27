import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, FileCheck2, BarChart2, User, LogOut } from 'lucide-react';
import { getSession, logout } from '../utils/agentAuth';
import logo from '../../assets/logo.png';

const Sidebar = () => {
  const [session, setSession] = useState(getSession());
  const navigate = useNavigate();

  useEffect(() => {
    const syncSession = () => {
      setSession(getSession());
    };

    window.addEventListener('agentProfileUpdated', syncSession);
    window.addEventListener('storage', syncSession);

    return () => {
      window.removeEventListener('agentProfileUpdated', syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/farmers', label: 'Farmers', icon: Users },
    { path: '/tests', label: 'Weekly Tests', icon: FileCheck2 },
    { path: '/reports', label: 'Reports', icon: BarChart2 },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="sidebar-container" style={styles.sidebar}>
      <div style={styles.brand}>
        <img src={logo} alt="Royals Marine Food" style={styles.logoImage} />
      </div>

      {session && (
        <div style={styles.agentProfile}>
          <div style={styles.avatar}>
            {session.photo ? (
              <img src={session.photo} alt={session.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              session.name ? session.name.charAt(0) : 'A'
            )}
          </div>
          <div>
            <div style={styles.agentName}>{session.name}</div>
            <div style={styles.agentRegion}>{session.region}</div>
          </div>
        </div>
      )}

      <div style={styles.navMenu}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navLink,
              backgroundColor: isActive ? '#EAF3FF' : 'transparent',
              color: isActive ? '#2563D9' : '#17233C',
              borderRight: isActive ? '3px solid #2563D9' : '3px solid transparent',
            })}
          >
            <item.icon size={20} />
            <span style={{ fontWeight: 600 }}>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div style={styles.footer}>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  brand: {
    padding: '24px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid #DCE4EE',
  },
  logoImage: {
    width: '100%',
    maxWidth: '150px',
    height: 'auto',
  },
  agentProfile: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid #DCE4EE',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#2563D9',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px',
  },
  agentName: {
    fontWeight: '700',
    fontSize: '14px',
    color: '#17233C',
  },
  agentRegion: {
    fontSize: '12px',
    color: '#64748B',
  },
  navMenu: {
    padding: '16px 0',
    flex: 1,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
  },
  footer: {
    padding: '20px',
    borderTop: '1px solid #DCE4EE',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px',
    border: 'none',
    background: 'transparent',
    color: '#DC3F3F',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  }
};

export default Sidebar;

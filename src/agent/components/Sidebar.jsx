import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, FileCheck2, BarChart2, User, LogOut } from 'lucide-react';
import { getSession, logout } from '../utils/agentAuth';
import logo from '../../assets/logo.png';

const Sidebar = () => {
  const session = getSession();
  const navigate = useNavigate();

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
          <div style={styles.avatar}>{session.name ? session.name.charAt(0) : 'A'}</div>
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
              backgroundColor: isActive ? '#eff6ff' : 'transparent',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)',
              borderRight: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
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
    backgroundColor: 'var(--color-surface)',
  },
  brand: {
    padding: '24px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid var(--color-border)',
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
    borderBottom: '1px solid var(--color-border)',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
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
  },
  agentRegion: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
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
    borderTop: '1px solid var(--color-border)',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px',
    border: 'none',
    background: 'transparent',
    color: 'var(--status-red)',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  }
};

export default Sidebar;

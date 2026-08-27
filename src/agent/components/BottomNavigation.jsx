import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, FileCheck2, BarChart2, User } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/farmers', label: 'Farmers', icon: Users },
    { path: '/tests', label: 'Tests', icon: FileCheck2 },
    { path: '/reports', label: 'Reports', icon: BarChart2 },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div style={styles.container}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.path}
            style={styles.navItem}
            onClick={() => navigate(item.path)}
          >
            <Icon 
              size={24} 
              color={isActive ? '#2563D9' : '#64748B'} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span style={{ 
              ...styles.label, 
              color: isActive ? '#2563D9' : '#64748B',
              fontWeight: isActive ? 600 : 400
            }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '480px',
    height: '65px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 'env(safe-area-inset-bottom)',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
    zIndex: 1000,
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    cursor: 'pointer',
    width: '20%',
  },
  label: {
    fontSize: '11px',
  }
};

export default BottomNavigation;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Users, HardHat, Sprout, Database, 
  CheckSquare, Calendar, LineChart, FileText, Download, 
  Activity, Settings
} from 'lucide-react';
import logo from '../../assets/splash-logo.png';

const AdminSidebar = () => {
  const menuSections = [
    {
      title: 'Dashboard',
      items: [
        { name: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> }
      ]
    },
    {
      title: 'Organization',
      items: [
        { name: 'Regions', path: '/admin/regions', icon: <Map size={20} /> },
        { name: 'Incharges', path: '/admin/incharges', icon: <Users size={20} /> },
        { name: 'Agents', path: '/admin/agents', icon: <HardHat size={20} /> },
        { name: 'Farmers', path: '/admin/farmers', icon: <Sprout size={20} /> },
        { name: 'Tanks', path: '/admin/tanks', icon: <Database size={20} /> }
      ]
    },
    {
      title: 'Monitoring',
      items: [
        { name: 'Verifications', path: '/admin/verifications', icon: <CheckSquare size={20} /> },
        { name: 'Weekly Tests', path: '/admin/weekly-tests', icon: <Calendar size={20} /> },
        { name: 'Analytics', path: '/admin/analytics', icon: <LineChart size={20} /> }
      ]
    },
    {
      title: 'Reports',
      items: [
        { name: 'Reports', path: '/admin/reports', icon: <FileText size={20} /> },
        { name: 'Export Center', path: '/admin/export-center', icon: <Download size={20} /> }
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Activity Log', path: '/admin/activity-log', icon: <Activity size={20} /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> }
      ]
    }
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoSection}>
        <img src={logo} alt="Aqua Feed" style={styles.logo} />
        <div style={styles.roleBadge}>Admin Portal</div>
      </div>

      <nav style={styles.nav}>
        {menuSections.map((section, idx) => (
          <div key={idx} style={styles.section}>
            <div style={styles.sectionTitle}>{section.title}</div>
            <ul style={styles.menuList}>
              {section.items.map((item, i) => (
                <li key={i}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    style={({ isActive }) => ({
                      ...styles.link,
                      ...(isActive ? styles.activeLink : {})
                    })}
                  >
                    {React.cloneElement(item.icon, { 
                      color: 'inherit',
                      style: { opacity: 0.8 } 
                    })}
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '280px',
    backgroundColor: 'var(--color-primary)', // Dark blue
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    overflowY: 'auto'
  },
  logoSection: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  logo: {
    width: '120px',
    height: 'auto',
    marginBottom: '12px',
    filter: 'brightness(0) invert(1)' // Make logo white if needed
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '1px',
    textTransform: 'uppercase'
  },
  nav: {
    padding: '24px 16px',
    flex: 1
  },
  section: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: '12px',
    paddingLeft: '12px'
  },
  menuList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 500,
    transition: 'all 0.2s',
    marginBottom: '4px'
  },
  activeLink: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    fontWeight: 600
  }
};

export default AdminSidebar;

import React from 'react';
import { getAdminSession } from '../utils/adminAuth';
import { Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

const AdminHeader = ({ title, breadcrumbs }) => {
  const session = getAdminSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_auth_session');
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BackButton fallback="/admin/dashboard" />
          <h1 style={styles.title}>{title}</h1>
        </div>
        {breadcrumbs && (
          <div style={styles.breadcrumbs}>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span style={crumb.active ? styles.crumbActive : styles.crumb}>{crumb.label}</span>
                {idx < breadcrumbs.length - 1 && <span style={styles.separator}>/</span>}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <div style={styles.right}>
        <div style={styles.notification}>
          <Bell size={20} color="var(--color-text-muted)" />
          <span style={styles.badge}>3</span>
        </div>
        
        <div style={styles.profileBox}>
          <div style={styles.avatar}>
            <User size={18} color="white" />
          </div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{session?.name || 'Admin'}</span>
            <span style={styles.userRole}>Administrator</span>
          </div>
          <ChevronDown size={16} color="var(--color-text-muted)" />
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid var(--color-border)',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 40
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  title: {
    fontSize: '22px',
    fontWeight: 700,
    color: 'var(--color-text-main)',
    margin: 0
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px'
  },
  crumb: {
    color: 'var(--color-text-muted)',
    cursor: 'pointer'
  },
  crumbActive: {
    color: 'var(--color-primary)',
    fontWeight: 600
  },
  separator: {
    color: 'var(--color-border)',
    margin: '0 2px'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  notification: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#f1f5f9'
  },
  badge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    backgroundColor: 'var(--status-red)',
    color: 'white',
    fontSize: '10px',
    fontWeight: 700,
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    border: '1px solid var(--color-border)'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  userName: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--color-text-main)'
  },
  userRole: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    fontWeight: 500
  }
};

export default AdminHeader;

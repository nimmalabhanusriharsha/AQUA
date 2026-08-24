import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Save, LogOut } from 'lucide-react';
import { getSession, logout } from '../utils/agentAuth';

const Profile = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const s = getSession();
    if (!s) {
      navigate('/login');
      return;
    }
    setSession(s);
  }, [navigate]);

  if (!session) return null;

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }
    
    // In a real app, this would hit an API.
    // For this prototype, we'll just simulate success.
    setMessage('Password changed successfully! (Prototype Demo)');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text-main)', padding: 0 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div style={styles.iconCircle}>
            <User size={24} color="var(--color-primary)" />
          </div>
          <div>
            <h2 style={styles.title}>Agent Profile</h2>
            <div style={styles.subtitle}>Manage your account details</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Details Card */}
        <div className="card" style={styles.card}>
          <h3 style={styles.cardTitle}>Account Information</h3>
          
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Agent ID</span>
            <span style={styles.infoValue}>{session.agentId}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Full Name</span>
            <span style={styles.infoValue}>{session.name}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Region</span>
            <span style={styles.infoValue}>{session.region}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Locality</span>
            <span style={styles.infoValue}>{session.locality}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Last Login</span>
            <span style={styles.infoValue}>{new Date(session.loginTime).toLocaleString()}</span>
          </div>

          <button 
            style={styles.logoutBtn} 
            onClick={handleLogout}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Change Password Card */}
        <div className="card" style={styles.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Lock size={20} color="var(--color-text-main)" />
            <h3 style={{...styles.cardTitle, marginBottom: 0}}>Change Password</h3>
          </div>

          {message && (
            <div style={{
              ...styles.messageBox, 
              backgroundColor: message.includes('success') ? '#dcfce7' : '#fee2e2',
              color: message.includes('success') ? '#166534' : '#991b1b'
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handlePasswordChange}>
            <div className="input-group">
              <label style={styles.label}>Current Password</label>
              <div className="input-field">
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label style={styles.label}>New Password</label>
              <div className="input-field">
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label style={styles.label}>Confirm New Password</label>
              <div className="input-field">
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '12px' }}>
              <Save size={18} /> Update Password
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    fontWeight: '600',
  },
  card: {
    padding: '24px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    marginBottom: '20px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid var(--color-border)',
  },
  infoLabel: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: '14px',
    color: 'var(--color-text-main)',
    fontWeight: '700',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-main)',
    marginBottom: '8px',
    display: 'block'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '12px',
    marginTop: '24px',
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s'
  },
  messageBox: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '13px',
    fontWeight: '600',
  }
};

export default Profile;

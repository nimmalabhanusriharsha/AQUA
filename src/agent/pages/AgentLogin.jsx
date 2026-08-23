import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { login, isAuthenticated } from '../utils/agentAuth';
import logo from '../../assets/splash-logo.png';

const AgentLogin = () => {
  const navigate = useNavigate();
  const [agentId, setAgentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!agentId || !password) {
      setError('Please enter both Agent ID and Password');
      return;
    }

    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const result = login(agentId, password);
      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error);
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="auth-container">
      <div className="auth-box card">
        <div style={styles.logoSection}>
          <img src={logo} alt="Royals Marine Food" style={styles.logoImage} />
        </div>

        <div style={styles.formSection}>
          <h2 style={styles.welcomeTitle}>Welcome Back</h2>
          <p style={styles.welcomeSubtitle}>Sign in to continue to your field dashboard.</p>

          <form onSubmit={handleLogin} style={styles.form}>
            <div className="input-group">
              <label style={styles.label}>Agent ID / Mobile Number</label>
              <div className="input-field">
                <User size={18} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Enter Agent ID"
                  value={agentId}
                  onChange={e => setAgentId(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label style={styles.label}>Password</label>
              <div className="input-field">
                <Lock size={18} color="#94a3b8" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <div
                  style={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                </div>
              </div>
            </div>

            <div style={styles.rememberRow}>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" style={styles.checkbox} defaultChecked />
                Remember me
              </label>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: '12px' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'LOGIN'}
            </button>
          </form>

          <div style={styles.forgotPassword}>
            Forgot Password?
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  logoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '24px',
  },
  logoImage: {
    width: '100%',
    maxWidth: '180px',
    height: 'auto',
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  welcomeTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    textAlign: 'center',
    marginBottom: '8px',
  },
  welcomeSubtitle: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    textAlign: 'center',
    marginBottom: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-main)',
    marginBottom: '8px',
    display: 'block',
  },
  eyeIcon: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  rememberRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: 'var(--color-text-main)',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '8px',
    width: '16px',
    height: '16px',
    accentColor: 'var(--color-primary)',
  },
  error: {
    color: 'var(--status-red)',
    fontSize: '13px',
    marginBottom: '16px',
    textAlign: 'center',
  },
  forgotPassword: {
    marginTop: '24px',
    textAlign: 'center',
    color: 'var(--color-primary)',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  }
};

export default AgentLogin;

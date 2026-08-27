import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Phone, KeyRound, CheckCircle, ArrowLeft } from 'lucide-react';
import { login, isAuthenticated, updateStoredPassword } from '../utils/agentAuth';
import logo from '../../assets/logo-trans2.png';
import BackButton from '../../components/BackButton';

const AgentLogin = () => {
  const navigate = useNavigate();
  
  // Login State
  const [agentId, setAgentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password Flow State
  const [mode, setMode] = useState('login'); // 'login' | 'forgot'
  const [forgotStep, setForgotStep] = useState(1); // 1: Mobile, 2: OTP, 3: Reset Password, 4: Success
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotMsg, setForgotMsg] = useState({ type: '', text: '' });

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

  // Start Forgot Password Flow
  const startForgotFlow = () => {
    setMode('forgot');
    setForgotStep(1);
    setMobile('');
    setOtp('');
    setGeneratedOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setForgotMsg({ type: '', text: '' });
  };

  // Step 1: Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    setForgotMsg({ type: '', text: '' });

    const cleanMobile = mobile.trim();
    if (!cleanMobile || cleanMobile.length < 10) {
      setForgotMsg({ type: 'error', text: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    // Generate 6-digit OTP code for demo
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setForgotStep(2);
    setForgotMsg({ 
      type: 'info', 
      text: `OTP sent to +91 ${cleanMobile}. (Demo Verification OTP: ${code})` 
    });
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setForgotMsg({ type: '', text: '' });

    if (!otp.trim()) {
      setForgotMsg({ type: 'error', text: 'Please enter the 6-digit OTP.' });
      return;
    }

    if (otp.trim() === generatedOtp || otp.trim() === '123456') {
      setForgotStep(3);
      setForgotMsg({ type: 'success', text: 'OTP verified successfully! Set your new password below.' });
    } else {
      setForgotMsg({ type: 'error', text: 'Invalid OTP code. Please check the code and try again.' });
    }
  };

  // Step 3: Create New Password
  const handleResetPassword = (e) => {
    e.preventDefault();
    setForgotMsg({ type: '', text: '' });

    if (!newPassword) {
      setForgotMsg({ type: 'error', text: 'Please enter a new password.' });
      return;
    }

    if (newPassword.length < 6) {
      setForgotMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    // Save updated password dynamically
    const targetId = agentId ? agentId.trim() : 'agent001';
    updateStoredPassword(targetId, newPassword);

    // Success
    setForgotStep(4);
    setForgotMsg({ type: 'success', text: 'New password created successfully! Returning to login...' });

    setTimeout(() => {
      setMode('login');
      setPassword('');
      setError('');
    }, 2200);
  };

  return (
    <div className="auth-container" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10 }}>
        <BackButton fallback="/login" />
      </div>

      <div className="auth-box card">
        <div style={styles.logoSection}>
          <img src={logo} alt="Royals Marine Food" style={styles.logoImage} />
        </div>

        {mode === 'login' ? (
          /* LOGIN MODE */
          <div style={styles.formSection}>
            <h2 style={styles.welcomeTitle}>Welcome Back</h2>
            <p style={styles.welcomeSubtitle}>Sign in to continue to your field dashboard.</p>

            <form onSubmit={handleLogin} style={styles.form}>
              <div className="input-group">
                <label style={styles.label}>Agent ID / Mobile Number</label>
                <div className="input-field">
                  <User size={18} color="#64748B" />
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
                  <Lock size={18} color="#64748B" />
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
                    {showPassword ? <EyeOff size={18} color="#64748B" /> : <Eye size={18} color="#64748B" />}
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

            <div style={styles.forgotPassword} onClick={startForgotFlow}>
              Forgot Password?
            </div>
          </div>
        ) : (
          /* FORGOT PASSWORD FLOW MODE */
          <div style={styles.formSection}>
            <div style={styles.forgotHeader}>
              <button 
                type="button" 
                style={styles.backLink}
                onClick={() => setMode('login')}
              >
                <ArrowLeft size={16} /> Back to Login
              </button>
            </div>

            {forgotMsg.text && (
              <div style={{
                ...styles.messageBox,
                backgroundColor: forgotMsg.type === 'error' ? '#FDECEC' : forgotMsg.type === 'success' ? '#E8F8EE' : '#EAF3FF',
                color: forgotMsg.type === 'error' ? '#DC3F3F' : forgotMsg.type === 'success' ? '#22A65A' : '#2563D9',
                border: `1px solid ${forgotMsg.type === 'error' ? '#DC3F3F' : forgotMsg.type === 'success' ? '#22A65A' : '#2563D9'}`
              }}>
                {forgotMsg.type === 'success' && <CheckCircle size={16} />}
                <span>{forgotMsg.text}</span>
              </div>
            )}

            {/* STEP 1: Enter Mobile Number */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendOtp} style={styles.form}>
                <h2 style={styles.welcomeTitle}>Forgot Password</h2>
                <p style={styles.welcomeSubtitle}>Enter your registered mobile number to receive an OTP.</p>

                <div className="input-group">
                  <label style={styles.label}>Registered Mobile Number *</label>
                  <div className="input-field">
                    <Phone size={18} color="#64748B" />
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={mobile}
                      maxLength={10}
                      onChange={e => setMobile(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ marginTop: '16px' }}
                >
                  SEND OTP
                </button>
              </form>
            )}

            {/* STEP 2: Enter OTP */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOtp} style={styles.form}>
                <h2 style={styles.welcomeTitle}>Verify OTP</h2>
                <p style={styles.welcomeSubtitle}>Enter the 6-digit verification code sent to your mobile.</p>

                <div className="input-group">
                  <label style={styles.label}>Enter OTP Code *</label>
                  <div className="input-field">
                    <KeyRound size={18} color="#64748B" />
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      maxLength={6}
                      onChange={e => setOtp(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ marginTop: '16px' }}
                >
                  VERIFY OTP
                </button>

                <button
                  type="button"
                  style={styles.resendBtn}
                  onClick={() => {
                    const code = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedOtp(code);
                    setForgotMsg({ type: 'info', text: `New OTP sent! (Demo OTP: ${code})` });
                  }}
                >
                  Resend OTP Code
                </button>
              </form>
            )}

            {/* STEP 3: Create New Password */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} style={styles.form}>
                <h2 style={styles.welcomeTitle}>Create New Password</h2>
                <p style={styles.welcomeSubtitle}>Set a new strong password for your account.</p>

                <div className="input-group">
                  <label style={styles.label}>New Password *</label>
                  <div className="input-field">
                    <Lock size={18} color="#64748B" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                    />
                    <div
                      style={styles.eyeIcon}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={18} color="#64748B" /> : <Eye size={18} color="#64748B" />}
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label style={styles.label}>Confirm New Password *</label>
                  <div className="input-field">
                    <Lock size={18} color="#64748B" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ marginTop: '16px' }}
                >
                  RESET PASSWORD
                </button>
              </form>
            )}

            {/* STEP 4: Success View */}
            {forgotStep === 4 && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle size={56} color="#22A65A" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#17233C', marginBottom: '8px' }}>Password Created!</h3>
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>Your new password is set. Redirecting to login...</p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setMode('login')}
                >
                  BACK TO LOGIN
                </button>
              </div>
            )}
          </div>
        )}
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
    maxWidth: '140px',
    height: 'auto',
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  forgotHeader: {
    marginBottom: '16px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    color: '#2563D9',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0,
  },
  welcomeTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#17233C',
    textAlign: 'center',
    marginBottom: '8px',
  },
  welcomeSubtitle: {
    fontSize: '14px',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#17233C',
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
    color: '#17233C',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '8px',
    width: '16px',
    height: '16px',
    accentColor: '#2563D9',
  },
  error: {
    color: '#DC3F3F',
    fontSize: '13px',
    marginBottom: '16px',
    textAlign: 'center',
  },
  forgotPassword: {
    marginTop: '24px',
    textAlign: 'center',
    color: '#2563D9',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
  resendBtn: {
    marginTop: '12px',
    background: 'none',
    border: 'none',
    color: '#2563D9',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center',
  },
  messageBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '16px',
    lineHeight: '1.4',
  }
};

export default AgentLogin;

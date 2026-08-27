import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { loginAdmin } from '../utils/adminAuth';
import logo from '../../assets/logo-trans2.png';
import BackButton from '../../components/BackButton';

const AdminLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!identifier || !password) {
      setError('Please enter both Admin ID/Mobile and Password');
      return;
    }

    const result = loginAdmin(identifier, password);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10 }}>
        <BackButton fallback="/login" />
      </div>
      <div className="auth-box card">
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          <img src={logo} alt="Aqua Feed Logo" style={{ width: '140px', height: 'auto', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-main)', marginBottom: '8px' }}>
            Admin Login
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Enter your credentials to access the management portal</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: 'var(--status-red)',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
            textAlign: 'center',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Admin ID or Mobile Number
            </label>
            <div className="input-field">
              <User size={18} color="var(--color-text-muted)" />
              <input 
                type="text" 
                placeholder="ADM001 or 9999999999" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Password
            </label>
            <div className="input-field">
              <Lock size={18} color="var(--color-text-muted)" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '12px', fontSize: '15px' }}>
            Sign In securely
          </button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <a href="/login" style={{ fontSize: '14px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
            Back to Portal Selection
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

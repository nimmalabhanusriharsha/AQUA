import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Lock, User } from 'lucide-react';
import { loginIncharge } from '../utils/inchargeAuth';

const InchargeLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!identifier || !password) {
      setError('Please enter both Incharge ID/Mobile and Password');
      return;
    }

    const result = loginIncharge(identifier, password);
    if (result.success) {
      navigate('/incharge/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'var(--color-primary)',
            borderRadius: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto',
            color: 'white'
          }}>
            <Droplets size={32} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-main)', marginBottom: '8px' }}>
            Incharge Login
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Enter your credentials to access the dashboard</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: 'var(--status-red)',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Incharge ID or Mobile Number
            </label>
            <div className="input-field">
              <User size={18} color="var(--color-text-muted)" />
              <input 
                type="text" 
                placeholder="INC001 or 9876543210" 
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

          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <a href="/login" style={{ fontSize: '14px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
            Back to Portal Selection
          </a>
        </div>
      </div>
    </div>
  );
};

export default InchargeLogin;

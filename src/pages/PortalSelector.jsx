import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LayoutTemplate, ArrowRight, Shield, HardHat, Waves } from 'lucide-react';
import logo from '../assets/logo-trans2.png';

const PortalSelector = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`
          @keyframes mesh {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          .portal-container {
            min-height: 100vh;
            background: linear-gradient(-45deg, #eff6ff, #dbeafe, #bfdbfe, #e0f2fe, #f0f9ff);
            background-size: 400% 400%;
            animation: mesh 15s ease infinite;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            font-family: 'Inter', sans-serif;
            position: relative;
            overflow-x: hidden;
            overflow-y: auto;
          }
          /* Decorative background blobs */
          .blob-1 {
            position: absolute;
            top: -10%;
            left: -10%;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(255,255,255,0) 70%);
            border-radius: 50%;
            animation: float 8s ease-in-out infinite;
          }
          .blob-2 {
            position: absolute;
            bottom: -20%;
            right: -10%;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(255,255,255,0) 70%);
            border-radius: 50%;
            animation: float 10s ease-in-out infinite reverse;
          }
          .portal-card {
            flex: 1 1 320px;
            max-width: 420px;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.8);
            border-radius: 28px;
            padding: 36px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 30px rgba(0,0,0,0.03), inset 0 0 0 1px rgba(255,255,255,0.5);
            position: relative;
            z-index: 10;
          }
          .portal-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 40px rgba(17, 24, 39, 0.08), inset 0 0 0 1px rgba(255,255,255,1);
            background: rgba(255, 255, 255, 0.95);
          }
          .portal-icon-wrapper {
            transition: transform 0.4s ease;
          }
          .portal-card:hover .portal-icon-wrapper {
            transform: scale(1.1) rotate(5deg);
          }
          .portal-arrow {
            transition: transform 0.3s ease;
          }
          .portal-card:hover .portal-arrow {
            transform: translateX(6px);
          }
        `}
      </style>

      <div className="portal-container">
        <div className="blob-1"></div>
        <div className="blob-2"></div>

        <div style={{ width: '100%', maxWidth: '1400px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '64px', animation: 'float 6s ease-in-out infinite' }}>
            <div style={{ margin: '0 auto 24px' }}>
              <img src={logo} alt="Aqua Feed" style={{ width: '160px', height: 'auto', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.15)) contrast(1.1) brightness(1.2)' }} />
            </div>
            <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-1.5px', color: 'var(--color-primary)' }}>
              Aqua Feed
            </h1>
            <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '24px', fontWeight: 500 }}>
              Intelligent Performance Management System
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(220, 252, 231, 0.8)',
              backdropFilter: 'blur(8px)', border: '1px solid rgba(187, 247, 208, 0.8)', padding: '8px 18px',
              borderRadius: '30px', fontSize: '13px', color: '#166534', fontWeight: 600, boxShadow: '0 4px 12px rgba(22, 163, 74, 0.1)'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a', boxShadow: '0 0 8px #16a34a' }}></div>
              All systems operational
            </div>
          </div>

          {/* Cards Section */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '28px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>

            {/* Agent Portal Card */}
            <div className="portal-card" onClick={() => navigate('/agent-login')}>
              <div className="portal-icon-wrapper" style={{
                width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '28px', color: 'white', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)'
              }}>
                <HardHat size={28} />
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '6px', color: '#111827', letterSpacing: '-0.5px' }}>Agent Portal</h2>
              <p style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#2563eb' }}>Field Operations</p>
              <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.6', marginBottom: '40px', flex: 1 }}>
                Mobile-optimized interface for field agents. Access assigned farmers, manage tanks, and submit real-time data from the field.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '20px' }}>
                <span style={{ color: '#6b7280', fontSize: '13px', fontWeight: 600 }}>Mobile / Web App</span>
                <span style={{ color: '#2563eb', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Enter <ArrowRight size={18} className="portal-arrow" />
                </span>
              </div>
            </div>

            {/* Admin Portal Card */}
            <div className="portal-card" onClick={() => navigate('/admin-login')}>
              <div className="portal-icon-wrapper" style={{
                width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '28px', color: 'white', background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                boxShadow: '0 8px 24px rgba(79, 70, 229, 0.25)'
              }}>
                <Shield size={28} />
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '6px', color: '#111827', letterSpacing: '-0.5px' }}>Admin Portal</h2>
              <p style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#4f46e5' }}>System Administrator</p>
              <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.6', marginBottom: '40px', flex: 1 }}>
                Organization-wide dashboard. Manage user access, configure system settings, monitor global compliance, and export data.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '20px' }}>
                <span style={{ color: '#6b7280', fontSize: '13px', fontWeight: 600 }}>Web Portal</span>
                <span style={{ color: '#4f46e5', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Enter <ArrowRight size={18} className="portal-arrow" />
                </span>
              </div>
            </div>

            {/* Incharge Portal Card */}
            <div className="portal-card" onClick={() => navigate('/incharge-login')}>
              <div className="portal-icon-wrapper" style={{
                width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '28px', color: 'white', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                boxShadow: '0 8px 24px rgba(14, 165, 233, 0.25)'
              }}>
                <LayoutTemplate size={28} />
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '6px', color: '#111827', letterSpacing: '-0.5px' }}>Incharge Portal</h2>
              <p style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0ea5e9' }}>Operations Manager</p>
              <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.6', marginBottom: '40px', flex: 1 }}>
                Web dashboard for regional Incharges. Monitor agent activity, allocate farmers, and review field test reports.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '20px' }}>
                <span style={{ color: '#6b7280', fontSize: '13px', fontWeight: 600 }}>Web Portal</span>
                <span style={{ color: '#0ea5e9', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Enter <ArrowRight size={18} className="portal-arrow" />
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default PortalSelector;

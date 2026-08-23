import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LayoutTemplate, ArrowRight, Shield, HardHat } from 'lucide-react';
import logo from '../assets/splash-logo.png';

const PortalSelector = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
             <img src={logo} alt="Aqua Feed" style={styles.logo} />
          </div>
          <h1 style={styles.title}>Aqua Feed</h1>
          <p style={styles.subtitle}>Performance Management System</p>
          <div style={styles.statusBadge}>
            <div style={styles.statusDot}></div>
            All systems operational
          </div>
        </div>

        {/* Cards Section - Horizontal Layout */}
        <div style={styles.cardsContainer}>
          {/* Agent Portal Card */}
          <div 
            style={{ ...styles.card, ...(hoveredCard === 'agent' ? styles.cardHover : {}) }}
            onMouseEnter={() => setHoveredCard('agent')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate('/agent-login')}
          >
            <div style={{...styles.iconBox, color: 'white', backgroundColor: 'var(--color-primary)'}}>
              <HardHat size={24} />
            </div>
            <h2 style={styles.cardTitle}>Agent Portal</h2>
            <p style={{...styles.cardRole, color: 'var(--color-primary)'}}>Field Operations</p>
            <p style={styles.cardDesc}>
              Mobile-optimized interface for field agents. Access assigned farmers, tanks, and submit data from the field.
            </p>
            <div style={styles.cardFooter}>
              <span style={{color: 'var(--color-text-muted)', fontSize: '13px', fontWeight: 500}}>Android App</span>
              <span style={{color: 'var(--color-primary)', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'}}>
                Enter <ArrowRight size={16} />
              </span>
            </div>
          </div>

          {/* Admin Portal Card */}
          <div 
            style={{ ...styles.card, ...(hoveredCard === 'admin' ? styles.cardHover : {}) }}
            onMouseEnter={() => setHoveredCard('admin')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate('/admin-login')}
          >
            <div style={{...styles.iconBox, color: 'white', backgroundColor: '#4f46e5'}}>
              <Shield size={24} />
            </div>
            <h2 style={styles.cardTitle}>Admin Portal</h2>
            <p style={{...styles.cardRole, color: '#4f46e5'}}>System Administrator</p>
            <p style={styles.cardDesc}>
              Organization-wide dashboard. Manage user access, configure system settings, and monitor compliance.
            </p>
            <div style={styles.cardFooter}>
              <span style={{color: 'var(--color-text-muted)', fontSize: '13px', fontWeight: 500}}>Web Portal</span>
              <span style={{color: '#4f46e5', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'}}>
                Enter <ArrowRight size={16} />
              </span>
            </div>
          </div>

          {/* Incharge Portal Card */}
          <div 
            style={{ ...styles.card, ...(hoveredCard === 'incharge' ? styles.cardHover : {}) }}
            onMouseEnter={() => setHoveredCard('incharge')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate('/incharge-login')}
          >
            <div style={{...styles.iconBox, color: 'white', backgroundColor: '#0ea5e9'}}>
              <LayoutTemplate size={24} />
            </div>
            <h2 style={styles.cardTitle}>Incharge Portal</h2>
            <p style={{...styles.cardRole, color: '#0ea5e9'}}>Operations Manager</p>
            <p style={styles.cardDesc}>
              Web dashboard for regional Incharges. Monitor agents, allocate farmers, and review field test reports.
            </p>
            <div style={styles.cardFooter}>
              <span style={{color: 'var(--color-text-muted)', fontSize: '13px', fontWeight: 500}}>Web Portal</span>
              <span style={{color: '#0ea5e9', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'}}>
                Enter <ArrowRight size={16} />
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc', // Very light grey/blue
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    color: 'var(--color-text-main)',
    fontFamily: 'Inter, sans-serif',
  },
  content: {
    width: '100%',
    maxWidth: '1000px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  logoContainer: {
    width: '80px',
    height: '80px',
    backgroundColor: 'white',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    border: '1px solid var(--color-border)'
  },
  logo: {
    width: '60px',
    height: 'auto'
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    marginBottom: '8px',
    letterSpacing: '-1px',
    color: 'var(--color-primary)' // Royal Blue
  },
  subtitle: {
    fontSize: '18px',
    color: 'var(--color-text-muted)',
    marginBottom: '24px',
    fontWeight: 500
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#dcfce7',
    border: '1px solid #bbf7d0',
    padding: '8px 16px',
    borderRadius: '30px',
    fontSize: '13px',
    color: '#166534',
    fontWeight: 600
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#16a34a'
  },
  cardsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '24px',
    width: '100%',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  card: {
    flex: '1 1 400px',
    maxWidth: '450px',
    backgroundColor: 'white',
    border: '1px solid var(--color-border)',
    borderRadius: '24px',
    padding: '32px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  cardHover: {
    transform: 'translateY(-4px)',
    borderColor: 'var(--color-primary)',
    boxShadow: '0 12px 24px rgba(23, 56, 115, 0.15)'
  },
  iconBox: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px'
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '6px',
    color: 'var(--color-text-main)'
  },
  cardRole: {
    fontSize: '14px',
    fontWeight: '700',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  cardDesc: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.6',
    marginBottom: '32px',
    flex: 1
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '20px'
  }
};

export default PortalSelector;

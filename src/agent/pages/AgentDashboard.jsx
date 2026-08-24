import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MapPin } from 'lucide-react';
import { getSession } from '../utils/agentAuth';
import { useMockData } from '../../context/MockDataContext';
import KPIcard from '../components/KPIcard';
import TodaysWork from '../components/TodaysWork';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const { getAgentDashboardMetrics, db } = useMockData();

  useEffect(() => {
    const s = getSession();
    if (s) {
      setSession(s);
    }
  }, []);

  if (!session) return null;

  const data = getAgentDashboardMetrics(session.agentId);
  const kpi = data.kpi;
  const todaysWork = data.todaysWork;

  const calculateProgress = () => {
    const total = kpi.testsCompleted + kpi.testsDue + kpi.overdue;
    if (total === 0) return { completed: 0, due: 0, overdue: 0 };
    return {
      completed: (kpi.testsCompleted / total) * 100,
      due: (kpi.testsDue / total) * 100,
      overdue: (kpi.overdue / total) * 100,
    };
  };

  const progress = calculateProgress();

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => navigate(-1)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text-main)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h2 style={styles.greeting}>Good Morning, {session.name}</h2>
          </div>
          <div style={styles.locationContainer}>
            <MapPin size={14} color="var(--color-text-muted)" />
            <span style={styles.locationBadge}>Region: {session.region}</span>
            <span style={styles.locationBadge}>Locality: {session.locality}</span>
          </div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.iconCircle}>
            <Bell size={20} color="var(--color-primary)" />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3">
          <KPIcard value={kpi.assignedFarmers} label="Assigned Farmers" colorClass="blue" />
          <KPIcard value={kpi.totalTanks} label="Total Tanks" colorClass="blue" />
          <KPIcard value={kpi.testsCompleted} label="Tests Completed" colorClass="green" />
          <KPIcard value={kpi.testsDue} label="Tests Due" colorClass="yellow" />
          <KPIcard value={kpi.overdue} label="Overdue" colorClass="red" />
          <KPIcard value={kpi.pendingVerify} label="Pending Verify" colorClass="orange" />
        </div>

        <div className="grid md:grid-cols-2" style={{ marginTop: '24px' }}>
          {/* Today's Work */}
          <div>
            <TodaysWork tasks={todaysWork} />
          </div>

          {/* Weekly Test Status */}
          <div>
            <div className="card" style={styles.testStatusCard}>
              <h3 style={styles.cardTitle}>Weekly Test Status</h3>
              <div style={styles.progressBarContainer}>
                <div style={{...styles.progressSegment, backgroundColor: 'var(--status-green)', width: `${progress.completed}%`}}></div>
                <div style={{...styles.progressSegment, backgroundColor: 'var(--status-yellow)', width: `${progress.due}%`}}></div>
                <div style={{...styles.progressSegment, backgroundColor: 'var(--status-red)', width: `${progress.overdue}%`}}></div>
              </div>
              <div style={styles.progressLabels}>
                <div style={styles.legendItem}>
                  <div style={{...styles.legendDot, backgroundColor: 'var(--status-green)'}}></div>
                  <span>Completed: {kpi.testsCompleted}</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={{...styles.legendDot, backgroundColor: 'var(--status-yellow)'}}></div>
                  <span>Due: {kpi.testsDue}</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={{...styles.legendDot, backgroundColor: 'var(--status-red)'}}></div>
                  <span>Overdue: {kpi.overdue}</span>
                </div>
              </div>
              
              <button 
                className="btn-primary" 
                style={styles.newFarmerBtn}
                onClick={() => navigate('/add-farmer')}
              >
                + NEW FARMER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingTop: '8px', // align with the text
  },
  iconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  greeting: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    marginBottom: '8px',
  },
  locationContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  locationBadge: {
    backgroundColor: '#e2e8f0',
    padding: '4px 10px',
    borderRadius: '16px',
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    fontWeight: '500',
  },
  testStatusCard: {
    position: 'relative',
    paddingBottom: '24px',
    height: '100%',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  progressBarContainer: {
    width: '100%',
    height: '8px',
    backgroundColor: '#f1f5f9',
    borderRadius: '4px',
    display: 'flex',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  progressSegment: {
    height: '100%',
  },
  progressLabels: {
    display: 'flex',
    gap: '24px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--color-text-main)',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  newFarmerBtn: {
    marginTop: '24px',
    width: 'auto',
    padding: '12px 24px',
    borderRadius: '8px',
    display: 'block',
  }
};

export default AgentDashboard;

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
  const [showNotifications, setShowNotifications] = useState(false);
  const { getAgentDashboardMetrics, getAgentNotifications, markNotificationRead, db } = useMockData();

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
  const notifications = getAgentNotifications(session.agentId);
  const unreadCount = notifications.filter(n => !n.read).length;

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
          <h2 style={styles.greeting}>Good Morning, {session.name}</h2>
          <div style={styles.locationContainer}>
            <MapPin size={14} color="var(--color-text-muted)" />
            <span style={styles.locationBadge}>Region: {session.region}</span>
            <span style={styles.locationBadge}>Locality: {session.locality}</span>
          </div>
        </div>
        <div style={styles.headerRight}>
          <div style={{ position: 'relative' }}>
            <div 
              style={styles.iconCircle}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} color="var(--color-primary)" />
              {unreadCount > 0 && (
                <div style={styles.notificationDot}>
                  {unreadCount}
                </div>
              )}
            </div>
            
            {showNotifications && (
              <div style={styles.notificationDropdown}>
                <h3 style={styles.notificationTitle}>Notifications</h3>
                {notifications.length === 0 ? (
                  <div style={styles.noNotifications}>No notifications</div>
                ) : (
                  <div style={styles.notificationList}>
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        style={{
                          ...styles.notificationItem,
                          backgroundColor: notification.read ? 'transparent' : '#f0f9ff'
                        }}
                        onClick={() => {
                          if (!notification.read) {
                            markNotificationRead(notification.id);
                          }
                        }}
                      >
                        <p style={{
                          ...styles.notificationMessage,
                          color: notification.type === 'error' ? 'var(--status-red)' : notification.type === 'warning' ? 'var(--status-orange)' : 'var(--status-green)'
                        }}>
                          {notification.message}
                        </p>
                        <span style={styles.notificationTime}>{notification.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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
  notificationDot: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: 'var(--status-red)',
    color: 'white',
    fontSize: '10px',
    fontWeight: 'bold',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDropdown: {
    position: 'absolute',
    top: '48px',
    right: '0',
    width: '320px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    zIndex: 100,
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
  },
  notificationTitle: {
    padding: '16px',
    borderBottom: '1px solid var(--color-border)',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    backgroundColor: '#f8fafc',
  },
  noNotifications: {
    padding: '24px 16px',
    textAlign: 'center',
    color: 'var(--color-text-muted)',
    fontSize: '14px',
  },
  notificationList: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  notificationItem: {
    padding: '16px',
    borderBottom: '1px solid var(--color-border)',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  notificationMessage: {
    fontSize: '14px',
    margin: '0 0 8px 0',
    lineHeight: '1.4',
  },
  notificationTime: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
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

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, User, Activity, UserCheck, Droplets, Database } from 'lucide-react';
import { useMockData } from '../../context/MockDataContext';
import { getSession } from '../utils/agentAuth';
import StatusBadge from '../components/StatusBadge';

const FarmerDetails = () => {
  const { farmerId } = useParams();
  const navigate = useNavigate();
  const { getFarmerById, getTanksByFarmerId, db } = useMockData();

  const baseFarmer = getFarmerById(farmerId);
  const farmer = baseFarmer ? { ...baseFarmer, tanks: getTanksByFarmerId(farmerId) } : null;

  if (!farmer) return <div style={styles.loading}>Loading farmer details...</div>;

  return (
    <div>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/farmers')}>
          <ArrowLeft size={20} />
          <span>Back to Farmers</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2">
        {/* Farmer Info Card */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={styles.cardHeader}>
            <h2 style={styles.title}>{farmer.name}</h2>
            <StatusBadge status={farmer.status} />
          </div>
          
          <div style={styles.infoList}>
            <div style={styles.infoRow}>
              <User size={16} color="var(--color-text-muted)" />
              <span style={styles.infoLabel}>Farmer ID:</span>
              <span style={styles.infoValue}>{farmer.id}</span>
            </div>
            <div style={styles.infoRow}>
              <Phone size={16} color="var(--color-text-muted)" />
              <span style={styles.infoLabel}>Phone:</span>
              <span style={styles.infoValue}>{farmer.phone}</span>
            </div>
            <div style={styles.infoRow}>
              <MapPin size={16} color="var(--color-text-muted)" />
              <span style={styles.infoLabel}>Location:</span>
              <span style={styles.infoValue}>{farmer.location}</span>
            </div>
            <div style={styles.infoRow}>
              <UserCheck size={16} color="var(--color-text-muted)" />
              <span style={styles.infoLabel}>Assigned Agent:</span>
              <span style={styles.infoValue}>{farmer.assignedAgentId === 'agent001' ? 'Agent 1' : farmer.assignedAgentId === 'agent002' ? 'Agent 2' : farmer.assignedAgentId}</span>
            </div>
            <div style={styles.infoRow}>
              <Droplets size={16} color="var(--color-text-muted)" />
              <span style={styles.infoLabel}>Water Source:</span>
              <span style={styles.infoValue}>{farmer.waterSource || 'N/A'}</span>
            </div>
            <div style={styles.infoRow}>
              <Database size={16} color="var(--color-text-muted)" />
              <span style={styles.infoLabel}>Total Tanks:</span>
              <span style={styles.infoValue}>{farmer.tanks?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Assigned Tanks */}
        <div className="card">
          <h3 style={styles.subtitle}>Assigned Tanks</h3>
          <div style={styles.tankList}>
            {farmer.tanks.map(tank => (
              <div 
                key={tank.id} 
                style={styles.tankItem}
                onClick={() => navigate(`/tanks/${tank.id}`)}
              >
                <div style={styles.tankInfo}>
                  <span style={styles.tankName}>{tank.name}</span>
                  <span style={styles.tankSubInfo}>Last Test: {tank.lastTest}</span>
                </div>
                <div style={styles.tankAction}>
                  <StatusBadge status={tank.testStatus} />
                  <span className="link" style={{ marginLeft: '12px' }}>View →</span>
                </div>
              </div>
            ))}
            {farmer.tanks.length === 0 && (
              <div style={styles.emptyState}>No tanks assigned to this farmer.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    marginBottom: '20px',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    color: 'var(--color-text-main)',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '15px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '16px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'var(--color-text-main)',
  },
  subtitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: 'var(--color-text-main)',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  infoLabel: {
    fontWeight: '600',
    fontSize: '14px',
    color: 'var(--color-text-main)',
    width: '120px',
  },
  infoValue: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
  },
  tankList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  tankItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    cursor: 'pointer',
    border: '1px solid var(--color-border)',
    transition: 'background-color 0.2s',
  },
  tankInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  tankName: {
    fontWeight: '600',
    color: 'var(--color-primary)',
  },
  tankSubInfo: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  },
  tankAction: {
    display: 'flex',
    alignItems: 'center',
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: 'var(--color-text-muted)',
  },
  emptyState: {
    padding: '20px',
    textAlign: 'center',
    color: 'var(--color-text-muted)',
    fontSize: '14px',
  }
};

export default FarmerDetails;

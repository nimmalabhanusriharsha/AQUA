import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, FlaskConical, ClipboardList, Clock, Ship } from 'lucide-react';
import { useMockData } from '../../context/MockDataContext';
import StatusBadge from '../components/StatusBadge';
import TankModal from '../../components/TankModal';

import { getSession } from '../utils/agentAuth';

const TankDetails = () => {
  const { tankId } = useParams();
  const navigate = useNavigate();
  const { getTankById, getFarmerById, deleteTank } = useMockData();
  const [isTankModalOpen, setIsTankModalOpen] = useState(false);

  const session = getSession();
  const tank = getTankById(tankId);
  const farmer = tank ? getFarmerById(tank.farmerId) : null;
  const isAssigned = tank && farmer && session && (farmer.agentId === session.agentId || tank.agentId === session.agentId);

  if (!tank || !farmer || !isAssigned) return <div style={styles.loading}>Tank details not found or not assigned to your account.</div>;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/dashboard')}>
          <ChevronLeft size={24} color="var(--color-text-main)" />
        </button>
        <h1 style={styles.headerTitle}>{tank.name} Overview</h1>
        <div style={{ width: 24 }}></div>
      </div>

      <div style={styles.content}>
        <div style={styles.topInfoRow}>
          <div style={styles.infoBlock}>
            <span style={styles.label}>Farmer</span>
            <span style={styles.valueLarge}>{farmer.name}</span>
          </div>
          <div style={styles.infoBlockRight}>
            <span style={styles.label}>Tank</span>
            <span style={styles.valueLarge}>{tank.name}</span>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Tank Information</h2>
          <div style={styles.divider}></div>
          <div style={styles.grid2Col}>
            <div style={styles.gridItem}>
              <span style={styles.label}>Tank Size</span>
              <span style={styles.value}>4 Acres</span>
            </div>
            <div style={styles.gridItem}>
              <span style={styles.label}>Soil Type</span>
              <span style={styles.value}>Loam</span>
            </div>
            <div style={styles.gridItemColSpan2}>
              <span style={styles.label}>Broodname</span>
              <span style={styles.value}>Spg Hatchery</span>
            </div>
            <div style={styles.gridItem}>
              <span style={styles.label}>Seed Date</span>
              <span style={styles.value}>10 June 2026</span>
            </div>
            <div style={styles.gridItem}>
              <span style={styles.label}>Seed Stocking</span>
              <span style={styles.value}>5 Lakh</span>
            </div>
            <div style={styles.gridItem}>
              <span style={styles.label}>Feed Type</span>
              <span style={styles.value}>—</span>
            </div>
            <div style={styles.gridItem}>
              <span style={styles.label}>Registered Location</span>
              <span style={styles.value}>{farmer.location.split(',')[0]}</span>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Current Performance</h2>
          <div style={styles.divider}></div>
          <div style={styles.listContainer}>
            <div style={styles.listItem}>
              <span style={styles.label}>Current ADW</span>
              <span style={styles.value}>{tank.abw}</span>
            </div>
            <div style={styles.dividerLight}></div>
            <div style={styles.listItem}>
              <span style={styles.label}>Current Biomass</span>
              <span style={styles.value}>{tank.biomass}</span>
            </div>
            <div style={styles.dividerLight}></div>
            <div style={styles.listItem}>
              <span style={styles.label}>Current FCR</span>
              <span style={styles.value}>{tank.fcr}</span>
            </div>
            <div style={styles.dividerLight}></div>
            
            <div style={styles.grid2ColSplit}>
              <div style={styles.gridItem}>
                <span style={styles.label}>Last Water Analysis</span>
                <span style={styles.value}>{tank.lastTest}</span>
              </div>
              <div style={styles.gridItemBorderLeft}>
                <span style={styles.label}>Last Feed Test</span>
                <span style={styles.value}>{tank.lastTest}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Weekly Test Status</h2>
          <div style={styles.statusBadgeWrapper}>
             <StatusBadge status={tank.testStatus} icon={<Clock size={14} style={{ marginRight: 4 }} />} />
          </div>
        </div>

        <div style={styles.buttonContainer}>
          <button 
            style={styles.primaryBtn}
            onClick={() => navigate(`/visit/${tank.id}`)}
          >
            <FlaskConical size={20} />
            <span>START SITE VISIT TEST</span>
          </button>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#EAF3FF',
                color: '#2563D9',
                border: '1px solid #DCE4EE',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onClick={() => setIsTankModalOpen(true)}
            >
              ✏️ Edit Tank Options
            </button>
            <button 
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#FDECEC',
                color: '#DC3F3F',
                border: '1px solid #DC3F3F',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onClick={() => {
                if (window.confirm(`Remove Tank "${tank.name}"?`)) {
                  deleteTank(tank.id);
                  navigate(-1);
                }
              }}
            >
              🗑️ Delete Tank
            </button>
          </div>
        </div>
      </div>

      <TankModal
        isOpen={isTankModalOpen}
        onClose={() => setIsTankModalOpen(false)}
        tank={tank}
        farmerId={tank.farmerId}
      />
    </div>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: '#ffffff',
    minHeight: '100%',
    paddingBottom: '40px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#17233C',
  },
  content: {
    padding: '0 24px',
  },
  topInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '32px',
    marginTop: '8px',
  },
  infoBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  infoBlockRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'flex-end',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#17233C',
    marginBottom: '12px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#DCE4EE',
    marginBottom: '16px',
    width: '100%',
  },
  dividerLight: {
    height: '1px',
    backgroundColor: '#DCE4EE',
    opacity: 0.5,
    margin: '12px 0',
    width: '100%',
  },
  grid2Col: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  grid2ColSplit: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    marginTop: '12px',
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  gridItemColSpan2: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    gridColumn: 'span 2',
  },
  gridItemBorderLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderLeft: '1px solid #DCE4EE',
    paddingLeft: '20px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748B',
  },
  value: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#17233C',
  },
  valueLarge: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#17233C',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadgeWrapper: {
    marginTop: '12px',
    display: 'flex',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '40px',
  },
  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#2563D9',
    color: '#ffffff',
    border: 'none',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
  },
  secondaryBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#ffffff',
    color: '#2563D9',
    border: '1px solid #2563D9',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: 'var(--color-text-muted)',
  },
};

export default TankDetails;

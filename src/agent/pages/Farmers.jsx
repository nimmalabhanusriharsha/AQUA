import React, { useState } from 'react';
import { Search, MapPin, Phone, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { useMockData } from '../../context/MockDataContext';
import { getSession } from '../utils/agentAuth';

const Farmers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, TEST DUE, OVERDUE
  const navigate = useNavigate();
  const { getFarmersByAgentId, getTanksByFarmerId, db } = useMockData();

  const session = getSession();
  const farmers = session ? getFarmersByAgentId(session.agentId).map(f => ({
    ...f,
    tanks: getTanksByFarmerId(f.id)
  })) : [];

  const filters = ['ALL', 'ACTIVE', 'TEST DUE', 'OVERDUE'];

  const handleExportFarmerReport = (farmer) => {
    const farmerSubs = (db?.submissions || []).filter(s => s.farmerId === farmer.id);
    const headers = ['Farmer ID', 'Farmer Name', 'Locality', 'Phone', 'Land Acres', 'Water Source', 'Date', 'Pond (Tank)', 'Test Type', 'Salinity', 'pH', 'DO', 'Biomass', 'FCR', 'Status'];
    
    const rows = farmerSubs.length > 0 ? farmerSubs.map(sub => {
      const tank = (farmer.tanks || []).find(t => t.id === sub.tankId);
      return [
        farmer.id,
        farmer.name,
        farmer.location,
        farmer.phone,
        farmer.acres || '20',
        farmer.waterSource || 'Canal',
        sub.date,
        tank ? tank.name : sub.tankId,
        sub.testType || 'Water Analysis',
        sub.data?.waterQuality?.salinity || '15',
        sub.data?.waterQuality?.ph || '7.8',
        sub.data?.waterQuality?.do || '5.2',
        sub.data?.biomass || '800kg',
        sub.data?.fcr || '1.2',
        sub.status
      ];
    }) : [
      [farmer.id, farmer.name, farmer.location, farmer.phone, farmer.acres, farmer.waterSource, 'N/A', 'N/A', 'No Submissions', '-', '-', '-', '-', '-', farmer.status]
    ];

    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `individual_farmer_${farmer.name.toLowerCase().replace(/\s+/g, '_')}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic
  const filteredFarmers = farmers.filter(farmer => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = farmer.name.toLowerCase().includes(q);
      const matchesTank = farmer.tanks.some(t => t.name.toLowerCase().includes(q));
      if (!matchesName && !matchesTank) return false;
    }
    
    // Status Filter
    if (filter === 'ACTIVE') {
      if (farmer.status !== 'ACTIVE') return false;
    } else if (filter === 'TEST DUE') {
      const hasDue = farmer.tanks.some(t => t.testStatus === 'Due');
      if (!hasDue) return false;
    } else if (filter === 'OVERDUE') {
      const hasOverdue = farmer.tanks.some(t => t.testStatus === 'Overdue');
      if (!hasOverdue) return false;
    }
    
    return true;
  });

  return (
    <div>
      <div className="section-title" style={{ fontSize: '20px', marginBottom: '4px' }}>
        Assigned Farmers
      </div>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '20px' }}>
        Farmers and tanks assigned to you
      </p>
      
      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <Search size={18} color="#64748B" />
        <input 
          type="text" 
          placeholder="Search farmers or tanks..." 
          style={styles.searchInput}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button style={styles.clearBtn} onClick={() => setSearchQuery('')}>Clear</button>
        )}
      </div>

      {/* Filter Pills */}
      <div style={styles.filterScroll}>
        {filters.map(f => (
          <div 
            key={f}
            style={filter === f ? styles.filterActive : styles.filterInactive}
            onClick={() => setFilter(f)}
          >
            {f}
          </div>
        ))}
      </div>

      {/* Farmer Grid */}
      <div className="grid grid-cols-1" style={{ gap: '16px' }}>
        {filteredFarmers.length > 0 ? (
          filteredFarmers.map(farmer => (
            <div 
              key={farmer.id} 
              className="card" 
              style={styles.farmerCard}
              onClick={() => navigate(`/farmers/${farmer.id}`)}
            >
              <div style={styles.cardHeader}>
                <div style={styles.farmerNameGroup}>
                  <span style={styles.farmerName}>{farmer.name}</span>
                  <StatusBadge status={farmer.status} />
                </div>
                <div style={styles.contactInfo}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={12} /> {farmer.phone}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {farmer.location.split(',')[0]}
                  </span>
                </div>
              </div>
              
              <div style={styles.tankList}>
                {farmer.tanks.map(tank => (
                  <div key={tank.id} style={styles.tankItem}>
                    <span style={styles.tankName}>{tank.name}</span>
                    <StatusBadge status={tank.testStatus} />
                  </div>
                ))}
                {farmer.tanks.length === 0 && (
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>No tanks assigned</div>
                )}
              </div>
              
              <div style={{ ...styles.cardFooter, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="link">View Farmer →</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportFarmerReport(farmer);
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#EAF3FF',
                    color: '#2563D9',
                    border: '1px solid #2563D9',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Download size={13} /> Export Report
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>No farmers found matching criteria.</div>
        )}
      </div>
    </div>
  );
};

const styles = {
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EE',
    borderRadius: '8px',
    padding: '12px 16px',
    gap: '12px',
    marginBottom: '16px',
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    flex: 1,
    outline: 'none',
    fontSize: '15px',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-primary)',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
  },
  filterScroll: {
    display: 'flex',
    overflowX: 'auto',
    gap: '12px',
    paddingBottom: '8px',
    marginBottom: '20px',
    scrollbarWidth: 'none',
  },
  filterActive: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  filterInactive: {
    backgroundColor: 'white',
    color: 'var(--color-text-muted)',
    border: '1px solid var(--color-border)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  farmerCard: {
    padding: '16px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHeader: {
    marginBottom: '12px',
  },
  farmerNameGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  farmerName: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text-main)',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  },
  tankList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '12px',
    marginBottom: '12px',
  },
  tankItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tankName: {
    fontSize: '14px',
    color: 'var(--color-text-main)',
    fontWeight: '600',
  },
  cardFooter: {
    borderTop: '1px solid var(--color-border)',
    paddingTop: '12px',
    textAlign: 'right',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '40px 20px',
    color: 'var(--color-text-muted)',
    fontSize: '15px',
    backgroundColor: 'var(--color-surface)',
    borderRadius: '12px',
    border: '1px dashed var(--color-border)',
  }
};

export default Farmers;

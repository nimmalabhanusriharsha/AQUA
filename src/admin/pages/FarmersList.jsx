import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFarmers, getRegions } from '../utils/adminMockData';
import PageHeader from '../components/PageHeader';
import { 
  Search, Filter, Eye, Layers, MapPin, 
  ChevronRight, Maximize2, ShieldCheck 
} from 'lucide-react';

const FarmersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [tankFilter, setTankFilter] = useState('ALL');
  
  const farmers = getFarmers();
  const regions = getRegions();
  const navigate = useNavigate();

  // Filter farmers
  const filtered = farmers.filter(f => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      f.name.toLowerCase().includes(term) || 
      f.id.toLowerCase().includes(term) ||
      f.village.toLowerCase().includes(term) ||
      f.agent.toLowerCase().includes(term) ||
      f.incharge.toLowerCase().includes(term) ||
      f.region.toLowerCase().includes(term) ||
      (f.locality && f.locality.toLowerCase().includes(term));

    const matchesRegion = regionFilter === 'ALL' || f.region.includes(regionFilter);
    const matchesTank = 
      tankFilter === 'ALL' || 
      (tankFilter === '1' && f.tanks === 1) || 
      (tankFilter === 'MULTI' && f.tanks > 1);

    return matchesSearch && matchesRegion && matchesTank;
  });

  // Calculate totals
  const totalFarmersCount = farmers.length;
  const totalTanksCount = farmers.reduce((acc, f) => acc + (f.tanks || 1), 0);
  const totalAcresCount = farmers.reduce((acc, f) => acc + (f.totalAcres || parseFloat(f.acres) || 0), 0);

  return (
    <div style={styles.container}>
      <PageHeader 
        title="All Farmers Directory" 
        breadcrumbs={[{ label: 'Organization' }, { label: 'Farmers', active: true }]} 
      />

      {/* Summary Stat Chips Bar */}
      <div style={styles.summaryBar}>
        <div style={styles.summaryChip}>
          <span style={styles.chipLabel}>TOTAL FARMERS</span>
          <span style={styles.chipValue}>{totalFarmersCount}</span>
        </div>
        <div style={styles.summaryChip}>
          <span style={styles.chipLabel}>TOTAL ACTIVE TANKS</span>
          <span style={{ ...styles.chipValue, color: '#2563eb' }}>{totalTanksCount} Tanks</span>
        </div>
        <div style={styles.summaryChip}>
          <span style={styles.chipLabel}>TOTAL CULTIVATED LAND</span>
          <span style={{ ...styles.chipValue, color: '#16a34a' }}>{totalAcresCount.toFixed(1)} Acres</span>
        </div>
      </div>

      <div style={styles.card}>
        {/* Search & Filter Bar */}
        <div style={styles.filterBar}>
          <div style={styles.searchBox}>
            <Search size={16} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search by farmer name, ID, village, agent, incharge..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} style={styles.clearSearchBtn}>
                ×
              </button>
            )}
          </div>

          <div style={styles.filterGroup}>
            <select 
              value={regionFilter} 
              onChange={(e) => setRegionFilter(e.target.value)}
              style={styles.selectFilter}
            >
              <option value="ALL">All Regions</option>
              <option value="South Andhra">South Andhra</option>
              <option value="Central Andhra">Central Andhra</option>
            </select>

            <select 
              value={tankFilter} 
              onChange={(e) => setTankFilter(e.target.value)}
              style={styles.selectFilter}
            >
              <option value="ALL">All Tank Counts</option>
              <option value="1">Single Tank (1)</option>
              <option value="MULTI">Multiple Tanks (2+)</option>
            </select>
          </div>
        </div>

        {/* Farmers Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>FARMER NAME / ID</th>
                <th style={styles.th}>VILLAGE &amp; LOCALITY</th>
                <th style={styles.th}>AGENT &amp; INCHARGE</th>
                <th style={styles.th}>REGION</th>
                <th style={styles.th}>TOTAL ACRES</th>
                <th style={styles.th}>TOTAL TANKS &amp; SPREAD PER TANK</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item) => {
                  const totalAcresVal = item.totalAcres || parseFloat(item.acres) || 0;
                  const avgPerTank = (totalAcresVal / (item.tanks || 1)).toFixed(2);

                  return (
                    <tr key={item.id} style={styles.tr}>
                      {/* Farmer Name & ID */}
                      <td style={styles.td}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span style={styles.farmerName}>{item.name}</span>
                          <span style={styles.farmerId}>{item.id}</span>
                        </div>
                      </td>

                      {/* Village & Locality */}
                      <td style={styles.td}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span style={styles.villageText}>{item.village}</span>
                          <span style={styles.localityText}>{item.locality}</span>
                        </div>
                      </td>

                      {/* Agent & Incharge */}
                      <td style={styles.td}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span style={styles.agentText}>{item.agent}</span>
                          <span style={styles.inchargeText}>Incharge: {item.incharge}</span>
                        </div>
                      </td>

                      {/* Region */}
                      <td style={styles.td}>
                        <span style={styles.regionText}>{item.region}</span>
                      </td>

                      {/* Total Acres */}
                      <td style={styles.td}>
                        <span style={styles.acresBadge}>
                          {item.acres}
                        </span>
                      </td>

                      {/* Total Tanks & No. of Acres Each Tank is Spreaded */}
                      <td style={styles.td}>
                        <div style={styles.tanksContainer}>
                          {/* Tank count tag */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{
                              ...styles.tanksCountBadge,
                              backgroundColor: item.tanks > 1 ? '#eff6ff' : '#f0fdf4',
                              color: item.tanks > 1 ? '#2563eb' : '#16a34a',
                              borderColor: item.tanks > 1 ? '#bfdbfe' : '#bbf7d0'
                            }}>
                              {item.tanks} {item.tanks > 1 ? 'Tanks' : 'Tank'}
                            </span>
                            <span style={styles.avgSpreadText}>
                              {item.tanks > 1 ? `(Avg: ${avgPerTank} Ac/Tank)` : `(${totalAcresVal} Ac spread)`}
                            </span>
                          </div>

                          {/* Individual Tank Acreage Spread Breakdown */}
                          <div style={styles.tankBreakdownList}>
                            {item.tankBreakdown && item.tankBreakdown.length > 0 ? (
                              item.tankBreakdown.map((t, idx) => (
                                <span key={t.id || idx} style={styles.tankSpreadChip}>
                                  <strong style={{ color: '#1e293b' }}>{t.name}:</strong> {t.acres} Ac
                                </span>
                              ))
                            ) : (
                              <span style={styles.tankSpreadChip}>
                                <strong style={{ color: '#1e293b' }}>Tank 1:</strong> {item.acres}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <button 
                          style={styles.viewBtn}
                          onClick={() => navigate(`/admin/farmers/${item.id}`)}
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                    No farmers found matching current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '1380px',
    margin: '0 auto'
  },
  summaryBar: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap'
  },
  summaryChip: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '10px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
  },
  chipLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.4px'
  },
  chipValue: {
    fontSize: '16px',
    fontWeight: 800,
    color: '#0f172a'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '8px 12px',
    width: '380px'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    fontSize: '13px',
    color: '#1e293b'
  },
  clearSearchBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '16px',
    padding: 0
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  selectFilter: {
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '7px 12px',
    fontSize: '13px',
    color: '#334155',
    outline: 'none',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  theadRow: {
    borderBottom: '2px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  },
  th: {
    padding: '12px 14px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.4px'
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'background-color 0.15s',
    '&:hover': {
      backgroundColor: '#f8fafc'
    }
  },
  td: {
    padding: '14px',
    verticalAlign: 'middle',
    fontSize: '13px',
    color: '#334155'
  },
  farmerName: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#0f172a'
  },
  farmerId: {
    fontSize: '11.5px',
    fontWeight: 700,
    color: '#2563eb'
  },
  villageText: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#1e293b'
  },
  localityText: {
    fontSize: '12px',
    color: '#64748b'
  },
  agentText: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#0f172a'
  },
  inchargeText: {
    fontSize: '11.5px',
    color: '#64748b'
  },
  regionText: {
    fontSize: '12.5px',
    fontWeight: 500,
    color: '#334155',
    lineHeight: '1.3'
  },
  acresBadge: {
    fontSize: '13.5px',
    fontWeight: 800,
    color: '#0f172a'
  },
  tanksContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  tanksCountBadge: {
    fontSize: '11.5px',
    fontWeight: 800,
    padding: '2px 8px',
    borderRadius: '6px',
    border: '1px solid',
    letterSpacing: '0.3px',
    display: 'inline-block'
  },
  avgSpreadText: {
    fontSize: '11.5px',
    fontWeight: 600,
    color: '#64748b'
  },
  tankBreakdownList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px'
  },
  tankSpreadChip: {
    fontSize: '11px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '2px 7px',
    borderRadius: '5px',
    border: '1px solid #e2e8f0'
  },
  viewBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ffffff',
    color: '#334155',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '6px 14px',
    fontSize: '12.5px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
  }
};

export default FarmersList;

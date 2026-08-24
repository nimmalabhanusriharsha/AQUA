import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getRegions, getFarmers, adminLocalityFcrData 
} from '../utils/adminMockData';
import { 
  MapPin, Plus, FileSpreadsheet, Search, Check, X 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';

const Regions = () => {
  const navigate = useNavigate();
  const regions = getRegions();
  const allFarmers = getFarmers();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLocalityName, setNewLocalityName] = useState('');
  const [selectedRegionId, setSelectedRegionId] = useState('REG-SOUTH');
  const [localityList, setLocalityList] = useState(regions);
  const [successToast, setSuccessToast] = useState('');

  // Filter farmers table
  const filteredFarmers = allFarmers.filter(f => 
    f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.locality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.agent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.phone?.includes(searchTerm)
  );

  // Handle Excel Download for Locality
  const handleLocalityExcelExport = (localityName, regionName) => {
    const localityFarmers = allFarmers.filter(f => f.locality === localityName);
    
    let csv = "data:text/csv;charset=utf-8,";
    csv += `LOCALITY PERFORMANCE & FARMERS REPORT - ${localityName.toUpperCase()}\n`;
    csv += `Region: ${regionName}\n`;
    csv += `Generated On: ${new Date().toLocaleDateString()}\n\n`;
    csv += "FARMER ID,FARMER NAME,PHONE,REGION,LOCALITY,VILLAGE,ACRES,AGENT,TANKS\n";

    localityFarmers.forEach(f => {
      csv += `${f.id},"${f.name}",${f.phone},"${f.region}","${f.locality}","${f.village}","${f.acres}","${f.agent}",${f.tanks}\n`;
    });

    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${localityName.replace(/\s+/g, '_')}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSuccessToast(`Exported report for ${localityName}!`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Add new locality handler
  const handleAddLocality = (e) => {
    e.preventDefault();
    if (!newLocalityName.trim()) return;

    setLocalityList(prev => prev.map(reg => {
      if (reg.id === selectedRegionId) {
        return {
          ...reg,
          localities: [
            ...reg.localities,
            { id: `LOC-${Date.now()}`, name: newLocalityName.trim(), fcr: 1.40, farmers: 0, tanks: 0 }
          ]
        };
      }
      return reg;
    }));

    setSuccessToast(`Locality "${newLocalityName.trim()}" created successfully!`);
    setNewLocalityName('');
    setShowAddModal(false);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  return (
    <div style={styles.container}>
      {/* 1. Top Header Banner */}
      <div style={styles.topHeader}>
        <div>
          <h1 style={styles.mainTitle}>REGIONS &amp; LOCALITIES COMMAND CENTER</h1>
          <p style={styles.mainSubtitle}>
            Region &amp; Locality performance graphs, jurisdiction statistics, and total farmers directory
          </p>
        </div>
        <button 
          style={styles.addLocalityBtn}
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} />
          <span>Add New Locality</span>
        </button>
      </div>

      {/* 2. Locality-wise FCR Efficiency Graph Card */}
      <div style={styles.graphCard}>
        <div style={styles.graphHeader}>
          <div>
            <h2 style={styles.graphTitle}>Locality-wise FCR Efficiency Graph</h2>
            <p style={styles.graphSubtitle}>Feed conversion benchmarks per locality</p>
          </div>
          <div style={styles.targetFcrBadge}>
            Target FCR: 1.35
          </div>
        </div>

        <div style={{ height: '220px', marginTop: '12px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={adminLocalityFcrData} margin={{ top: 15, right: 30, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="locality" 
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                tick={{ fontSize: 13, fill: '#334155', fontWeight: 500 }} 
              />
              <YAxis 
                domain={[1.0, 1.8]} 
                ticks={[1, 1.2, 1.4, 1.6, 1.8]}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                tick={{ fontSize: 13, fill: '#334155', fontWeight: 500 }}
              />
              <RechartsTooltip 
                formatter={(val) => [`${val}`, 'FCR']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Line 
                type="monotone" 
                dataKey="fcr" 
                stroke="#0284c7" 
                strokeWidth={3} 
                dot={{ r: 5, fill: '#ffffff', stroke: '#0284c7', strokeWidth: 2.5 }}
                activeDot={{ r: 7, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Two Region Cards Grid (South Andhra & Central Andhra) */}
      <div style={styles.regionGrid}>
        {localityList.map(region => (
          <div key={region.id} style={styles.regionCard}>
            {/* Card Top Row: Code Pill + MapPin Icon */}
            <div style={styles.regionCardTop}>
              <div style={styles.regCodePill}>
                {region.code}
              </div>
              <div style={styles.pinCircle}>
                <MapPin size={18} color="#2563eb" />
              </div>
            </div>

            {/* Region Title */}
            <h3 style={styles.regionName}>
              {region.name}
            </h3>

            {/* 3 Stat Counters Box */}
            <div style={styles.statsRow}>
              <div style={styles.statBox}>
                <span style={styles.statLabel}>FARMERS</span>
                <span style={styles.statValue}>{region.farmers}</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statLabel}>TANKS</span>
                <span style={styles.statValue}>{region.tanks}</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statLabel}>AVG FCR</span>
                <span style={{ ...styles.statValue, color: '#2563eb' }}>{region.avgFcr.toFixed(2)}</span>
              </div>
            </div>

            {/* Localities & Excel Reports Section */}
            <div style={styles.localitiesSection}>
              <div style={styles.localitiesHeader}>
                LOCALITIES &amp; EXCEL REPORTS:
              </div>

              <div style={styles.localityList}>
                {region.localities?.map(loc => (
                  <div key={loc.id} style={styles.localityItem}>
                    <span style={styles.localityName}>{loc.name}</span>
                    <button 
                      style={styles.excelReportBtn}
                      onClick={() => handleLocalityExcelExport(loc.name, region.name)}
                    >
                      <FileSpreadsheet size={15} />
                      <span>Excel Report</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Total Farmers List Table (Region & Locality Wise) */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeaderRow}>
          <div>
            <h2 style={styles.tableTitle}>Total Farmers List (Region &amp; Locality Wise)</h2>
            <p style={styles.tableSubtitle}>
              Comprehensive roster of authorized aquaculture farmers across all regions
            </p>
          </div>

          <div style={styles.tableSearchBox}>
            <Search size={16} color="#94a3b8" />
            <input 
              type="text"
              placeholder="Filter by Farmer Name, Code, Locality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.tableSearchInput}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} style={styles.clearSearchBtn}>
                ×
              </button>
            )}
          </div>
        </div>

        <div style={{ overflowX: 'auto', marginTop: '16px' }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>FARMER ID</th>
                <th style={styles.th}>FARMER NAME</th>
                <th style={styles.th}>PHONE</th>
                <th style={styles.th}>REGION</th>
                <th style={styles.th}>LOCALITY</th>
                <th style={styles.th}>VILLAGE</th>
                <th style={styles.th}>ACRES</th>
                <th style={styles.th}>AGENT</th>
                <th style={styles.th}>TANKS</th>
              </tr>
            </thead>
            <tbody>
              {filteredFarmers.length > 0 ? (
                filteredFarmers.map(farmer => (
                  <tr key={farmer.id} style={styles.tr}>
                    <td 
                      style={{ ...styles.td, color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
                      onClick={() => navigate(`/admin/farmers/${farmer.id}`)}
                    >
                      {farmer.id}
                    </td>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#0f172a' }}>
                      {farmer.name}
                    </td>
                    <td style={styles.td}>
                      {farmer.phone}
                    </td>
                    <td style={{ ...styles.td, fontWeight: 600, color: '#334155' }}>
                      {farmer.region}
                    </td>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#2563eb' }}>
                      {farmer.locality}
                    </td>
                    <td style={styles.td}>
                      {farmer.village}
                    </td>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#0f172a' }}>
                      {farmer.acres}
                    </td>
                    <td style={styles.td}>
                      {farmer.agent}
                    </td>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#16a34a' }}>
                      {farmer.tanks} Tanks
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ padding: '36px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                    No farmers found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Add Locality Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                Add New Locality
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={styles.closeBtn}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddLocality}>
              <div style={styles.modalBody}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={styles.modalLabel}>Select Region</label>
                  <select 
                    style={styles.modalSelect}
                    value={selectedRegionId}
                    onChange={(e) => setSelectedRegionId(e.target.value)}
                  >
                    {regions.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={styles.modalLabel}>Locality Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Ongole Coastal Zone"
                    value={newLocalityName}
                    onChange={(e) => setNewLocalityName(e.target.value)}
                    style={styles.modalInput}
                    required
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={styles.submitBtn}
                >
                  Create Locality
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {successToast && (
        <div style={styles.toast}>
          <Check size={16} />
          <span>{successToast}</span>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '1380px',
    margin: '0 auto'
  },
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '4px'
  },
  mainTitle: {
    fontSize: '22px',
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-0.2px'
  },
  mainSubtitle: {
    fontSize: '13.5px',
    color: '#64748b',
    margin: '4px 0 0 0'
  },
  addLocalityBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 18px',
    fontSize: '13.5px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
    transition: 'background-color 0.15s',
    flexShrink: 0
  },
  graphCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  graphHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  graphTitle: {
    fontSize: '16.5px',
    fontWeight: 800,
    color: '#0f172a',
    margin: 0
  },
  graphSubtitle: {
    fontSize: '12.5px',
    color: '#64748b',
    margin: '4px 0 0 0'
  },
  targetFcrBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    fontSize: '12px',
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: '8px',
    border: '1px solid #bbf7d0'
  },
  regionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  regionCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  regionCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  regCodePill: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    fontSize: '11px',
    fontWeight: 800,
    padding: '3px 8px',
    borderRadius: '6px',
    border: '1px solid #dbeafe',
    letterSpacing: '0.4px'
  },
  pinCircle: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    backgroundColor: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  regionName: {
    fontSize: '16.5px',
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 14px 0'
  },
  statsRow: {
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    padding: '12px 16px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
    marginBottom: '18px',
    border: '1px solid #f1f5f9'
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statLabel: {
    fontSize: '10.5px',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.5px',
    marginBottom: '2px'
  },
  statValue: {
    fontSize: '17px',
    fontWeight: 800,
    color: '#1e293b'
  },
  localitiesSection: {
    display: 'flex',
    flexDirection: 'column'
  },
  localitiesHeader: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.5px',
    marginBottom: '10px'
  },
  localityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  localityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '10px 14px',
    transition: 'background-color 0.15s'
  },
  localityName: {
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#0f172a'
  },
  excelReportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#f0fdf4',
    color: '#166534',
    border: '1px solid #bbf7d0',
    borderRadius: '6px',
    padding: '5px 12px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.15s'
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  tableHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px'
  },
  tableTitle: {
    fontSize: '17px',
    fontWeight: 800,
    color: '#0f172a',
    margin: 0
  },
  tableSubtitle: {
    fontSize: '12.5px',
    color: '#64748b',
    margin: '3px 0 0 0'
  },
  tableSearchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '7px 12px',
    width: '320px'
  },
  tableSearchInput: {
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
    fontSize: '11.5px',
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
    fontSize: '13px',
    color: '#334155'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '420px',
    padding: '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer'
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column'
  },
  modalLabel: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '6px'
  },
  modalSelect: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: '13.5px',
    outline: 'none'
  },
  modalInput: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: '13.5px',
    outline: 'none'
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  },
  cancelBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#475569',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  submitBtn: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#15803d',
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 9999
  }
};

export default Regions;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Filter } from 'lucide-react';
import { getSession } from '../utils/agentAuth';
import { useMockData } from '../../context/MockDataContext';
import StatusBadge from '../components/StatusBadge';

const Reports = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const { getSubmissionsByAgentId, getFarmersByAgentId } = useMockData();
  const [submissions, setSubmissions] = useState([]);
  const [farmers, setFarmers] = useState([]);
  
  // Filter states
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterFarmer, setFilterFarmer] = useState('');
  const [filterTank, setFilterTank] = useState('');
  const [filterModule, setFilterModule] = useState('');

  useEffect(() => {
    const s = getSession();
    if (!s) {
      navigate('/login');
      return;
    }
    setSession(s);

    // Get only submissions for this agent
    const agentSubmissions = getSubmissionsByAgentId(s.agentId);
    setSubmissions(agentSubmissions);

    // Get assigned farmers for dropdowns
    setFarmers(getFarmersByAgentId(s.agentId));
  }, [navigate, getSubmissionsByAgentId, getFarmersByAgentId]);

  if (!session) return null;

  // Filter logic
  const filteredData = submissions.filter(sub => {
    let match = true;
    if (filterDate && sub.date !== filterDate) match = false;
    if (filterFarmer && sub.farmerId !== filterFarmer) match = false;
    if (filterTank && sub.tankId !== filterTank) match = false;
    // For module, we might not have a strict 'module' field, but we can assume 'Site Visit' for all currently
    if (filterModule && filterModule !== 'Site Visit') match = false; 
    return match;
  });

  // Export to CSV function
  const handleExport = () => {
    if (filteredData.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = ['Date', 'Farmer ID', 'Tank ID', 'Status', 'Water Color', 'Salinity', 'pH', 'DO', 'Biomass', 'FCR'];
    
    const csvRows = [];
    csvRows.push(headers.join(','));

    filteredData.forEach(sub => {
      const data = sub.data || {};
      const wq = data.waterQuality || {};
      const row = [
        sub.date,
        sub.farmerId,
        sub.tankId,
        sub.status,
        wq.waterColor || 'N/A',
        wq.salinity || 'N/A',
        wq.ph || 'N/A',
        wq.do || 'N/A',
        data.biomass || 'N/A',
        data.fcr || 'N/A'
      ];
      csvRows.push(row.map(cell => `"${cell}"`).join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `aqua_report_${new Date().getTime()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Get dynamic tank list for selected farmer filter
  const selectedFarmerObj = farmers.find(f => f.id === filterFarmer);
  const availableTanks = selectedFarmerObj ? selectedFarmerObj.tanks : [];

  return (
    <div>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconCircle}>
            <FileText size={24} color="var(--color-primary)" />
          </div>
          <div>
            <h2 style={styles.title}>Reports & Exports</h2>
            <div style={styles.subtitle}>View and download your field data</div>
          </div>
        </div>
        <button className="btn-primary" onClick={handleExport} style={styles.exportBtn}>
          <Download size={18} /> Prototype CSV Export
        </button>
      </div>

      <div className="card" style={styles.filterCard}>
        <div style={styles.filterHeader}>
          <Filter size={18} color="var(--color-text-main)" />
          <h3 style={styles.filterTitle}>Filter Data</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="input-group">
            <label style={styles.label}>Date</label>
            <div className="input-field">
              <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
            </div>
          </div>
          
          <div className="input-group">
            <label style={styles.label}>Farmer</label>
            <div className="input-field">
              <select value={filterFarmer} onChange={e => { setFilterFarmer(e.target.value); setFilterTank(''); }}>
                <option value="">All Farmers</option>
                {farmers.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label style={styles.label}>Tank</label>
            <div className="input-field">
              <select value={filterTank} onChange={e => setFilterTank(e.target.value)} disabled={!filterFarmer}>
                <option value="">All Tanks</option>
                {availableTanks.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label style={styles.label}>Module</label>
            <div className="input-field">
              <select value={filterModule} onChange={e => setFilterModule(e.target.value)}>
                <option value="">All Modules</option>
                <option value="Site Visit">Site Visit</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {filteredData.length === 0 ? (
          <div style={styles.emptyState}>
            No records found for the selected filters.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Farmer ID</th>
                  <th style={styles.th}>Tank ID</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Salinity</th>
                  <th style={styles.th}>FCR</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((sub, idx) => (
                  <tr key={idx} style={styles.tr}>
                    <td style={styles.td}>{sub.date}</td>
                    <td style={styles.td}>{sub.farmerId}</td>
                    <td style={styles.td}>{sub.tankId}</td>
                    <td style={styles.td}><StatusBadge status={sub.status === 'PENDING_VERIFICATION' ? 'Due' : 'Completed'} /></td>
                    <td style={styles.td}>{sub.data?.waterQuality?.salinity || '-'} ppt</td>
                    <td style={styles.td}>{sub.data?.fcr || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    fontWeight: '600',
  },
  exportBtn: {
    backgroundColor: 'var(--status-green)',
  },
  filterCard: {
    marginBottom: '24px',
    padding: '20px'
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px'
  },
  filterTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-text-main)'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-main)',
    marginBottom: '8px',
    display: 'block'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  thead: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid var(--color-border)'
  },
  th: {
    padding: '12px 16px',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase'
  },
  tr: {
    borderBottom: '1px solid var(--color-border)',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: 'var(--color-text-main)',
    fontWeight: '500'
  },
  emptyState: {
    padding: '40px',
    textAlign: 'center',
    color: 'var(--color-text-muted)',
    fontSize: '14px',
    fontWeight: '500',
  }
};

export default Reports;

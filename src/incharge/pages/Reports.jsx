import React, { useState } from 'react';
import InchargeHeader from '../components/InchargeHeader';
import { useMockData } from '../../context/MockDataContext';
import { Filter, Download, FileText, Calendar, MapPin, Users, Droplet } from 'lucide-react';

const Reports = () => {
  const [reportGenerated, setReportGenerated] = useState(true);
  const [consolidationMode, setConsolidationMode] = useState('DATE');
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedArea, setSelectedArea] = useState('ALL');
  const [selectedFarmer, setSelectedFarmer] = useState('ALL');
  const [selectedTank, setSelectedTank] = useState('ALL');

  const { db, getTanksByFarmerId } = useMockData();

  const allAreas = Array.from(new Set((db.farmers || []).map(f => f.location.split(',')[0].trim()))).filter(Boolean);

  const mockInchargeFarmers = (db.farmers || [])
    .filter(f => selectedFarmer === 'ALL' || f.id === selectedFarmer)
    .filter(f => selectedArea === 'ALL' || f.location.toLowerCase().includes(selectedArea.toLowerCase()))
    .map(f => {
      const tanks = getTanksByFarmerId(f.id);
      return { 
        ...f, 
        tanks: tanks.length,
        area: f.location.split(',')[0].trim(),
        tankList: tanks
      };
    });

  const handleExportCSV = () => {
    let headers = ['Farmer Name', 'Area/Location', 'Total Ponds', 'Water Tests', 'Feed Tests', 'Medication', 'Compliance'];
    let rows = mockInchargeFarmers.map(f => [
      f.name, f.area, f.tanks, Math.floor(f.tanks * 3.5), Math.floor(f.tanks * 2), 1, '92%'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `incharge_consolidated_${consolidationMode.toLowerCase()}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <InchargeHeader title="Consolidated Reports" />
      <div className="content-inner">
        
        {/* Mode Selector Tabs */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '12px' }}>
            Consolidation Type:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            {[
              { id: 'DATE', label: '📅 Date-Wise' },
              { id: 'MONTH', label: '🗓️ Month-Wise' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setConsolidationMode(tab.id); setReportGenerated(true); }}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: consolidationMode === tab.id ? 'var(--color-primary)' : 'white',
                  color: consolidationMode === tab.id ? 'white' : 'var(--color-text-main)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Consolidated Filters */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Consolidated Filters</h3>
          <div className="grid md:grid-cols-4" style={{ gap: '16px' }}>
            {consolidationMode === 'MONTH' ? (
              <div className="input-group" style={{ margin: 0 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>Select Month (Month-wise)</label>
                <input type="month" className="input-field" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ width: '100%' }} />
              </div>
            ) : (
              <>
                <div className="input-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>Date From (Date-wise)</label>
                  <input type="date" className="input-field" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>Date To</label>
                  <input type="date" className="input-field" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ width: '100%' }} />
                </div>
              </>
            )}

            <div className="input-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>Area / Region (All Areas)</label>
              <select className="input-field" value={selectedArea} onChange={e => setSelectedArea(e.target.value)} style={{ width: '100%' }}>
                <option value="ALL">🌐 All Areas (Consolidated)</option>
                {allAreas.map(area => (
                  <option key={area} value={area}>📍 {area}</option>
                ))}
              </select>
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>Farmer (Farmer-wise)</label>
              <select className="input-field" value={selectedFarmer} onChange={e => setSelectedFarmer(e.target.value)} style={{ width: '100%' }}>
                <option value="ALL">👥 All Farmers (Consolidated)</option>
                {(db.farmers || []).map(f => (
                  <option key={f.id} value={f.id}>👨‍🌾 {f.name} ({f.location})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button className="btn-primary" onClick={() => setReportGenerated(true)} style={{ width: 'auto', padding: '10px 24px' }}>
              <Filter size={18} /> Apply Filters
            </button>
            <button className="btn-secondary" onClick={handleExportCSV} style={{ width: 'auto', padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Download size={18} /> Export CSV
            </button>
          </div>
        </div>

        {reportGenerated && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Consolidated Report Results ({consolidationMode} Mode)</h3>
              <button onClick={handleExportCSV} style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                padding: '8px 16px', backgroundColor: 'white', 
                border: '1px solid var(--color-border)', borderRadius: '8px',
                cursor: 'pointer', fontSize: '13px', fontWeight: 500
              }}>
                <Download size={16} /> Export Consolidated Report
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Farmer</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Area / Locality</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Ponds (Tanks)</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Water Tests</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Feed Tests</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInchargeFarmers.map((farmer) => (
                    <tr key={farmer.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '16px', fontWeight: 500 }}>👨‍🌾 {farmer.name} ({farmer.id})</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>📍 {farmer.area}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>🌊 {farmer.tanks} Ponds</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{Math.floor(farmer.tanks * 3.5)}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{Math.floor(farmer.tanks * 2)}</td>
                      <td style={{ padding: '16px', fontSize: '14px', color: 'var(--status-green)', fontWeight: 500 }}>
                        94%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Reports;

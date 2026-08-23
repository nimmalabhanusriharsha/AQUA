import React, { useState } from 'react';
import InchargeHeader from '../components/InchargeHeader';
import { Download } from 'lucide-react';

const ExportData = () => {
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = () => {
    // Mock export
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <>
      <InchargeHeader title="Export Data" />
      <div className="content-inner">
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Export Settings</h3>
          
          <div className="grid md:grid-cols-2" style={{ gap: '16px', marginBottom: '24px' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>Date From</label>
              <input type="date" className="input-field" style={{ width: '100%' }} />
            </div>
            <div className="input-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>Date To</label>
              <input type="date" className="input-field" style={{ width: '100%' }} />
            </div>
            <div className="input-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>Agent</label>
              <select className="input-field" style={{ width: '100%' }}>
                <option value="">All Agents</option>
              </select>
            </div>
            <div className="input-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>Locality</label>
              <select className="input-field" style={{ width: '100%' }}>
                <option value="">All Localities</option>
              </select>
            </div>
          </div>

          <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Include Data Fields</h4>
          <div className="grid md:grid-cols-2" style={{ gap: '12px', marginBottom: '32px' }}>
            {['Farmer Details', 'Tank Details', 'Water Analysis', 'Feed Tests', 'Medication', 'Disease', 'Harvest', 'Weekly Tests', 'Site Visits', 'Verification'].map((field) => (
              <label key={field} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
                {field}
              </label>
            ))}
          </div>

          <button className="btn-primary" onClick={handleExport}>
            <Download size={18} /> Generate Excel
          </button>

          {exportSuccess && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#dcfce7', color: 'var(--status-green)', borderRadius: '8px', textAlign: 'center', fontSize: '14px', fontWeight: 500 }}>
              Export successful. Excel file downloaded.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ExportData;

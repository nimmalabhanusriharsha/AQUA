import React, { useState } from 'react';
import InchargeHeader from '../components/InchargeHeader';
import { useMockData } from '../../context/MockDataContext';
import { Filter, FileText } from 'lucide-react';

const Reports = () => {
  const [reportGenerated, setReportGenerated] = useState(false);
  const { db, getTanksByFarmerId } = useMockData();
  const mockInchargeFarmers = db.farmers.map(f => {
    const tanks = getTanksByFarmerId(f.id).length;
    return { ...f, tanks };
  });

  const handleGenerate = () => {
    setReportGenerated(true);
  };

  return (
    <>
      <InchargeHeader title="Reports" />
      <div className="content-inner">
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Report Filters</h3>
          <div className="grid md:grid-cols-4" style={{ gap: '16px' }}>
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
                <option value="A001">Agent A</option>
                <option value="A002">Agent B</option>
                <option value="A003">Agent C</option>
              </select>
            </div>
            <div className="input-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>Locality</label>
              <select className="input-field" style={{ width: '100%' }}>
                <option value="">All Localities</option>
                <option value="Bhimavaram">Bhimavaram</option>
                <option value="Chinnamiram">Chinnamiram</option>
                <option value="Undi">Undi</option>
              </select>
            </div>
            <div className="input-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>Test Type</label>
              <select className="input-field" style={{ width: '100%' }}>
                <option value="">All Types</option>
                <option value="Water">Water Analysis</option>
                <option value="Feed">Feed Test</option>
                <option value="Medication">Medication</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button className="btn-primary" onClick={handleGenerate} style={{ width: 'auto', padding: '10px 24px' }}>
              <Filter size={18} /> Generate Report
            </button>
          </div>
        </div>

        {reportGenerated && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Report Results</h3>
              <button style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                padding: '8px 16px', backgroundColor: 'white', 
                border: '1px solid var(--color-border)', borderRadius: '8px',
                cursor: 'pointer', fontSize: '13px', fontWeight: 500
              }}>
                <FileText size={16} /> Print Report
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Farmer</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Tanks</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Water Tests</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Feed Tests</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Medication</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInchargeFarmers.map((farmer) => (
                    <tr key={farmer.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '16px', fontWeight: 500 }}>{farmer.name}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{farmer.tanks}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{Math.floor(farmer.tanks * 3.5)}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{Math.floor(farmer.tanks * 2)}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>1</td>
                      <td style={{ padding: '16px', fontSize: '14px', color: 'var(--status-green)', fontWeight: 500 }}>
                        {85 + Math.floor(Math.random() * 15)}%
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

import React, { useState } from 'react';
import AdminHeader from '../components/AdminHeader';
import { Download, Table, CheckSquare } from 'lucide-react';

const ExportCenter = () => {
  const [selectedFields, setSelectedFields] = useState({
    farmerDetails: true,
    tankDetails: true,
    waterQuality: true,
    feedRecords: true,
    medication: false,
    disease: false,
    harvest: false,
    weeklyTests: true,
    siteVisits: false,
    verifications: false
  });

  const toggleField = (key) => {
    setSelectedFields(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const fields = [
    { key: 'farmerDetails', label: 'Farmer Details' },
    { key: 'tankDetails', label: 'Tank Basic Details' },
    { key: 'waterQuality', label: 'Water Quality Records' },
    { key: 'feedRecords', label: 'Feed Consumption' },
    { key: 'medication', label: 'Medication Usage' },
    { key: 'disease', label: 'Disease Observations' },
    { key: 'harvest', label: 'Harvest Data' },
    { key: 'weeklyTests', label: 'Weekly Test Status' },
    { key: 'siteVisits', label: 'Agent Site Visits / GPS' },
    { key: 'verifications', label: 'Incharge Verifications' },
  ];

  return (
    <>
      <AdminHeader title="Export Center" breadcrumbs={[{ label: 'Reports' }, { label: 'Export Center', active: true }]} />
      <div className="content-inner">
        
        <div className="grid md:grid-cols-3" style={{ gap: '24px' }}>
          
          <div className="card md:col-span-1" style={{ alignSelf: 'flex-start' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FilterIcon /> Export Scope
            </h3>
            
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Date Range</label>
              <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#f8fafc', outline: 'none' }}>
                <option>This Month</option>
                <option>Last Month</option>
                <option>Year to Date</option>
                <option>Custom Range...</option>
              </select>
            </div>
            
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Region Filter</label>
              <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#f8fafc', outline: 'none' }}>
                <option>All Regions (Organization-wide)</option>
                <option>Bhimavaram</option>
                <option>Narsapur</option>
                <option>Undi</option>
              </select>
            </div>
          </div>

          <div className="card md:col-span-2">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Table size={18} /> Excel Columns Selection
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Select the data points you want to include in the exported Excel spreadsheet.
            </p>

            <div className="grid md:grid-cols-2" style={{ gap: '16px' }}>
              {fields.map(field => (
                <div 
                  key={field.key} 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', 
                    padding: '12px', border: '1px solid var(--color-border)', 
                    borderRadius: '8px', cursor: 'pointer',
                    backgroundColor: selectedFields[field.key] ? '#f0fdf4' : 'white',
                    borderColor: selectedFields[field.key] ? '#86efac' : 'var(--color-border)'
                  }}
                  onClick={() => toggleField(field.key)}
                >
                  <div style={{ 
                    width: '20px', height: '20px', borderRadius: '4px', 
                    border: `1px solid ${selectedFields[field.key] ? 'var(--status-green)' : 'var(--color-text-muted)'}`,
                    backgroundColor: selectedFields[field.key] ? 'var(--status-green)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {selectedFields[field.key] && <CheckSquare size={14} color="white" />}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: selectedFields[field.key] ? 600 : 500, color: 'var(--color-text-main)' }}>
                    {field.label}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                {Object.values(selectedFields).filter(Boolean).length} modules selected for export
              </div>
              <button className="btn-primary" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={18} /> Download Excel
              </button>
            </div>
          </div>

        </div>

      </div>
    </>
  );
};

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

export default ExportCenter;

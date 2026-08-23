import React from 'react';
import AdminHeader from '../components/AdminHeader';
import { FileText, Calendar, Map, Filter, Download } from 'lucide-react';

const Reports = () => {
  return (
    <>
      <AdminHeader title="Consolidated Reports" breadcrumbs={[{ label: 'Reports' }, { label: 'Generate Reports', active: true }]} />
      <div className="content-inner">
        
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '64px', height: '64px', backgroundColor: '#f1f5f9', borderRadius: '16px',
              display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px', color: 'var(--color-primary)'
            }}>
              <FileText size={32} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Report Generator</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Build custom reports across the entire organization</p>
          </div>

          <div className="grid md:grid-cols-2" style={{ gap: '20px', marginBottom: '24px' }}>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Report Type</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#f8fafc', outline: 'none' }}>
                <option>Performance Summary</option>
                <option>Compliance Report</option>
                <option>Verification Audit</option>
                <option>Yield & Harvest</option>
              </select>
            </div>
            
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Date Range</label>
              <div className="input-field" style={{ margin: 0, backgroundColor: '#f8fafc' }}>
                <Calendar size={16} color="var(--color-text-muted)" />
                <input type="text" placeholder="Select dates (e.g., Aug 1 - Aug 31)" style={{ background: 'transparent' }} />
              </div>
            </div>

            <div className="input-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Region</label>
              <div className="input-field" style={{ margin: 0, backgroundColor: '#f8fafc' }}>
                <Map size={16} color="var(--color-text-muted)" />
                <select style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }}>
                  <option>All Regions</option>
                  <option>Bhimavaram</option>
                  <option>Narsapur</option>
                  <option>Undi</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Incharge (Optional)</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#f8fafc', outline: 'none' }}>
                <option>All Incharges</option>
                <option>Ravi Kumar</option>
                <option>Suresh</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
            <button className="btn-secondary" style={{ padding: '12px 24px' }}>Reset Filters</button>
            <button className="btn-primary" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={18} /> Generate PDF
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default Reports;

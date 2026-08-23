import React, { useState } from 'react';
import AdminHeader from '../components/AdminHeader';
import { adminVerifications } from '../utils/adminMockData';
import { Search, Filter, Eye } from 'lucide-react';

const Verifications = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <AdminHeader title="Organization Verifications Monitoring" breadcrumbs={[{ label: 'Monitoring' }, { label: 'Verifications', active: true }]} />
      <div className="content-inner">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', flex: 1, maxWidth: '500px' }}>
              <div className="input-field" style={{ flex: 1, margin: 0, padding: '8px 12px' }}>
                <Search size={18} color="var(--color-text-muted)" />
                <input 
                  type="text" 
                  placeholder="Search by Farmer, Tank, or Agent..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                padding: '8px 16px', backgroundColor: 'white', 
                border: '1px solid var(--color-border)', borderRadius: '8px',
                cursor: 'pointer'
              }}>
                <Filter size={18} />
                Filters
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Region</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Incharge</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Agent</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Farmer & Tank</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Test Type</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Submitted Time</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminVerifications.map((v) => (
                  <tr key={v.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500 }}>{v.region}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{v.incharge}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{v.agent}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{v.farmer}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{v.tank}</div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{v.testType}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--color-text-muted)' }}>{v.submitted}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                        backgroundColor: v.status === 'Pending' ? '#fffbeb' : (v.status === 'Approved' ? '#ecfdf5' : '#fef2f2'),
                        color: v.status === 'Pending' ? 'var(--status-yellow)' : (v.status === 'Approved' ? 'var(--status-green)' : 'var(--status-red)')
                      }}>
                        {v.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Eye size={16} /> Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Verifications;

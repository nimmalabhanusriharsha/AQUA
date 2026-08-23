import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRegions } from '../utils/adminMockData';
import AdminHeader from '../components/AdminHeader';
import { Search, Filter, Eye } from 'lucide-react';

const Regions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const regions = getRegions();
  const navigate = useNavigate();

  const filteredRegions = regions.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <AdminHeader title="Regions Management" breadcrumbs={[{ label: 'Organization' }, { label: 'Regions', active: true }]} />
      <div className="content-inner">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', flex: 1, maxWidth: '500px' }}>
              <div className="input-field" style={{ flex: 1, margin: 0, padding: '8px 12px' }}>
                <Search size={18} color="var(--color-text-muted)" />
                <input 
                  type="text" 
                  placeholder="Search regions..." 
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
                Filter
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Region Name</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Incharges</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Agents</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Farmers</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Tanks</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Compliance</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegions.map((region) => (
                  <tr key={region.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--color-primary)' }}>{region.name}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{region.incharges}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{region.agents}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{region.farmers}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{region.tanks}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${region.compliance}%`, height: '100%', backgroundColor: region.compliance >= 90 ? 'var(--status-green)' : (region.compliance > 80 ? 'var(--status-yellow)' : 'var(--status-red)') }} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{region.compliance}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                        backgroundColor: region.status === 'Active' ? '#dcfce7' : '#f1f5f9',
                        color: region.status === 'Active' ? 'var(--status-green)' : 'var(--color-text-muted)'
                      }}>
                        {region.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }} onClick={() => navigate(`/admin/regions/${region.id}`)}>
                        <Eye size={16} /> View
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

export default Regions;

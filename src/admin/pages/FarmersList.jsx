import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFarmers } from '../utils/adminMockData';
import AdminHeader from '../components/AdminHeader';
import { Search, Filter, Eye } from 'lucide-react';

const FarmersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const farmers = getFarmers();
  const navigate = useNavigate();

  const filtered = farmers.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminHeader title="All Farmers" breadcrumbs={[{ label: 'Organization' }, { label: 'Farmers', active: true }]} />
      <div className="content-inner">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', flex: 1, maxWidth: '500px' }}>
              <div className="input-field" style={{ flex: 1, margin: 0, padding: '8px 12px' }}>
                <Search size={18} color="var(--color-text-muted)" />
                <input 
                  type="text" 
                  placeholder="Search by farmer, agent, or region..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn-secondary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={18} /> Filters
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Farmer Name</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Village</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Agent</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Incharge</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Region</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Acres</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Tanks</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-main)' }}>{item.name}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{item.village}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{item.agent}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{item.incharge}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{item.region}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{item.acres}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{item.tanks}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }} onClick={() => navigate(`/admin/farmers/${item.id}`)}>
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

export default FarmersList;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import { Search, Filter, Eye, Phone, Plus } from 'lucide-react';
import { useMockData } from '../../context/MockDataContext';

const FarmersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { db, getTanksByFarmerId, getAgentById, assignFarmerToAgent } = useMockData();

  const farmers = db.farmers.map(f => {
    const tanks = getTanksByFarmerId(f.id);
    const agent = getAgentById(f.agentId);
    return {
      ...f,
      village: f.location || 'Bhimavaram',
      agentName: agent ? agent.name : 'Unassigned',
      incharge: 'Admin User',
      region: agent ? (agent.locality || 'Bhimavaram') : 'Bhimavaram',
      tanksCount: tanks.length
    };
  });

  const filtered = farmers.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.phone.includes(searchTerm)
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
                  placeholder="Search by farmer, agent, or mobile..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn-secondary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={18} /> Filters
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0369a1', backgroundColor: '#e0f2fe', padding: '6px 12px', borderRadius: '12px' }}>
                📱 Mobile Linkage Enabled
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Farmer Name</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Mobile (Linked)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Locality</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Assigned Agent</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Acres</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Tanks</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-main)' }}>{item.name}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--color-primary)', fontWeight: '600' }}>📱 {item.phone}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{item.village}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      <select
                        value={item.agentId}
                        onChange={(e) => assignFarmerToAgent(item.id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          fontSize: '13px',
                          fontWeight: '600',
                          backgroundColor: '#f8fafc',
                          color: 'var(--color-primary)',
                          cursor: 'pointer'
                        }}
                      >
                        {db.agents.map(a => (
                          <option key={a.id} value={a.id}>{a.name} ({a.locality})</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{item.acres}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{item.tanksCount}</td>
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

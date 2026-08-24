import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAgentById, getFarmersByAgent } from '../utils/adminMockData';
import PageHeader from '../components/PageHeader';
import { Sprout, Database, CheckSquare, Eye } from 'lucide-react';

const AgentDetail = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  
  const agent = getAgentById(agentId);
  const farmers = getFarmersByAgent(agentId);

  if (!agent) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Agent not found</div>;
  }

  const kpis = [
    { title: 'Total Farmers', value: agent.farmers, icon: <Sprout size={20} />, color: '#f59e0b', bg: '#fffbeb' },
    { title: 'Total Tanks', value: agent.tanks, icon: <Database size={20} />, color: '#8b5cf6', bg: '#f5f3ff' },
    { title: 'Tests Submitted', value: agent.tests, icon: <CheckSquare size={20} />, color: '#ec4899', bg: '#fdf2f8' },
    { title: 'Weekly Compliance', value: `${agent.compliance}%`, icon: <CheckSquare size={20} />, color: '#10b981', bg: '#ecfdf5' },
  ];

  return (
    <>
      <PageHeader 
        title={`Agent: ${agent.name}`} 
        breadcrumbs={[
          { label: 'Organization' },
          { label: agent.region }, 
          { label: agent.incharge },
          { label: agent.name, active: true }
        ]} 
      />
      <div className="content-inner">
        
        {/* Agent KPIs */}
        <div className="grid md:grid-cols-4" style={{ gap: '16px', marginBottom: '24px' }}>
          {kpis.map((kpi, idx) => (
            <div key={idx} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: kpi.bg, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {kpi.icon}
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: '1.2' }}>{kpi.value}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>{kpi.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Farmers Table */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Farmers allocated to {agent.name}</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Farmer Name</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Phone Number</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Village/Locality</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Acres</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Tanks</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {farmers.map((farmer) => (
                  <tr key={farmer.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-main)' }}>{farmer.name}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--color-text-muted)' }}>{farmer.phone}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{farmer.village}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{farmer.acres}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{farmer.tanks}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }} onClick={() => navigate(`/admin/farmers/${farmer.id}`)}>
                        <Eye size={16} /> Drill-down
                      </button>
                    </td>
                  </tr>
                ))}
                {farmers.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No farmers found for this agent.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
};

export default AgentDetail;

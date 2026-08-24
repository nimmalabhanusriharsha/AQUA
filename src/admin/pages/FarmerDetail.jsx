import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFarmerById, getTanksByFarmer } from '../utils/adminMockData';
import PageHeader from '../components/PageHeader';
import { Database, Eye, Download } from 'lucide-react';

const FarmerDetail = () => {
  const { farmerId } = useParams();
  const navigate = useNavigate();
  
  const farmer = getFarmerById(farmerId);
  const tanks = getTanksByFarmer(farmerId);

  if (!farmer) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Farmer not found</div>;
  }

  const handleDownload = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    csvContent += "FARMER DETAILS\n";
    csvContent += "Name,Phone,Village,Acres,Agent,Incharge,Region,Status\n";
    csvContent += `${farmer.name},${farmer.phone},${farmer.village},${farmer.acres},${farmer.agent},${farmer.incharge},${farmer.region},${farmer.status}\n\n`;

    csvContent += "TANKS\n";
    csvContent += "Tank Name,Culture Cycle,ABW (g),Biomass (kg),FCR,Weekly Compliance (%)\n";
    
    tanks.forEach(tank => {
      csvContent += `${tank.name},${tank.currentCycle},${tank.abw},${tank.biomass},${tank.fcr},${tank.compliance}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${farmer.name.replace(/\s+/g, '_')}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <PageHeader 
        title={`Farmer: ${farmer.name}`} 
        breadcrumbs={[
          { label: 'Organization' },
          { label: farmer.agent }, 
          { label: farmer.name, active: true }
        ]} 
      />
      <div className="content-inner">
        
        {/* Farmer Info */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Farmer Details</h3>
            <button 
              className="btn-primary" 
              style={{ width: 'auto', padding: '8px 16px', fontSize: '14px', gap: '8px' }}
              onClick={handleDownload}
            >
              <Download size={16} /> Download Excel (CSV)
            </button>
          </div>
          <div className="grid md:grid-cols-4" style={{ gap: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Farmer Name</div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{farmer.name}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Phone Number</div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{farmer.phone}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Village / Locality</div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{farmer.village}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Total Acres</div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{farmer.acres}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Assigned Agent</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-primary)' }}>{farmer.agent}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Incharge Manager</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#38bdf8' }}>{farmer.incharge}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Region</div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{farmer.region}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Status</div>
              <span style={{ 
                padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                backgroundColor: farmer.status === 'Active' ? '#dcfce7' : '#f1f5f9',
                color: farmer.status === 'Active' ? 'var(--status-green)' : 'var(--color-text-muted)',
                display: 'inline-block'
              }}>
                {farmer.status}
              </span>
            </div>
          </div>
        </div>

        {/* Tanks Table */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Database size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Tanks ({tanks.length})</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Tank Name</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Culture Cycle</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>ABW</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Biomass</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>FCR</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Weekly Compliance</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tanks.map((tank) => (
                  <tr key={tank.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-main)' }}>{tank.name}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{tank.currentCycle}</td>
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#f59e0b' }}>{tank.abw}g</td>
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#38bdf8' }}>{tank.biomass}kg</td>
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#10b981' }}>{tank.fcr}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${tank.compliance}%`, height: '100%', backgroundColor: tank.compliance >= 90 ? 'var(--status-green)' : 'var(--status-yellow)' }} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{tank.compliance}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }} onClick={() => navigate(`/admin/tanks/${tank.id}`)}>
                        <Eye size={16} /> History
                      </button>
                    </td>
                  </tr>
                ))}
                {tanks.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No tanks found for this farmer.</td>
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

export default FarmerDetail;

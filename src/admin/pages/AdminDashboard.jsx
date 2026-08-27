import React from 'react';
import { 
  getRegions, getIncharges, getAgents, getFarmers, getTanks, 
  adminWeeklyCompliance, getActivities, adminTrendData 
} from '../utils/adminMockData';
import AdminHeader from '../components/AdminHeader';
import { Map, Users, HardHat, Sprout, Database, FileCheck2, ArrowRight } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const regions = getRegions();
  const incharges = getIncharges();
  const agents = getAgents();
  const farmers = getFarmers();
  const tanks = getTanks();
  const activities = getActivities();
  
  // KPI Data
  const kpis = [
    { title: 'Total Regions', value: regions.length, subtext: 'Active Regions', icon: <Map size={24} />, color: '#818cf8', bg: '#eef2ff' },
    { title: 'Total Incharges', value: incharges.length, subtext: 'Active Incharges', icon: <Users size={24} />, color: '#38bdf8', bg: '#f0f9ff' },
    { title: 'Total Agents', value: agents.length, subtext: 'Active Agents', icon: <HardHat size={24} />, color: '#10b981', bg: '#ecfdf5' },
    { title: 'Total Farmers', value: farmers.length.toLocaleString(), subtext: 'Allocated Farmers', icon: <Sprout size={24} />, color: '#f59e0b', bg: '#fffbeb' },
    { title: 'Total Tanks', value: tanks.length.toLocaleString(), subtext: 'Active Tanks', icon: <Database size={24} />, color: '#8b5cf6', bg: '#f5f3ff' },
    { title: 'Tests This Month', value: '36,420', subtext: 'Submitted', icon: <FileCheck2 size={24} />, color: '#ec4899', bg: '#fdf2f8' }
  ];

  const pieData = [
    { name: 'Completed', value: adminWeeklyCompliance.completed, color: '#10b981' },
    { name: 'Due', value: adminWeeklyCompliance.due, color: '#f59e0b' },
    { name: 'Overdue', value: adminWeeklyCompliance.overdue, color: '#ef4444' },
    { name: 'Not Due', value: adminWeeklyCompliance.notDue, color: '#94a3b8' }
  ];

  return (
    <>
      <AdminHeader title="Organization Dashboard" breadcrumbs={[{ label: 'Dashboard', active: true }]} />
      <div className="content-inner">
        
        {/* KPIs */}
        <div className="grid md:grid-cols-3" style={{ gap: '20px', marginBottom: '24px' }}>
          {kpis.map((kpi, idx) => (
            <div key={idx} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: kpi.bg, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {kpi.icon}
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: '1.2' }}>{kpi.value}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)' }}>{kpi.title}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{kpi.subtext}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2" style={{ gap: '24px', marginBottom: '24px' }}>
          
          {/* Weekly Test Compliance */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Organization-wide Weekly Compliance</h3>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '12px' }}>
                📊 Bar Graph View
              </span>
            </div>
            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pieData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={5} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} unit="%" />
                  <RechartsTooltip formatter={(val) => [`${val}%`, 'Compliance']} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Test Trends */}
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Tests Trend (Last 7 Days)</h3>
            <div style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adminTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dx={-10} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="tests" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Regional Performance Table */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Regional Performance</h3>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => navigate('/admin/regions')}>View All Regions</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Region</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Incharges</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Agents</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Farmers</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Tanks</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Compliance</th>
                </tr>
              </thead>
              <tbody>
                {regions.map((region) => (
                  <tr key={region.id} style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }} onClick={() => navigate(`/admin/regions/${region.id}`)}>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Organization Recent Activity</h3>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => navigate('/admin/activity-log')}>View Full Log</button>
          </div>
          <div>
            {activities.slice(0, 4).map(act => (
              <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {act.role === 'Admin' ? <Shield size={18} color="#818cf8" /> : (act.role === 'Incharge' ? <Users size={18} color="#38bdf8" /> : <HardHat size={18} color="#10b981" />)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '4px' }}>{act.action}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{act.detail} &bull; {act.region}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
                  {act.time}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

// Needed Shield icon that wasn't imported at the top
import { Shield } from 'lucide-react';

export default AdminDashboard;

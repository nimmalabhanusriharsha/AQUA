import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserSquare, Droplets, TestTube, CheckCircle, AlertTriangle, 
  ArrowUpRight, ArrowDownRight, ChevronRight
} from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import InchargeHeader from '../components/InchargeHeader';
import { 
  initialInchargeKPIs, 
  getVerifications, 
  getActivities 
} from '../utils/mockData';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#94a3b8']; // Green, Yellow, Red, Grey

const mockTrendData = [
  { name: '16 Aug', tests: 350 },
  { name: '17 Aug', tests: 620 },
  { name: '18 Aug', tests: 650 },
  { name: '19 Aug', tests: 520 },
  { name: '20 Aug', tests: 780 },
  { name: '21 Aug', tests: 620 },
  { name: '22 Aug', tests: 770 },
];

const mockComplianceData = [
  { name: 'Completed', value: 1025 },
  { name: 'Due', value: 185 },
  { name: 'Overdue', value: 67 },
  { name: 'Not Due', value: 147 },
];

const KPICard = ({ title, value, subtext, subtextPrefix, isPositive, icon: Icon, color }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{title}</p>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</h3>
      </div>
      <div style={{ 
        width: '40px', height: '40px', borderRadius: '8px', 
        backgroundColor: `${color}15`, color: color,
        display: 'flex', justifyContent: 'center', alignItems: 'center' 
      }}>
        <Icon size={20} />
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
      <span style={{ 
        display: 'flex', alignItems: 'center', 
        color: isPositive ? 'var(--status-green)' : 'var(--status-red)',
        fontWeight: 500
      }}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {subtextPrefix}
      </span>
      <span style={{ color: 'var(--color-text-muted)' }}>{subtext}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [verifications, setVerifications] = useState([]);
  const [activities, setActivities] = useState([]);
  
  useEffect(() => {
    setVerifications(getVerifications().filter(v => v.status === 'Pending').slice(0, 4));
    setActivities(getActivities().slice(0, 5));
  }, []);

  return (
    <>
      <InchargeHeader title="Dashboard" />
      <div className="content-inner">
        {/* KPI Grid */}
        <div className="grid lg:grid-cols-3" style={{ marginBottom: '24px' }}>
          <KPICard 
            title="Total Agents" value={initialInchargeKPIs.totalAgents} 
            subtextPrefix={`${initialInchargeKPIs.newAgentsMonth} `} subtext="this month"
            isPositive={true} icon={Users} color="#3b82f6"
          />
          <KPICard 
            title="Total Farmers" value={initialInchargeKPIs.totalFarmers} 
            subtextPrefix={`${initialInchargeKPIs.newFarmersMonth} `} subtext="this month"
            isPositive={true} icon={UserSquare} color="#10b981"
          />
          <KPICard 
            title="Total Tanks" value={initialInchargeKPIs.totalTanks.toLocaleString()} 
            subtextPrefix={`${initialInchargeKPIs.newTanksMonth} `} subtext="this month"
            isPositive={true} icon={Droplets} color="#0ea5e9"
          />
          <KPICard 
            title="Tests This Month" value={initialInchargeKPIs.testsMonth.toLocaleString()} 
            subtextPrefix={`${initialInchargeKPIs.newTestsMonth} `} subtext="this month"
            isPositive={true} icon={TestTube} color="#8b5cf6"
          />
          <KPICard 
            title="Pending Verification" value={initialInchargeKPIs.pendingVerification} 
            subtextPrefix={`${Math.abs(initialInchargeKPIs.pendingVerificationChange)} `} subtext="from yesterday"
            isPositive={initialInchargeKPIs.pendingVerificationChange <= 0} icon={CheckCircle} color="#f59e0b"
          />
          <KPICard 
            title="Overdue Tests" value={initialInchargeKPIs.overdueTests} 
            subtextPrefix={`${Math.abs(initialInchargeKPIs.overdueTestsChange)} `} subtext="from yesterday"
            isPositive={initialInchargeKPIs.overdueTestsChange <= 0} icon={AlertTriangle} color="#ef4444"
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2" style={{ gap: '24px', marginBottom: '24px' }}>
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Weekly Test Compliance</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockComplianceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {mockComplianceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Tests Trend (Last 7 Days)</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}/>
                  <Line type="monotone" dataKey="tests" stroke="var(--color-primary)" strokeWidth={3} dot={{r: 4, fill: 'var(--color-primary)', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Lists Section */}
        <div className="grid lg:grid-cols-2" style={{ gap: '24px' }}>
          {/* Pending Verifications */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Pending Verifications</h3>
              <span className="link" onClick={() => navigate('/incharge/verifications')}>View All</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {verifications.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{item.farmer} - {item.tank}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '4px 0' }}>{item.testType} • {item.date} • {item.agent}</p>
                    <span style={{ fontSize: '11px', color: 'var(--status-yellow)', backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: '12px', fontWeight: 500 }}>
                      {item.submitted}
                    </span>
                  </div>
                  <button 
                    onClick={() => navigate('/incharge/verifications')}
                    style={{ 
                      padding: '6px 12px', backgroundColor: 'var(--color-bg-main)', 
                      border: '1px solid var(--color-border)', borderRadius: '6px',
                      fontSize: '13px', fontWeight: 500, cursor: 'pointer'
                    }}
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Recent Activity</h3>
              <span className="link" onClick={() => navigate('/incharge/activity-log')}>View All</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activities.map((act, idx) => (
                <div key={act.id} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', marginTop: '6px' }} />
                    {idx !== activities.length - 1 && (
                      <div style={{ width: '2px', flex: 1, backgroundColor: 'var(--color-border)', margin: '4px 0' }} />
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{act.action}</p>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{act.detail}</p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

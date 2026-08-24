import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tractor, Box, TrendingUp, Activity, ShieldCheck, 
  AlertCircle, FileSpreadsheet, ArrowUpRight 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip 
} from 'recharts';
import { useMockData } from '../../context/MockDataContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const mockData = useMockData();
  const db = mockData?.db;

  // Real or fallback statistics aligned with the dashboard design
  const totalFarmers = db?.farmers?.length || 8;
  const activeTanks = db?.tanks?.length || 10;
  const pendingVerifications = db?.submissions?.filter(s => s.status === 'PENDING_VERIFICATION')?.length || 1;
  const overdueTests = db?.tanks?.filter(t => t.testStatus === 'Overdue')?.length || 3;

  // 1. Donut chart distribution data
  const tankStatusData = [
    { name: 'Active', value: 65, color: '#10b981' },
    { name: 'Harvested', value: 10, color: '#6366f1' },
    { name: 'Maintenance', value: 25, color: '#d97706' }
  ];

  // 2. FCR & ABW Trend Data (DOC 10 to 70)
  const fcrTrendData = [
    { doc: 10, fcr: 0.92, abw: 3.2 },
    { doc: 20, fcr: 1.03, abw: 6.8 },
    { doc: 30, fcr: 1.16, abw: 11.4 },
    { doc: 40, fcr: 1.33, abw: 16.2 },
    { doc: 50, fcr: 1.55, abw: 20.8 },
    { doc: 60, fcr: 1.90, abw: 24.5 },
    { doc: 70, fcr: 2.18, abw: 28.1 }
  ];

  // 3. Feed Intake vs Biomass Growth (kg)
  const feedVsBiomassData = [
    { doc: 10, feed: 180, biomass: 220 },
    { doc: 20, feed: 350, biomass: 380 },
    { doc: 30, feed: 850, biomass: 750 },
    { doc: 40, feed: 1600, biomass: 1200 },
    { doc: 50, feed: 2700, biomass: 1650 },
    { doc: 60, feed: 4100, biomass: 2150 },
    { doc: 70, feed: 6000, biomass: 2750 }
  ];

  return (
    <div style={styles.dashboardContainer}>
      {/* 1. Hero / Control Center Banner */}
      <div style={styles.heroBanner}>
        <div style={styles.heroLeft}>
          <div style={styles.heroBadge}>
            ORGANIZATION-WIDE CONTROL CENTER
          </div>
          <h1 style={styles.heroTitle}>
            Royal's Marine Operational Dashboard
          </h1>
          <p style={styles.heroSubtitle}>
            Real-time feed performance, FCR analytics, crop health, and multi-region operations.
          </p>
        </div>
        <button 
          style={styles.exportBtn}
          onClick={() => navigate('/admin/export-center')}
        >
          <FileSpreadsheet size={18} />
          <span>Excel Export Center</span>
        </button>
      </div>

      {/* 2. KPI Stat Cards Row (6 Cards) */}
      <div style={styles.kpiGrid}>
        {/* Card 1: Total Farmers */}
        <div style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiLabel}>TOTAL FARMERS</span>
            <div style={{ ...styles.kpiIconWrapper, backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Tractor size={18} />
            </div>
          </div>
          <div style={styles.kpiValue}>{totalFarmers}</div>
          <div 
            style={styles.kpiLink} 
            onClick={() => navigate('/admin/farmers')}
          >
            <span>View All Farmers</span>
            <ArrowUpRight size={14} />
          </div>
        </div>

        {/* Card 2: Active Tanks */}
        <div style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiLabel}>ACTIVE TANKS</span>
            <div style={{ ...styles.kpiIconWrapper, backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Box size={18} />
            </div>
          </div>
          <div style={styles.kpiValue}>{activeTanks}</div>
          <div 
            style={styles.kpiLink} 
            onClick={() => navigate('/admin/tanks')}
          >
            <span>View All Tanks</span>
            <ArrowUpRight size={14} />
          </div>
        </div>

        {/* Card 3: Average FCR */}
        <div style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiLabel}>AVERAGE FCR</span>
            <div style={{ ...styles.kpiIconWrapper, color: '#64748b' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={styles.kpiValue}>1.44</div>
          <div style={styles.kpiSubtext}>Ideal Target &lt; 1.4</div>
        </div>

        {/* Card 4: Average ABW */}
        <div style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiLabel}>AVERAGE ABW</span>
            <div style={{ ...styles.kpiIconWrapper, color: '#64748b' }}>
              <Activity size={18} />
            </div>
          </div>
          <div style={styles.kpiValue}>12.39g</div>
          <div style={styles.kpiSubtext}>Mean Body Weight</div>
        </div>

        {/* Card 5: Pending Verification */}
        <div style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiLabel}>PENDING VERIFICATION</span>
            <div style={{ ...styles.kpiIconWrapper, backgroundColor: '#fef3c7', color: '#d97706' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div style={styles.kpiValue}>{pendingVerifications}</div>
          <div 
            style={{ ...styles.kpiSubtext, color: '#b45309', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => navigate('/admin/verifications')}
          >
            Needs Review
          </div>
        </div>

        {/* Card 6: Overdue Tests */}
        <div style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiLabel}>OVERDUE TESTS</span>
            <div style={{ ...styles.kpiIconWrapper, backgroundColor: '#fee2e2', color: '#ef4444' }}>
              <AlertCircle size={18} />
            </div>
          </div>
          <div style={{ ...styles.kpiValue, color: '#dc2626' }}>{overdueTests}</div>
          <div 
            style={{ ...styles.kpiSubtext, color: '#dc2626', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => navigate('/admin/weekly-tests')}
          >
            Requires Action
          </div>
        </div>
      </div>

      {/* 3. Mid Row: Tank Status (Donut) & Operational Recommendations */}
      <div style={styles.midGrid}>
        {/* Left: Tank Status Donut Chart */}
        <div style={styles.tankStatusCard}>
          <div>
            <h2 style={styles.cardTitle}>Tank Status</h2>
            <p style={styles.cardSubtitle}>Distribution by status</p>
          </div>
          
          <div style={styles.donutContainer}>
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie
                  data={tankStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {tankStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(val, name) => [`${val}%`, name]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend under Donut matching screenshot */}
          <div style={styles.donutLegendRow}>
            <div style={styles.legendItem}>
              <span style={{ ...styles.legendDot, backgroundColor: '#10b981' }} />
              <span style={styles.legendLabel}>Active</span>
            </div>
            <div style={styles.legendItem}>
              <span style={{ ...styles.legendDot, backgroundColor: '#6366f1' }} />
              <span style={styles.legendLabel}>Harvested</span>
            </div>
            <div style={styles.legendItem}>
              <span style={{ ...styles.legendDot, backgroundColor: '#d97706' }} />
              <span style={styles.legendLabel}>Maintenance</span>
            </div>
          </div>
        </div>

        {/* Right: Data-Driven Operational Recommendations */}
        <div style={styles.recommendationsCard}>
          <div style={styles.recHeaderRow}>
            <div style={styles.recTitleGroup}>
              <AlertCircle size={18} color="#f59e0b" />
              <span style={styles.recTitle}>DATA-DRIVEN OPERATIONAL RECOMMENDATIONS</span>
            </div>
            <div style={styles.recEngineTag}>
              Automated MySQL Threshold Engine
            </div>
          </div>

          <div style={styles.recCardsGrid}>
            {/* Rec 1: Feed Efficiency Notice */}
            <div style={styles.recCardYellow}>
              <div style={styles.recCardHeader}>
                <span style={styles.recCardTitle}>Feed Efficiency Notice</span>
                <span style={styles.badgeMedium}>MEDIUM</span>
              </div>
              <p style={styles.recCardBody}>
                FCR in Kavali Delta has increased to 1.58. Review daily feed tray checks and feed quality.
              </p>
            </div>

            {/* Rec 2: Overdue Weekly Tests Alert */}
            <div style={styles.recCardRed}>
              <div style={styles.recCardHeader}>
                <span style={styles.recCardTitle}>Overdue Weekly Tests Alert</span>
                <span style={styles.badgeHigh}>HIGH</span>
              </div>
              <p style={styles.recCardBody}>
                3 Weekly lab screenings are overdue in Kavali Delta &amp; Bhimavaram. Reassign agent or trigger immediate field visit.
              </p>
            </div>

            {/* Rec 3: Optimal Harvest Growth */}
            <div style={styles.recCardGreen}>
              <div style={styles.recCardHeader}>
                <span style={styles.recCardTitle}>Optimal Harvest Growth</span>
                <span style={styles.badgeStrong}>STRONG</span>
              </div>
              <p style={styles.recCardBody}>
                Nellore Coastal Belt tanks achieved an average ABW of 26.5g at DOC 70 with an optimal FCR of 1.35.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: 2 Analytics Charts (FCR & ABW Trend + Feed Intake vs Biomass Growth) */}
      <div style={styles.chartsGrid}>
        {/* Chart 1: Feed Conversion Ratio (FCR) & ABW Trend */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeaderRow}>
            <div>
              <h2 style={styles.cardTitle}>Feed Conversion Ratio (FCR) &amp; ABW Trend</h2>
              <p style={styles.cardSubtitle}>Correlation across Day of Culture (DOC)</p>
            </div>
            <div style={styles.targetFcrBadge}>
              Target FCR: 1.35
            </div>
          </div>

          <div style={{ height: '240px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fcrTrendData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="doc" 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: '#334155', fontWeight: 500 }} 
                />
                <YAxis 
                  domain={[0.8, 2.2]} 
                  ticks={[0.8, 1.15, 1.5, 1.85, 2.2]}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: '#334155', fontWeight: 500 }}
                />
                <RechartsTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div style={styles.customTooltip}>
                          <div style={styles.tooltipDoc}>{label}</div>
                          <div style={styles.tooltipFcr}>FCR : {payload[0].value}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="fcr" 
                  stroke="#0284c7" 
                  strokeWidth={3} 
                  dot={{ r: 4.5, fill: '#ffffff', stroke: '#0284c7', strokeWidth: 2.5 }}
                  activeDot={{ r: 6, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Feed Intake vs Biomass Growth (kg) */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeaderRow}>
            <div>
              <h2 style={styles.cardTitle}>Feed Intake vs Biomass Growth (kg)</h2>
              <p style={styles.cardSubtitle}>Cumulative feed distribution</p>
            </div>
            <div style={styles.liveDataBadge}>
              Live MySQL Data
            </div>
          </div>

          <div style={{ height: '240px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feedVsBiomassData} margin={{ top: 15, right: 20, left: 5, bottom: 5 }} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="doc" 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: '#334155', fontWeight: 500 }} 
                />
                <YAxis 
                  domain={[0, 6000]} 
                  ticks={[0, 1500, 3000, 4500, 6000]}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: '#334155', fontWeight: 500 }}
                />
                <RechartsTooltip 
                  formatter={(val, name) => [`${val} kg`, name === 'feed' ? 'Feed Intake' : 'Biomass Growth']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="feed" fill="#0284c7" radius={[3, 3, 0, 0]} barSize={16} />
                <Bar dataKey="biomass" fill="#059669" radius={[3, 3, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '1380px',
    margin: '0 auto'
  },
  heroBanner: {
    backgroundColor: '#122753',
    borderRadius: '16px',
    padding: '28px 36px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 8px 24px rgba(18, 39, 83, 0.22)',
    color: '#ffffff'
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '75%'
  },
  heroBadge: {
    backgroundColor: '#f59e0b',
    color: '#0f172a',
    fontSize: '11px',
    fontWeight: 800,
    letterSpacing: '0.8px',
    padding: '4px 14px',
    borderRadius: '9999px',
    display: 'inline-block',
    alignSelf: 'flex-start',
    marginBottom: '12px',
    textTransform: 'uppercase'
  },
  heroTitle: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#ffffff',
    margin: '0 0 6px 0',
    letterSpacing: '-0.3px',
    lineHeight: '1.2'
  },
  heroSubtitle: {
    fontSize: '14px',
    color: '#cbd5e1',
    margin: 0,
    fontWeight: 400,
    lineHeight: '1.4'
  },
  exportBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
    transition: 'all 0.15s ease-in-out',
    flexShrink: 0
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '14px'
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    padding: '16px 16px 14px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  kpiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  kpiLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.4px',
    textTransform: 'uppercase'
  },
  kpiIconWrapper: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  kpiValue: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#0f172a',
    lineHeight: '1.2',
    marginBottom: '8px'
  },
  kpiLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#2563eb',
    fontSize: '11.5px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 'auto'
  },
  kpiSubtext: {
    fontSize: '11.5px',
    color: '#64748b',
    fontWeight: 500,
    marginTop: 'auto'
  },
  midGrid: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '16px'
  },
  tankStatusCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    padding: '20px 20px 16px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  cardTitle: {
    fontSize: '16.5px',
    fontWeight: 800,
    color: '#0f172a',
    margin: 0
  },
  cardSubtitle: {
    fontSize: '12.5px',
    color: '#64748b',
    margin: '4px 0 6px 0'
  },
  donutContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto 0'
  },
  donutLegendRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '18px',
    paddingTop: '10px',
    borderTop: '1px solid #f1f5f9',
    marginTop: '6px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '2px'
  },
  legendLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#334155'
  },
  recommendationsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  recHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
    flexWrap: 'wrap',
    gap: '8px'
  },
  recTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  recTitle: {
    fontSize: '13.5px',
    fontWeight: 800,
    color: '#0f172a',
    letterSpacing: '0.4px'
  },
  recEngineTag: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#64748b'
  },
  recCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '14px',
    flex: 1
  },
  recCardYellow: {
    backgroundColor: '#fefce8',
    border: '1px solid #fef08a',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  recCardRed: {
    backgroundColor: '#fff1f2',
    border: '1px solid #fecdd3',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  recCardGreen: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  recCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
    marginBottom: '8px'
  },
  recCardTitle: {
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#1e293b',
    lineHeight: '1.3'
  },
  recCardBody: {
    fontSize: '12.5px',
    color: '#475569',
    lineHeight: '1.45',
    margin: 0
  },
  badgeMedium: {
    backgroundColor: '#fef08a',
    color: '#854d0e',
    fontSize: '10px',
    fontWeight: 800,
    padding: '2px 7px',
    borderRadius: '6px',
    letterSpacing: '0.4px',
    flexShrink: 0
  },
  badgeHigh: {
    backgroundColor: '#fecdd3',
    color: '#9f1239',
    fontSize: '10px',
    fontWeight: 800,
    padding: '2px 7px',
    borderRadius: '6px',
    letterSpacing: '0.4px',
    flexShrink: 0
  },
  badgeStrong: {
    backgroundColor: '#bbf7d0',
    color: '#166534',
    fontSize: '10px',
    fontWeight: 800,
    padding: '2px 7px',
    borderRadius: '6px',
    letterSpacing: '0.4px',
    flexShrink: 0
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  chartHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px'
  },
  targetFcrBadge: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    fontSize: '12px',
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: '8px',
    border: '1px solid #bbf7d0'
  },
  liveDataBadge: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    fontSize: '12px',
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: '8px',
    border: '1px solid #bfdbfe'
  },
  customTooltip: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    padding: '8px 14px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  tooltipDoc: {
    fontWeight: 800,
    fontSize: '14px',
    color: '#0f172a',
    marginBottom: '2px'
  },
  tooltipFcr: {
    color: '#0284c7',
    fontWeight: 700,
    fontSize: '13px'
  }
};

export default AdminDashboard;

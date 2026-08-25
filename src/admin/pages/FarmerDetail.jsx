import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFarmerById, getFarmers, getTanksByFarmer } from '../utils/adminMockData';
import PageHeader from '../components/PageHeader';
import { 
  Database, Eye, Download, TrendingUp, Activity, 
  Layers, ArrowLeft, Calendar, ShieldCheck, Scale, 
  CheckCircle2, Droplets, Edit, X, AlertTriangle, 
  Check, Sparkles, Sprout, Fish, UserCheck, Shield, 
  Settings, Save, Plus 
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts';

const FarmerDetail = () => {
  const { farmerId } = useParams();
  const navigate = useNavigate();
  
  // Load farmer from localStorage or fallback mock data
  const [farmer, setFarmer] = useState(() => {
    const savedFarmers = localStorage.getItem('royal_admin_farmers_data');
    if (savedFarmers) {
      try {
        const parsed = JSON.parse(savedFarmers);
        const found = parsed.find(f => f.id === farmerId);
        if (found) return found;
      } catch (e) {}
    }
    return getFarmerById(farmerId) || getFarmers()[0];
  });

  // Load and construct tanks with individual specifications
  const [tanksList, setTanksList] = useState(() => {
    const rawTanks = farmer?.tankBreakdown || getTanksByFarmer(farmer?.id) || [];
    const sourceTanks = rawTanks.length > 0 ? rawTanks : [
      { 
        id: `T-${farmer?.id || '349'}-1`, 
        name: 'Tank 1', 
        acres: farmer?.totalAcres || parseFloat(farmer?.acres) || 4.5,
        doc: 65,
        abw: 24.5, 
        biomass: 3800, 
        fcr: 1.30
      }
    ];

    return sourceTanks.map((t, idx) => ({
      id: t.id || `T-${farmer?.id || '349'}-${idx + 1}`,
      name: t.name || `Tank ${idx + 1}`,
      acres: parseFloat(t.acres) || 4.0,
      doc: t.doc || (50 + idx * 5),
      abw: t.abw || (20.0 + idx * 3.5),
      biomass: t.biomass || Math.round((parseFloat(t.acres) || 4.0) * 850),
      fcr: t.fcr || (1.28 + idx * 0.04),
      currentCycle: t.currentCycle || `Cycle 1 (2026)`,
      compliance: t.compliance || 100,
      waterSource: t.waterSource || farmer?.waterSource || (idx % 2 === 0 ? 'Creek / Estuary' : 'Sea / Coastal Canal'),
      salinity: t.salinity || (14 + (idx * 2)), // ppt
      soilType: t.soilType || (idx % 3 === 0 ? 'Clay Loam' : idx % 3 === 1 ? 'Loam' : 'Clay'), // Loam, Clay, Sandy, Clay Loam
      hatcheryName: t.hatcheryName || (idx % 2 === 0 ? 'Apex Marine Hatcheries (Nellore)' : 'BMR Marine SPF Hatchery'),
      brooder: t.brooder || (idx % 2 === 0 ? 'Kona Bay (USA)' : 'Syaqua (Thailand)'), // Syaqua, Kona Bay, SIS, Other
      seedDate: t.seedDate || `2026-05-${10 + idx * 5}`,
      seedStockingLak: t.seedStockingLak || parseFloat(((parseFloat(t.acres) || 4.0) * 0.8).toFixed(1)), // Lakhs
      feedType: t.feedType || (idx % 2 === 0 ? 'Premium Pellets (Royal Pro)' : 'Functional Feed (Aqua Boost)') // Premium, Functional, Hypro, Tiger Feed, Other
    }));
  });

  const [activeTankIndex, setActiveTankIndex] = useState(0);
  const [growthMetric, setGrowthMetric] = useState('ABW'); // 'ABW', 'BIOMASS', 'FCR', 'FEED'
  const [toastMessage, setToastMessage] = useState('');
  const [showEditTankModal, setShowEditTankModal] = useState(false);

  const activeTank = tanksList[activeTankIndex] || tanksList[0];

  // Edit Tank Form State
  const [editTankForm, setEditTankForm] = useState({
    name: '',
    acres: 4.5,
    waterSource: 'Creek / Estuary',
    salinity: 15,
    soilType: 'Loam',
    hatcheryName: '',
    brooder: 'Kona Bay',
    seedDate: '2026-05-15',
    seedStockingLak: 3.5,
    feedType: 'Premium Pellets',
    currentCycle: 'Cycle 1 (2026)',
    abw: 24.5,
    fcr: 1.30
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Open Edit Modal for active tank
  const openEditTankModal = () => {
    setEditTankForm({
      name: activeTank.name || `Tank ${activeTankIndex + 1}`,
      acres: activeTank.acres || 4.5,
      waterSource: activeTank.waterSource || 'Creek / Estuary',
      salinity: activeTank.salinity || 15,
      soilType: activeTank.soilType || 'Loam',
      hatcheryName: activeTank.hatcheryName || 'Apex Marine Hatcheries',
      brooder: activeTank.brooder || 'Kona Bay',
      seedDate: activeTank.seedDate || '2026-05-15',
      seedStockingLak: activeTank.seedStockingLak || 3.5,
      feedType: activeTank.feedType || 'Premium Pellets',
      currentCycle: activeTank.currentCycle || 'Cycle 1 (2026)',
      abw: activeTank.abw || 24.5,
      fcr: activeTank.fcr || 1.30
    });
    setShowEditTankModal(true);
  };

  // Save Tank Edit Changes
  const handleSaveTankDetails = (e) => {
    e.preventDefault();

    const updatedAcres = parseFloat(editTankForm.acres) || activeTank.acres;
    const updatedABW = parseFloat(editTankForm.abw) || activeTank.abw;
    const updatedBiomass = Math.round(updatedABW * updatedAcres * 115);

    const updatedTank = {
      ...activeTank,
      name: editTankForm.name.trim(),
      acres: updatedAcres,
      waterSource: editTankForm.waterSource,
      salinity: parseFloat(editTankForm.salinity) || 15,
      soilType: editTankForm.soilType,
      hatcheryName: editTankForm.hatcheryName.trim(),
      brooder: editTankForm.brooder,
      seedDate: editTankForm.seedDate,
      seedStockingLak: parseFloat(editTankForm.seedStockingLak) || 3.5,
      feedType: editTankForm.feedType,
      currentCycle: editTankForm.currentCycle.trim(),
      abw: updatedABW,
      biomass: updatedBiomass,
      fcr: parseFloat(editTankForm.fcr) || 1.30
    };

    const updatedTanksList = tanksList.map((t, idx) => idx === activeTankIndex ? updatedTank : t);
    setTanksList(updatedTanksList);

    // Calculate new total acres for farmer
    const newTotalAcres = updatedTanksList.reduce((acc, t) => acc + (t.acres || 0), 0);
    const updatedFarmer = {
      ...farmer,
      totalAcres: newTotalAcres,
      acres: `${newTotalAcres.toFixed(1)} Acres`,
      waterSource: updatedTank.waterSource,
      tankBreakdown: updatedTanksList
    };

    setFarmer(updatedFarmer);

    // Update in localStorage
    const savedFarmers = localStorage.getItem('royal_admin_farmers_data');
    if (savedFarmers) {
      try {
        const parsed = JSON.parse(savedFarmers);
        const updatedAll = parsed.map(f => f.id === farmer.id ? updatedFarmer : f);
        localStorage.setItem('royal_admin_farmers_data', JSON.stringify(updatedAll));
      } catch (err) {}
    }

    showToast(`Details for ${updatedTank.name} updated and saved successfully!`);
    setShowEditTankModal(false);
  };

  // Generate dynamic Water Quality logs specific to the active tank
  const baseSal = activeTank.salinity || 16;
  const waterQualityLogs = [
    {
      id: 1,
      doc: activeTank.doc || 65,
      date: '2026-08-20',
      collectedBy: farmer?.agent || 'V. Kumar (Field Agent)',
      verificationStatus: 'VERIFIED ON-SITE',
      salinity: baseSal,
      ph: 7.9,
      alkalinity: 145,
      hardness: baseSal * 300,
      ammonia: 0.05,
      nitrite: 0.02,
      potassium: parseFloat((baseSal * 10.7).toFixed(1)),
      do: 5.8,
      h2s: 0.00,
      cl: 0.01,
      fe: 0.01,
      waterColor: 'Light Green'
    },
    {
      id: 2,
      doc: (activeTank.doc || 65) - 10,
      date: '2026-08-10',
      collectedBy: farmer?.agent || 'V. Kumar (Field Agent)',
      verificationStatus: 'VERIFIED ON-SITE',
      salinity: Math.max(1, baseSal - 1),
      ph: 8.1,
      alkalinity: 150,
      hardness: Math.max(1, baseSal - 1) * 300,
      ammonia: 0.08,
      nitrite: 0.03,
      potassium: parseFloat(((Math.max(1, baseSal - 1)) * 10.7).toFixed(1)),
      do: 5.4,
      h2s: 0.00,
      cl: 0.01,
      fe: 0.01,
      waterColor: 'Greenish Brown'
    },
    {
      id: 3,
      doc: (activeTank.doc || 65) - 20,
      date: '2026-07-31',
      collectedBy: farmer?.agent || 'V. Kumar (Field Agent)',
      verificationStatus: 'VERIFIED ON-SITE',
      salinity: Math.max(1, baseSal - 2),
      ph: 8.0,
      alkalinity: 140,
      hardness: Math.max(1, baseSal - 2) * 300,
      ammonia: 0.04,
      nitrite: 0.01,
      potassium: parseFloat(((Math.max(1, baseSal - 2)) * 10.7).toFixed(1)),
      do: 6.2,
      h2s: 0.00,
      cl: 0.00,
      fe: 0.01,
      waterColor: 'Light Green'
    },
    {
      id: 4,
      doc: (activeTank.doc || 65) - 30,
      date: '2026-07-21',
      collectedBy: farmer?.agent || 'V. Kumar (Field Agent)',
      verificationStatus: 'VERIFIED ON-SITE',
      salinity: Math.max(1, baseSal - 3),
      ph: 7.8,
      alkalinity: 135,
      hardness: Math.max(1, baseSal - 3) * 300,
      ammonia: 0.02,
      nitrite: 0.01,
      potassium: parseFloat(((Math.max(1, baseSal - 3)) * 10.7).toFixed(1)),
      do: 6.6,
      h2s: 0.00,
      cl: 0.00,
      fe: 0.00,
      waterColor: 'Clear Light Green'
    },
    {
      id: 5,
      doc: 20,
      date: '2026-07-06',
      collectedBy: farmer?.agent || 'V. Kumar (Field Agent)',
      verificationStatus: 'VERIFIED ON-SITE',
      salinity: Math.max(1, baseSal - 3),
      ph: 7.7,
      alkalinity: 130,
      hardness: Math.max(1, baseSal - 3) * 300,
      ammonia: 0.01,
      nitrite: 0.00,
      potassium: parseFloat(((Math.max(1, baseSal - 3)) * 10.7).toFixed(1)),
      do: 7.1,
      h2s: 0.00,
      cl: 0.00,
      fe: 0.00,
      waterColor: 'Clear'
    }
  ];

  // Generate historical growth sampling data for current active tank
  const docDays = [10, 20, 30, 40, 50, 60, 70];
  const growthData = docDays.map(doc => {
    const entry = { doc: `DOC ${doc}`, docNum: doc };
    const tankAcres = activeTank.acres || 4.0;
    const baseABW = (doc / 70) * (activeTank.abw || 24.0);
    
    const abwVal = parseFloat(baseABW.toFixed(2));
    const biomassVal = Math.round(abwVal * tankAcres * 115);
    const fcrVal = parseFloat((0.88 + (doc / 70) * 0.44).toFixed(2));
    const feedVal = Math.round(biomassVal * fcrVal);

    entry.abw = abwVal;
    entry.biomass = biomassVal;
    entry.fcr = fcrVal;
    entry.feed = feedVal;

    return entry;
  });

  // Export Full CSV Handler
  const handleDownload = () => {
    let csv = "data:text/csv;charset=utf-8,";
    csv += `FARMER & TANK MASTER REPORT - ${farmer.name.toUpperCase()}\n`;
    csv += `Farmer ID: ${farmer.id}\n`;
    csv += `Region: ${farmer.region} (${farmer.locality})\n`;
    csv += `Village: ${farmer.village}\n`;
    csv += `Data Collected By Field Agent: ${farmer.agent} | Incharge: ${farmer.incharge}\n\n`;

    csv += `--- TANK SETUP SPECIFICATIONS: ${activeTank.name.toUpperCase()} ---\n`;
    csv += `Tank Size (Acres),Source of Water,Salinity (ppt),Soil Type,Hatchery Name,Brooder,Seed Date,Stocking (Lak),Feed Type,Cycle\n`;
    csv += `${activeTank.acres},"${activeTank.waterSource}",${activeTank.salinity},"${activeTank.soilType}","${activeTank.hatcheryName}","${activeTank.brooder}",${activeTank.seedDate},${activeTank.seedStockingLak},"${activeTank.feedType}","${activeTank.currentCycle}"\n\n`;

    csv += `--- WATER QUALITY PARAMETERS LOG: ${activeTank.name.toUpperCase()} (COLLECTED ON-SITE BY AGENT) ---\n`;
    csv += `DOC,Date,Collected By,Status,Salinity (ppt),pH (7.5-8.5),Alkalinity (ppm),Hardness (ppm),Ammonia (mg/L),Nitrite (mg/L),Potassium (K ppm),DO (mg/L),H2S,Cl,Fe,Water Color\n`;
    waterQualityLogs.forEach(w => {
      csv += `${w.doc},${w.date},"${w.collectedBy}","${w.verificationStatus}",${w.salinity},${w.ph},${w.alkalinity},${w.hardness},${w.ammonia},${w.nitrite},${w.potassium},${w.do},${w.h2s},${w.cl},${w.fe},"${w.waterColor}"\n`;
    });

    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${farmer.name.replace(/\s+/g, '_')}_${activeTank.name}_Full_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
      {/* Top Header & Breadcrumb */}
      <div style={styles.topNavRow}>
        <button onClick={() => navigate('/admin/farmers')} style={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Back to All Farmers</span>
        </button>
      </div>

      <PageHeader 
        title={`Farmer & Tank Analytics: ${farmer.name}`} 
        breadcrumbs={[
          { label: 'Organization' },
          { label: 'Farmers', path: '/admin/farmers' }, 
          { label: farmer.name, active: true }
        ]} 
      />

      {/* 1. Farmer Master Profile Card */}
      <div style={styles.card}>
        <div style={styles.profileHeader}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={styles.farmerTitle}>{farmer.name}</h2>
              <span style={styles.idBadge}>{farmer.id}</span>
              <span style={styles.activePill}>{farmer.status || 'Active'}</span>
            </div>
            <p style={styles.profileSubtitle}>
              {farmer.region} • {farmer.locality} • {farmer.village}
            </p>
          </div>

          <button 
            style={styles.exportReportBtn}
            onClick={handleDownload}
          >
            <Download size={15} />
            <span>Export Agent Field Report (CSV)</span>
          </button>
        </div>

        {/* 4 Details Grid Blocks */}
        <div style={styles.profileGrid}>
          <div style={styles.profileBlock}>
            <span style={styles.blockLabel}>CONTACT NUMBER</span>
            <span style={styles.blockValue}>{farmer.phone}</span>
          </div>
          <div style={styles.profileBlock}>
            <span style={styles.blockLabel}>TOTAL LAND &amp; TANKS</span>
            <span style={{ ...styles.blockValue, color: '#16a34a' }}>
              {farmer.acres} • {tanksList.length} {tanksList.length > 1 ? 'Tanks' : 'Tank'}
            </span>
          </div>
          <div style={styles.profileBlock}>
            <span style={styles.blockLabel}>COLLECTING FIELD AGENT</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserCheck size={16} color="#2563eb" />
              <span style={{ ...styles.blockValue, color: '#2563eb' }}>{farmer.agent}</span>
            </div>
          </div>
          <div style={styles.profileBlock}>
            <span style={styles.blockLabel}>REGIONAL INCHARGE</span>
            <span style={styles.blockValue}>{farmer.incharge}</span>
          </div>
        </div>
      </div>

      {/* 2. Tank Tabs Navigation Bar (Switch between each and every tank) */}
      <div style={styles.tankTabsContainer}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={styles.selectTankLabel}>Select Tank to View:</span>
            {tanksList.map((tank, idx) => (
              <button
                key={tank.id || idx}
                style={{
                  ...styles.tankNavTab,
                  ...(activeTankIndex === idx ? styles.tankNavTabActive : {})
                }}
                onClick={() => setActiveTankIndex(idx)}
              >
                <Database size={15} color={activeTankIndex === idx ? '#2563eb' : '#64748b'} />
                <span>{tank.name} ({tank.acres} Ac)</span>
              </button>
            ))}
          </div>

          {/* Quick Edit Current Tank Button */}
          <button 
            style={styles.editTankQuickBtn}
            onClick={openEditTankModal}
            title="Edit biophysical specifications, cycle, water source, and parameters for this tank"
          >
            <Edit size={14} />
            <span>Edit {activeTank.name} Details</span>
          </button>
        </div>
      </div>

      {/* 3. Section: Tank Specifications & Pond Setup (Image 1 + Water Source) */}
      <div style={styles.card}>
        <div style={styles.sectionHeaderRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={styles.iconCircleBlue}>
              <Fish size={18} color="#2563eb" />
            </div>
            <div>
              <h3 style={styles.sectionCardTitle}>
                {activeTank.name} Specifications &amp; Setup Details
              </h3>
              <p style={styles.sectionCardSubtitle}>
                Key biophysical pond setup, stocking parameters, and water origin for {activeTank.name}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              style={styles.editTankSpecsPrimaryBtn}
              onClick={openEditTankModal}
            >
              <Edit size={13} />
              <span>Edit Tank Details</span>
            </button>
            <div style={styles.agentSyncedBadge}>
              <CheckCircle2 size={14} color="#16a34a" />
              <span>Agent Verified</span>
            </div>
          </div>
        </div>

        {/* Tank Specifications Grid (All Parameters from Image 1 + Source of Water) */}
        <div style={styles.specsGrid}>
          {/* 1. Tank Size - Acres */}
          <div style={styles.specItemCard}>
            <span style={styles.specLabel}>TANK SIZE</span>
            <span style={styles.specPrimaryValue}>{activeTank.acres} Acres</span>
            <span style={styles.specFootnote}>Cultivated Water Spread</span>
          </div>

          {/* 2. Source of Water */}
          <div style={styles.specItemCard}>
            <span style={styles.specLabel}>SOURCE OF WATER</span>
            <span style={{ ...styles.specPrimaryValue, fontSize: '14.5px', color: '#0284c7' }}>
              {activeTank.waterSource || farmer.waterSource || 'Creek / Estuary'}
            </span>
            <span style={styles.specFootnote}>Primary Water Intake</span>
          </div>

          {/* 3. Baseline Salinity */}
          <div style={styles.specItemCard}>
            <span style={styles.specLabel}>SALINITY</span>
            <span style={{ ...styles.specPrimaryValue, color: '#2563eb' }}>{activeTank.salinity} ppt</span>
            <span style={styles.specFootnote}>Baseline Pond Salinity</span>
          </div>

          {/* 4. Soil Type */}
          <div style={styles.specItemCard}>
            <span style={styles.specLabel}>SOIL TYPE</span>
            <span style={styles.specPrimaryValue}>{activeTank.soilType || 'Clay Loam'}</span>
            <span style={styles.specFootnote}>Loam, Clay, or Sandy</span>
          </div>

          {/* 5. Hatchery Name */}
          <div style={styles.specItemCard}>
            <span style={styles.specLabel}>HATCHERY NAME</span>
            <span style={{ ...styles.specPrimaryValue, fontSize: '14.5px' }}>
              {activeTank.hatcheryName || 'Apex Hatcheries'}
            </span>
            <span style={styles.specFootnote}>Certified SPF Source</span>
          </div>

          {/* 6. Brooder Lineage */}
          <div style={styles.specItemCard}>
            <span style={styles.specLabel}>BROODER LINEAGE</span>
            <span style={{ ...styles.specPrimaryValue, color: '#16a34a' }}>
              {activeTank.brooder || 'Kona Bay'}
            </span>
            <span style={styles.specFootnote}>Syaqua, Kona Bay, SIS, Other</span>
          </div>

          {/* 7. Seed Date */}
          <div style={styles.specItemCard}>
            <span style={styles.specLabel}>SEED DATE</span>
            <span style={styles.specPrimaryValue}>{activeTank.seedDate || '2026-05-15'}</span>
            <span style={styles.specFootnote}>Stocking Day 1</span>
          </div>

          {/* 8. Seed Number Stocking (Lak) */}
          <div style={styles.specItemCard}>
            <span style={styles.specLabel}>SEED STOCKING (LAK)</span>
            <span style={{ ...styles.specPrimaryValue, color: '#d97706' }}>
              {activeTank.seedStockingLak} Lakhs
            </span>
            <span style={styles.specFootnote}>
              Density: {((activeTank.seedStockingLak * 100000) / (activeTank.acres * 4046.86)).toFixed(1)} / m²
            </span>
          </div>

          {/* 9. Feed Type */}
          <div style={styles.specItemCard}>
            <span style={styles.specLabel}>FEED TYPE</span>
            <span style={{ ...styles.specPrimaryValue, fontSize: '14.5px', color: '#7c3aed' }}>
              {activeTank.feedType || 'Premium Pellets'}
            </span>
            <span style={styles.specFootnote}>Premium, Functional, Hypro, Tiger</span>
          </div>
        </div>
      </div>

      {/* 4. Section: Tank Growth Graph Trajectory */}
      <div style={styles.card}>
        <div style={styles.sectionHeaderRow}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="#2563eb" />
              <h3 style={styles.sectionCardTitle}>
                {activeTank.name} Growth Trajectory &amp; Feed Conversion Curve
              </h3>
            </div>
            <p style={styles.sectionCardSubtitle}>
              Sampling telemetry collected by agent <strong>{farmer.agent}</strong> for <strong>{activeTank.name}</strong> across Day of Culture (DOC 10 to DOC 70)
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div style={styles.metricToggleGroup}>
            <button 
              style={{
                ...styles.metricTab,
                ...(growthMetric === 'ABW' ? styles.metricTabActive : {})
              }}
              onClick={() => setGrowthMetric('ABW')}
            >
              Average Body Weight (ABW)
            </button>
            <button 
              style={{
                ...styles.metricTab,
                ...(growthMetric === 'BIOMASS' ? styles.metricTabActive : {})
              }}
              onClick={() => setGrowthMetric('BIOMASS')}
            >
              Biomass Growth (kg)
            </button>
            <button 
              style={{
                ...styles.metricTab,
                ...(growthMetric === 'FCR' ? styles.metricTabActive : {})
              }}
              onClick={() => setGrowthMetric('FCR')}
            >
              FCR Efficiency
            </button>
            <button 
              style={{
                ...styles.metricTab,
                ...(growthMetric === 'FEED' ? styles.metricTabActive : {})
              }}
              onClick={() => setGrowthMetric('FEED')}
            >
              Feed Intake (kg)
            </button>
          </div>
        </div>

        {/* Growth Graph Container */}
        <div style={{ height: '300px', marginTop: '16px' }}>
          <ResponsiveContainer width="100%" height="100%">
            {growthMetric === 'BIOMASS' || growthMetric === 'FEED' ? (
              <AreaChart data={growthData} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="doc" 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }}
                />
                <YAxis 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }}
                  unit=" kg"
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    borderRadius: '10px', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                    backgroundColor: '#ffffff'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey={growthMetric.toLowerCase()}
                  name={growthMetric === 'BIOMASS' ? 'Estimated Biomass' : 'Feed Intake'}
                  stroke="#2563eb" 
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#areaGradient)"
                />
              </AreaChart>
            ) : (
              <LineChart data={growthData} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="doc" 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }}
                />
                <YAxis 
                  domain={growthMetric === 'FCR' ? [0.8, 2.0] : [0, 'auto']}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }}
                  unit={growthMetric === 'ABW' ? 'g' : ''}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    borderRadius: '10px', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                    backgroundColor: '#ffffff'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey={growthMetric.toLowerCase()}
                  name={growthMetric === 'ABW' ? 'Body Weight (ABW)' : 'FCR Ratio'}
                  stroke={growthMetric === 'ABW' ? '#2563eb' : '#16a34a'} 
                  strokeWidth={3}
                  dot={{ r: 4.5, strokeWidth: 2, fill: '#ffffff', stroke: growthMetric === 'ABW' ? '#2563eb' : '#16a34a' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Section: Water Quality Parameters (Collected by Agent - Image 2) */}
      <div style={styles.card}>
        <div style={styles.sectionHeaderRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={styles.iconCircleTeal}>
              <Droplets size={18} color="#0d9488" />
            </div>
            <div>
              <h3 style={styles.sectionCardTitle}>
                {activeTank.name} Water Quality Parameters &amp; Chemical Monitoring
              </h3>
              <p style={styles.sectionCardSubtitle}>
                On-site weekly sampling parameters collected &amp; submitted by field agent <strong>{farmer.agent}</strong> for <strong>{activeTank.name}</strong>
              </p>
            </div>
          </div>

          <div style={styles.agentAuditBadge}>
            <Shield size={14} color="#0d9488" />
            <span>Agent Field Telemetry (Read-Only Audit)</span>
          </div>
        </div>

        {/* Quality Threshold Helper Cards */}
        <div style={styles.thresholdChipsRow}>
          <div style={styles.thresholdPill}>
            <strong>Salinity:</strong> 0 - 30 ppt
          </div>
          <div style={styles.thresholdPill}>
            <strong>pH:</strong> 7.5 - 8.5
          </div>
          <div style={styles.thresholdPill}>
            <strong>Alkalinity:</strong> 100 - 300 ppm
          </div>
          <div style={styles.thresholdPill}>
            <strong>Hardness:</strong> 1 ppt = 300 ppm
          </div>
          <div style={styles.thresholdPill}>
            <strong>Ammonia (NH3):</strong> &lt; 0.5 mg/L
          </div>
          <div style={styles.thresholdPill}>
            <strong>Nitrite (NO2):</strong> &lt; 0.25 mg/L
          </div>
          <div style={styles.thresholdPill}>
            <strong>Potassium (K):</strong> 1 ppt = 10.7 ppm
          </div>
          <div style={styles.thresholdPill}>
            <strong>DO:</strong> &gt; 4.0 mg/L
          </div>
        </div>

        {/* Water Quality Table (All 13 parameters from Image 2 + Agent Collection Column) */}
        <div style={{ overflowX: 'auto', marginTop: '14px' }}>
          <table style={styles.qualityTable}>
            <thead>
              <tr style={styles.qualityTheadRow}>
                <th style={styles.qualityTh}>DOC / DATE</th>
                <th style={styles.qualityTh}>COLLECTED BY AGENT</th>
                <th style={styles.qualityTh}>SALINITY</th>
                <th style={styles.qualityTh}>pH</th>
                <th style={styles.qualityTh}>ALKALINITY</th>
                <th style={styles.qualityTh}>HARDNESS</th>
                <th style={styles.qualityTh}>AMMONIA</th>
                <th style={styles.qualityTh}>NITRITE</th>
                <th style={styles.qualityTh}>POTASSIUM (K)</th>
                <th style={styles.qualityTh}>DO (mg/L)</th>
                <th style={styles.qualityTh}>H2S</th>
                <th style={styles.qualityTh}>Cl</th>
                <th style={styles.qualityTh}>Fe</th>
                <th style={styles.qualityTh}>WATER COLOR</th>
              </tr>
            </thead>
            <tbody>
              {waterQualityLogs.map((log) => (
                <tr key={log.id} style={styles.qualityTr}>
                  {/* DOC & Date */}
                  <td style={styles.qualityTd}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>DOC {log.doc}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{log.date}</div>
                  </td>

                  {/* Collected by Field Agent */}
                  <td style={styles.qualityTd}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '12px' }}>
                        {log.collectedBy}
                      </span>
                      <span style={styles.verifiedTag}>
                        <Check size={11} strokeWidth={3} />
                        <span>{log.verificationStatus}</span>
                      </span>
                    </div>
                  </td>

                  {/* Salinity (0-30 ppt) */}
                  <td style={styles.qualityTd}>
                    <span style={{ fontWeight: 700, color: '#2563eb' }}>{log.salinity} ppt</span>
                  </td>

                  {/* pH (7.5 - 8.5) */}
                  <td style={styles.qualityTd}>
                    <span style={{
                      fontWeight: 700,
                      color: log.ph >= 7.5 && log.ph <= 8.5 ? '#16a34a' : '#dc2626'
                    }}>
                      {log.ph}
                    </span>
                  </td>

                  {/* Alkalinity (100 - 300 ppm) */}
                  <td style={styles.qualityTd}>
                    <span style={{ fontWeight: 600 }}>{log.alkalinity} ppm</span>
                  </td>

                  {/* Hardness (1 sal = 300 ppm) */}
                  <td style={styles.qualityTd}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{log.hardness} ppm</span>
                  </td>

                  {/* Ammonia (0 - >0.5) */}
                  <td style={styles.qualityTd}>
                    <span style={{
                      fontWeight: 700,
                      color: log.ammonia > 0.5 ? '#dc2626' : '#16a34a'
                    }}>
                      {log.ammonia}
                    </span>
                  </td>

                  {/* Nitrite (0 - >0.25) */}
                  <td style={styles.qualityTd}>
                    <span style={{
                      fontWeight: 700,
                      color: log.nitrite > 0.25 ? '#dc2626' : '#16a34a'
                    }}>
                      {log.nitrite}
                    </span>
                  </td>

                  {/* Potassium K (1 sal = 10.7 ppm) */}
                  <td style={styles.qualityTd}>
                    <span style={{ fontWeight: 600 }}>{log.potassium} ppm</span>
                  </td>

                  {/* DO (<4 is critical) */}
                  <td style={styles.qualityTd}>
                    <span style={{
                      fontWeight: 800,
                      color: log.do < 4.0 ? '#dc2626' : '#16a34a',
                      backgroundColor: log.do < 4.0 ? '#fee2e2' : '#dcfce7',
                      padding: '2px 7px',
                      borderRadius: '5px'
                    }}>
                      {log.do} mg/L
                    </span>
                  </td>

                  {/* H2S (0 -> >0.02) */}
                  <td style={styles.qualityTd}>
                    <span style={{ color: log.h2s > 0.02 ? '#dc2626' : '#475569' }}>
                      {log.h2s}
                    </span>
                  </td>

                  {/* Cl (0 -> >0.02) */}
                  <td style={styles.qualityTd}>
                    <span style={{ color: log.cl > 0.02 ? '#dc2626' : '#475569' }}>
                      {log.cl}
                    </span>
                  </td>

                  {/* Fe (0 - 0.02) */}
                  <td style={styles.qualityTd}>
                    <span style={{ color: log.fe > 0.02 ? '#dc2626' : '#475569' }}>
                      {log.fe}
                    </span>
                  </td>

                  {/* Water Color */}
                  <td style={styles.qualityTd}>
                    <span style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      backgroundColor: '#f1f5f9',
                      color: '#334155',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}>
                      {log.waterColor}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Edit Tank Details & Setup Specifications */}
      {showEditTankModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalBox, width: '640px' }}>
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={styles.iconCircleBlue}>
                  <Edit size={18} color="#2563eb" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                    Edit {activeTank.name} Details &amp; Specifications
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Farmer: {farmer.name} ({farmer.id})
                  </div>
                </div>
              </div>
              <button onClick={() => setShowEditTankModal(false)} style={styles.modalCloseBtn}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTankDetails}>
              <div style={styles.modalBody}>
                {/* 1. Tank Name, Size & Water Source */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={styles.modalLabel}>Tank Label / Name *</label>
                    <input 
                      type="text" 
                      value={editTankForm.name}
                      onChange={(e) => setEditTankForm({ ...editTankForm, name: e.target.value })}
                      style={styles.modalInput}
                      required
                    />
                  </div>
                  <div>
                    <label style={styles.modalLabel}>Tank Size (Acres) *</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      min="0.1"
                      value={editTankForm.acres}
                      onChange={(e) => setEditTankForm({ ...editTankForm, acres: e.target.value })}
                      style={styles.modalInput}
                      required
                    />
                  </div>
                  <div>
                    <label style={styles.modalLabel}>Source of Water *</label>
                    <select 
                      style={styles.modalSelect}
                      value={editTankForm.waterSource}
                      onChange={(e) => setEditTankForm({ ...editTankForm, waterSource: e.target.value })}
                    >
                      <option value="Creek / Estuary">Creek / Estuary</option>
                      <option value="Sea / Coastal Canal">Sea / Coastal Canal</option>
                      <option value="Borewell / Ground Water">Borewell / Ground Water</option>
                      <option value="River / Freshwater Canal">River / Freshwater Canal</option>
                      <option value="Reservoir / Agricultural Canal">Reservoir / Agricultural Canal</option>
                      <option value="Other">Other Source</option>
                    </select>
                  </div>
                </div>

                {/* 2. Salinity & Soil Type */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={styles.modalLabel}>Baseline Salinity (ppt)</label>
                    <input 
                      type="number" 
                      step="0.5"
                      value={editTankForm.salinity}
                      onChange={(e) => setEditTankForm({ ...editTankForm, salinity: e.target.value })}
                      style={styles.modalInput}
                    />
                  </div>
                  <div>
                    <label style={styles.modalLabel}>Soil Type</label>
                    <select 
                      style={styles.modalSelect}
                      value={editTankForm.soilType}
                      onChange={(e) => setEditTankForm({ ...editTankForm, soilType: e.target.value })}
                    >
                      <option value="Loam">Loam</option>
                      <option value="Clay">Clay</option>
                      <option value="Sandy">Sandy</option>
                      <option value="Clay Loam">Clay Loam</option>
                      <option value="Sandy Loam">Sandy Loam</option>
                    </select>
                  </div>
                </div>

                {/* 3. Hatchery Name & Brooder */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={styles.modalLabel}>Hatchery Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Apex Marine Hatcheries"
                      value={editTankForm.hatcheryName}
                      onChange={(e) => setEditTankForm({ ...editTankForm, hatcheryName: e.target.value })}
                      style={styles.modalInput}
                    />
                  </div>
                  <div>
                    <label style={styles.modalLabel}>Brooder Lineage</label>
                    <select 
                      style={styles.modalSelect}
                      value={editTankForm.brooder}
                      onChange={(e) => setEditTankForm({ ...editTankForm, brooder: e.target.value })}
                    >
                      <option value="Kona Bay">Kona Bay</option>
                      <option value="Syaqua">Syaqua</option>
                      <option value="SIS">SIS</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* 4. Seed Date & Stocking Count (Lak) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={styles.modalLabel}>Seed Stocking Date</label>
                    <input 
                      type="date" 
                      value={editTankForm.seedDate}
                      onChange={(e) => setEditTankForm({ ...editTankForm, seedDate: e.target.value })}
                      style={styles.modalInput}
                    />
                  </div>
                  <div>
                    <label style={styles.modalLabel}>Stocking Count (Lakhs / Lak)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={editTankForm.seedStockingLak}
                      onChange={(e) => setEditTankForm({ ...editTankForm, seedStockingLak: e.target.value })}
                      style={styles.modalInput}
                    />
                  </div>
                </div>

                {/* 5. Feed Type, Culture Cycle & Target FCR */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={styles.modalLabel}>Feed Type</label>
                    <select 
                      style={styles.modalSelect}
                      value={editTankForm.feedType}
                      onChange={(e) => setEditTankForm({ ...editTankForm, feedType: e.target.value })}
                    >
                      <option value="Premium Pellets">Premium Pellets</option>
                      <option value="Functional Feed">Functional Feed</option>
                      <option value="Hypro Feed">Hypro Feed</option>
                      <option value="Tiger Feed">Tiger Feed</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={styles.modalLabel}>Culture Cycle</label>
                    <input 
                      type="text" 
                      value={editTankForm.currentCycle}
                      onChange={(e) => setEditTankForm({ ...editTankForm, currentCycle: e.target.value })}
                      style={styles.modalInput}
                    />
                  </div>
                  <div>
                    <label style={styles.modalLabel}>Target FCR</label>
                    <input 
                      type="number" 
                      step="0.05"
                      value={editTankForm.fcr}
                      onChange={(e) => setEditTankForm({ ...editTankForm, fcr: e.target.value })}
                      style={styles.modalInput}
                    />
                  </div>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button 
                  type="button" 
                  onClick={() => setShowEditTankModal(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={styles.submitBtn}
                >
                  Save Tank Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div style={styles.toast}>
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '1380px',
    margin: '0 auto'
  },
  topNavRow: {
    display: 'flex',
    alignItems: 'center'
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ffffff',
    color: '#334155',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '7px 14px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
    transition: 'all 0.15s'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    padding: '22px 26px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '18px'
  },
  farmerTitle: {
    fontSize: '22px',
    fontWeight: 800,
    color: '#0f172a',
    margin: 0
  },
  idBadge: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    fontSize: '12px',
    fontWeight: 800,
    padding: '3px 9px',
    borderRadius: '6px',
    border: '1px solid #dbeafe'
  },
  activePill: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    fontSize: '11px',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '9999px'
  },
  profileSubtitle: {
    fontSize: '13.5px',
    color: '#64748b',
    margin: '6px 0 0 0'
  },
  exportReportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '9px 16px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '14px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #e2e8f0'
  },
  profileBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  blockLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.4px'
  },
  blockValue: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#0f172a'
  },
  tankTabsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '12px 18px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
  },
  selectTankLabel: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#334155',
    marginRight: '6px'
  },
  tankNavTab: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '7px 14px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.15s'
  },
  tankNavTabActive: {
    backgroundColor: '#eff6ff',
    border: '1px solid #93c5fd',
    color: '#2563eb',
    fontWeight: 700,
    boxShadow: '0 1px 3px rgba(37, 99, 235, 0.15)'
  },
  editTankQuickBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '7px 14px',
    fontSize: '12.5px',
    fontWeight: 600,
    color: '#2563eb',
    cursor: 'pointer',
    transition: 'all 0.15s'
  },
  sectionHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '14px',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #f1f5f9'
  },
  iconCircleBlue: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconCircleTeal: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: '#ccfbf1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionCardTitle: {
    fontSize: '16.5px',
    fontWeight: 800,
    color: '#0f172a',
    margin: 0
  },
  sectionCardSubtitle: {
    fontSize: '12.5px',
    color: '#64748b',
    margin: '3px 0 0 0'
  },
  editTankSpecsPrimaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    border: '1px solid #bfdbfe',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer'
  },
  agentSyncedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 700
  },
  agentAuditBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#f0fdfa',
    color: '#0d9488',
    border: '1px solid #99f6e4',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 700
  },
  specsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px'
  },
  specItemCard: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  specLabel: {
    fontSize: '10.5px',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.4px',
    textTransform: 'uppercase'
  },
  specPrimaryValue: {
    fontSize: '16px',
    fontWeight: 800,
    color: '#0f172a',
    lineHeight: '1.2'
  },
  specFootnote: {
    fontSize: '11px',
    color: '#94a3b8',
    marginTop: '2px'
  },
  metricToggleGroup: {
    display: 'flex',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    padding: '3px',
    gap: '3px'
  },
  metricTab: {
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    padding: '5px 10px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.15s'
  },
  metricTabActive: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    fontWeight: 700
  },
  thresholdChipsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '10px'
  },
  thresholdPill: {
    fontSize: '11.5px',
    backgroundColor: '#f8fafc',
    color: '#475569',
    border: '1px solid #e2e8f0',
    padding: '3px 8px',
    borderRadius: '6px'
  },
  qualityTable: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '12.5px'
  },
  qualityTheadRow: {
    borderBottom: '2px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  },
  qualityTh: {
    padding: '10px 10px',
    fontSize: '10.5px',
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    whiteSpace: 'nowrap'
  },
  qualityTr: {
    borderBottom: '1px solid #f1f5f9'
  },
  qualityTd: {
    padding: '12px 10px',
    verticalAlign: 'middle'
  },
  verifiedTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    fontSize: '9.5px',
    fontWeight: 800,
    color: '#15803d',
    backgroundColor: '#dcfce7',
    padding: '1px 5px',
    borderRadius: '4px',
    width: 'fit-content'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    maxWidth: '92vw',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
    paddingBottom: '12px',
    borderBottom: '1px solid #f1f5f9'
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '4px'
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column'
  },
  modalLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '5px'
  },
  modalInput: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  modalSelect: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '18px'
  },
  cancelBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#475569',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  submitBtn: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#15803d',
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 9999
  }
};

export default FarmerDetail;

import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Initial Data Seed ---

const initialRegions = [
  { id: 'REG001', name: 'Bhimavaram' },
  { id: 'REG002', name: 'Kakinada' }
];

const initialIncharges = [
  { id: 'INC001', name: 'Admin User', regionId: 'REG001', email: 'incharge@example.com' }
];

const initialAgents = [
  { id: 'agent001', name: 'Agent A', phone: '9000000001', inchargeId: 'INC001', status: 'ACTIVE', locality: 'Chinnamiram' },
  { id: 'agent002', name: 'Agent B', phone: '9000000002', inchargeId: 'INC001', status: 'ACTIVE', locality: 'Undi' },
  { id: 'agent003', name: 'Agent C', phone: '9000000003', inchargeId: 'INC001', status: 'ACTIVE', locality: 'Akuruvu' }
];

const initialFarmers = [
  { id: 'F001', name: 'Ashok', status: 'ACTIVE', agentId: 'agent001', phone: '+91 9876543210', location: 'Bhimavaram', waterSource: 'Borewell', acres: 25 },
  { id: 'F002', name: 'Ravi', status: 'ACTIVE', agentId: 'agent001', phone: '+91 9876543211', location: 'Chinnamiram', waterSource: 'Canal', acres: 20 },
  { id: 'F003', name: 'Kumar', status: 'ACTIVE', agentId: 'agent001', phone: '+91 9876543212', location: 'Kalla', waterSource: 'Borewell', acres: 18 },
  { id: 'F004', name: 'Ramesh', status: 'ACTIVE', agentId: 'agent003', phone: '+91 9876543213', location: 'Akuruvu', waterSource: 'Borewell', acres: 30 },
  { id: 'F005', name: 'Ganesh', status: 'ACTIVE', agentId: 'agent002', phone: '+91 9876543214', location: 'Narasapuram', waterSource: 'Canal', acres: 15 },
  { id: 'F006', name: 'Siva', status: 'ACTIVE', agentId: 'agent001', phone: '+91 9876543215', location: 'Chinnamiram', waterSource: 'Borewell', acres: 22 },
  { id: 'F007', name: 'Nagesh', status: 'ACTIVE', agentId: 'agent001', phone: '+91 9876543216', location: 'Undi', waterSource: 'Canal', acres: 12 },
  { id: 'F008', name: 'Srinu', status: 'ACTIVE', agentId: 'agent001', phone: '+91 9876543217', location: 'Bhimavaram', waterSource: 'Borewell', acres: 40 },
  { id: 'F009', name: 'Venkatesh', status: 'ACTIVE', agentId: 'agent002', phone: '+91 9876543218', location: 'Narasapuram', waterSource: 'Borewell', acres: 18 },
  { id: 'F010', name: 'Krishna', status: 'ACTIVE', agentId: 'agent003', phone: '+91 9876543219', location: 'Akuruvu', waterSource: 'Canal', acres: 28 }
];

const initialTanks = [
  { id: 'T001', name: 'Tank 1', farmerId: 'F001', agentId: 'agent001', status: 'ACTIVE', testStatus: 'Overdue', abw: '12g', biomass: '800kg', fcr: '1.2', lastTest: '10 Aug 2026', nextTest: '17 Aug 2026' },
  { id: 'T002', name: 'Tank 2', farmerId: 'F001', agentId: 'agent001', status: 'ACTIVE', testStatus: 'Due', abw: '14g', biomass: '950kg', fcr: '1.1', lastTest: '15 Aug 2026', nextTest: '22 Aug 2026' },
  { id: 'T003', name: 'Tank 3', farmerId: 'F002', agentId: 'agent001', status: 'ACTIVE', testStatus: 'Completed', abw: '10g', biomass: '600kg', fcr: '1.3', lastTest: '21 Aug 2026', nextTest: '28 Aug 2026' },
  { id: 'T004', name: 'Tank 4', farmerId: 'F004', agentId: 'agent003', status: 'ACTIVE', testStatus: 'Due', abw: '20g', biomass: '1500kg', fcr: '1.0', lastTest: '22 Aug 2026', nextTest: '29 Aug 2026' },
  { id: 'T007', name: 'Tank 7', farmerId: 'F005', agentId: 'agent002', status: 'ACTIVE', testStatus: 'Completed', abw: '11g', biomass: '700kg', fcr: '1.25', lastTest: '15 Aug 2026', nextTest: '22 Aug 2026' },
  { id: 'T008', name: 'Tank 8', farmerId: 'F006', agentId: 'agent001', status: 'ACTIVE', testStatus: 'Due', abw: '18g', biomass: '1200kg', fcr: '1.15', lastTest: '20 Aug 2026', nextTest: '27 Aug 2026' },
  { id: 'T009', name: 'Tank 9', farmerId: 'F007', agentId: 'agent001', status: 'ACTIVE', testStatus: 'Overdue', abw: '9g', biomass: '400kg', fcr: '1.4', lastTest: '08 Aug 2026', nextTest: '15 Aug 2026' },
  { id: 'T010', name: 'Tank 10', farmerId: 'F008', agentId: 'agent001', status: 'ACTIVE', testStatus: 'Due', abw: '16g', biomass: '2000kg', fcr: '1.2', lastTest: '19 Aug 2026', nextTest: '26 Aug 2026' },
  { id: 'T011', name: 'Tank 11', farmerId: 'F009', agentId: 'agent002', status: 'ACTIVE', testStatus: 'Due', abw: '13g', biomass: '900kg', fcr: '1.1', lastTest: '21 Aug 2026', nextTest: '28 Aug 2026' },
  { id: 'T012', name: 'Tank 12', farmerId: 'F010', agentId: 'agent003', status: 'ACTIVE', testStatus: 'Overdue', abw: '21g', biomass: '1600kg', fcr: '1.35', lastTest: '11 Aug 2026', nextTest: '18 Aug 2026' }
];

const initialSubmissions = [
  {
    id: 'SUB001',
    agentId: 'agent001',
    farmerId: 'F001',
    tankId: 'T001',
    testType: 'Water Analysis',
    date: '2026-08-22',
    status: 'PENDING_VERIFICATION',
    submittedAgo: '10 mins ago',
    data: {
      waterQuality: { salinity: '15', ph: '7.8', do: '5.2', waterColor: 'Light Green' },
      biomass: '1200kg',
      fcr: '1.2'
    }
  },
  {
    id: 'SUB002',
    agentId: 'agent002',
    farmerId: 'F005',
    tankId: 'T007',
    testType: 'Feed Test',
    date: '2026-08-21',
    status: 'COMPLETED',
    submittedAgo: '1 day ago',
    data: {
      waterQuality: { salinity: '20', ph: '8.1', do: '4.8', waterColor: 'Brown' },
      biomass: '800kg',
      fcr: '1.4'
    }
  }
];

// --- Context Definition ---

const MockDataContext = createContext(null);

export const MockDataProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Load from LocalStorage or Initialize
  useEffect(() => {
    const savedData = localStorage.getItem('aqua_feed_mock_database_v2');
    if (savedData) {
      setDb(JSON.parse(savedData));
    } else {
      const initialDb = {
        regions: initialRegions,
        incharges: initialIncharges,
        agents: initialAgents,
        farmers: initialFarmers,
        tanks: initialTanks,
        submissions: initialSubmissions,
        cultureCycles: [],
        drafts: [],
        notifications: [],
        activities: [
          { id: 1, time: '2026-08-22 10:00 AM', action: 'Approved Test', detail: 'Approved water test for Tank 1' },
          { id: 2, time: '2026-08-22 11:30 AM', action: 'Added Agent', detail: 'Added new agent Agent D' }
        ]
      };
      setDb(initialDb);
      localStorage.setItem('aqua_feed_mock_database_v2', JSON.stringify(initialDb));
    }
  }, []);

  // Save to LocalStorage whenever DB changes
  useEffect(() => {
    if (db) {
      localStorage.setItem('aqua_feed_mock_database_v2', JSON.stringify(db));
    }
  }, [db]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const addActivity = (action, detail) => {
    const time = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    setDb(prev => ({
      ...prev,
      activities: [{ id: Date.now(), time, action, detail }, ...(prev.activities || [])]
    }));
  };

  // If db is not yet loaded, don't render children (avoid errors)
  if (!db) return null;

  // --- Selectors ---

  const getAgentById = (id) => db.agents.find(a => a.id === id);
  
  const getFarmersByAgentId = (agentId) => db.farmers.filter(f => f.agentId === agentId);
  
  const getFarmerById = (id) => db.farmers.find(f => f.id === id);
  
  const getTanksByFarmerId = (farmerId) => db.tanks.filter(t => t.farmerId === farmerId);
  
  const getTankById = (id) => db.tanks.find(t => t.id === id);
  
  const getSubmissionsByAgentId = (agentId) => db.submissions.filter(s => s.agentId === agentId);

  const getAgentNotifications = (agentId) => (db.notifications || []).filter(n => n.agentId === agentId);

  // Advanced Selectors for Agent Dashboard
  const getAgentDashboardMetrics = (agentId) => {
    const farmers = getFarmersByAgentId(agentId);
    let totalTanks = 0;
    let testsCompleted = 0;
    let testsDue = 0;
    let overdue = 0;
    const todaysWork = [];

    farmers.forEach(farmer => {
      const farmerTanks = getTanksByFarmerId(farmer.id);
      totalTanks += farmerTanks.length;
      farmerTanks.forEach(tank => {
        if (tank.testStatus === 'Completed') testsCompleted++;
        if (tank.testStatus === 'Due') {
          testsDue++;
          todaysWork.push({ id: tank.id, farmerName: farmer.name, tankName: tank.name, type: 'Water Analysis', date: tank.nextTest, status: 'Due', tankId: tank.id });
        }
        if (tank.testStatus === 'Overdue') {
          overdue++;
          todaysWork.push({ id: tank.id, farmerName: farmer.name, tankName: tank.name, type: 'Weekly Test', date: tank.nextTest, status: 'Overdue', tankId: tank.id });
        }
      });
    });

    const pendingVerify = getSubmissionsByAgentId(agentId).filter(s => s.status === 'PENDING_VERIFICATION').length;

    return {
      kpi: {
        assignedFarmers: farmers.length,
        totalTanks,
        testsCompleted,
        testsDue,
        overdue,
        pendingVerify
      },
      todaysWork
    };
  };

  // Advanced Selectors for Incharge Dashboard
  const getInchargeDashboardMetrics = (inchargeId) => {
    const totalAgents = db.agents.length;
    const totalFarmers = db.farmers.length;
    const totalTanks = db.tanks.length;
    
    let testsCompleted = 0;
    let testsDue = 0;
    let overdueTests = 0;
    
    db.tanks.forEach(t => {
      if (t.testStatus === 'Completed') testsCompleted++;
      if (t.testStatus === 'Due') testsDue++;
      if (t.testStatus === 'Overdue') overdueTests++;
    });

    const pendingVerification = db.submissions.filter(s => s.status === 'PENDING_VERIFICATION').length;

    return {
      totalAgents,
      newAgentsMonth: 0,
      totalFarmers,
      newFarmersMonth: 0,
      totalTanks,
      newTanksMonth: 0,
      testsCompleted,
      testsDue,
      overdueTests,
      pendingVerification
    };
  };

  // --- Actions ---

  const updateTank = (tankId, updates) => {
    setDb(prev => ({
      ...prev,
      tanks: prev.tanks.map(t => t.id === tankId ? { ...t, ...updates } : t)
    }));
    showToast(`Tank ${tankId} updated!`);
  };

  const updateFarmer = (farmerId, updates) => {
    setDb(prev => ({
      ...prev,
      farmers: prev.farmers.map(f => f.id === farmerId ? { ...f, ...updates } : f)
    }));
    showToast(`Farmer ${farmerId} updated!`);
  };

  const submitRecord = (submissionData) => {
    const newSubmission = {
      id: `SUB${Date.now()}`,
      status: 'PENDING_VERIFICATION',
      submittedAgo: 'Just now',
      date: new Date().toISOString().split('T')[0],
      ...submissionData
    };
    
    setDb(prev => {
      const newTanks = prev.tanks.map(t => 
        t.id === submissionData.tankId ? { ...t, testStatus: 'Completed' } : t
      );
      const newDrafts = prev.drafts.filter(d => d.tankId !== submissionData.tankId);

      return {
        ...prev,
        submissions: [...prev.submissions, newSubmission],
        tanks: newTanks,
        drafts: newDrafts
      };
    });
    showToast('Record submitted for verification!');
  };

  const updateSubmissionStatus = (submissionId, newStatus) => {
    setDb(prev => ({
      ...prev,
      submissions: prev.submissions.map(s => 
        s.id === submissionId ? { ...s, status: newStatus } : s
      )
    }));
    showToast(`Submission marked as ${newStatus}`);
  };

  const assignFarmerToAgent = (farmerId, newAgentId) => {
    setDb(prev => {
      const newFarmers = prev.farmers.map(f => 
        f.id === farmerId ? { ...f, agentId: newAgentId } : f
      );
      const newTanks = prev.tanks.map(t =>
        t.farmerId === farmerId ? { ...t, agentId: newAgentId } : t
      );
      return { ...prev, farmers: newFarmers, tanks: newTanks };
    });
    showToast(`Farmer reassigned successfully!`);
  };

  const addAgent = (agentData) => {
    setDb(prev => {
      const nextId = `agent${String(prev.agents.length + 1).padStart(3, '0')}`;
      return {
        ...prev,
        agents: [...prev.agents, { ...agentData, id: nextId }]
      };
    });
    showToast(`Agent ${agentData.name} added!`);
  };

  const createFarmerWithTanks = (agentId, farmerData, tanksData) => {
    setDb(prev => {
      const nextFarmerNum = prev.farmers.length > 0 
        ? Math.max(...prev.farmers.map(f => parseInt(f.id.replace('F', '')) || 0)) + 1 
        : 1;
      const newFarmerId = `F${nextFarmerNum.toString().padStart(3, '0')}`;

      let nextTankNum = prev.tanks.length > 0 
        ? Math.max(...prev.tanks.map(t => parseInt(t.id.replace('T', '')) || 0)) + 1 
        : 1;

      const newTanks = tanksData.map((tankData, index) => {
        const tId = `T${(nextTankNum + index).toString().padStart(3, '0')}`;
        return {
          id: tId,
          name: `Tank ${index + 1}`,
          farmerId: newFarmerId,
          agentId,
          status: 'ACTIVE',
          testStatus: 'Completed',
          ...tankData,
          lastTest: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          nextTest: 'TBD'
        };
      });

      const newFarmer = {
        id: newFarmerId,
        name: farmerData.name,
        status: 'ACTIVE',
        agentId,
        phone: farmerData.phone,
        location: `${farmerData.village}, ${farmerData.area}`,
        acres: farmerData.acres,
        waterSource: farmerData.waterSource
      };

      showToast(`Added Farmer ${farmerData.name} with ${newTanks.length} tanks!`);
      
      return {
        ...prev,
        farmers: [...prev.farmers, newFarmer],
        tanks: [...prev.tanks, ...newTanks]
      };
    });
  };

  const saveDraft = (draft) => {
    setDb(prev => {
      const existingIndex = prev.drafts.findIndex(d => d.tankId === draft.tankId);
      const newDrafts = [...prev.drafts];
      if (existingIndex >= 0) {
        newDrafts[existingIndex] = draft;
      } else {
        newDrafts.push(draft);
      }
      return { ...prev, drafts: newDrafts };
    });
    showToast('Draft saved!');
  };

  const getDraft = (tankId) => db.drafts.find(d => d.tankId === tankId) || null;

  const addNotification = (agentId, message, type = 'info') => {
    setDb(prev => ({
      ...prev,
      notifications: [{ id: Date.now(), agentId, message, type, read: false, time: new Date().toLocaleString() }, ...(prev.notifications || [])]
    }));
  };

  const markNotificationRead = (notificationId) => {
    setDb(prev => ({
      ...prev,
      notifications: (prev.notifications || []).map(n => n.id === notificationId ? { ...n, read: true } : n)
    }));
  };

  return (
    <MockDataContext.Provider value={{
      db,
      getAgentById,
      getFarmersByAgentId,
      getFarmerById,
      getTanksByFarmerId,
      getTankById,
      getSubmissionsByAgentId,
      getAgentNotifications,
      getAgentDashboardMetrics,
      getInchargeDashboardMetrics,
      updateTank,
      updateFarmer,
      submitRecord,
      updateSubmissionStatus,
      assignFarmerToAgent,
      createFarmerWithTanks,
      saveDraft,
      getDraft,
      addAgent,
      addActivity,
      addNotification,
      markNotificationRead
    }}>
      {children}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          fontWeight: '600',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            backgroundColor: 'white',
            borderRadius: '50%'
          }}></span>
          Shared Mock Data: LIVE | {toastMessage}
        </div>
      )}
    </MockDataContext.Provider>
  );
};

export const useMockData = () => useContext(MockDataContext);

export const initialFarmers = [
  {
    id: 'F001',
    name: 'Ashok',
    status: 'ACTIVE',
    assignedAgentId: 'agent001',
    phone: '+91 9876543210',
    location: 'Bhimavaram, Andhra Pradesh',
    waterSource: 'Borewell',
    tankIds: ['T001', 'T002']
  },
  {
    id: 'F002',
    name: 'Ravi',
    status: 'ACTIVE',
    assignedAgentId: 'agent001',
    phone: '+91 9876543211',
    location: 'Chinnamiram, Andhra Pradesh',
    waterSource: 'Canal',
    tankIds: ['T003']
  },
  {
    id: 'F003',
    name: 'Kumar',
    status: 'ACTIVE',
    assignedAgentId: 'agent001',
    phone: '+91 9876543212',
    location: 'Kalla, Andhra Pradesh',
    waterSource: 'Borewell',
    tankIds: ['T004', 'T005']
  },
  {
    id: 'F004',
    name: 'Suresh',
    status: 'INACTIVE',
    assignedAgentId: 'agent001',
    phone: '+91 9876543213',
    location: 'Palakollu, Andhra Pradesh',
    tankIds: ['T006']
  },
  {
    // Assigned to someone else
    id: 'F005',
    name: 'Ganesh',
    status: 'ACTIVE',
    assignedAgentId: 'agent002',
    phone: '+91 9876543214',
    location: 'Narasapuram, Andhra Pradesh',
    tankIds: ['T007']
  },
  {
    id: 'F006',
    name: 'Srinivas',
    status: 'ACTIVE',
    assignedAgentId: 'agent001',
    phone: '+91 9876543215',
    location: 'Eluru, Andhra Pradesh',
    tankIds: ['T008', 'T009']
  },
  {
    id: 'F007',
    name: 'Venkatesh',
    status: 'ACTIVE',
    assignedAgentId: 'agent001',
    phone: '+91 9876543216',
    location: 'Tadepalligudem, Andhra Pradesh',
    tankIds: ['T010']
  },
  {
    id: 'F008',
    name: 'Prasad',
    status: 'INACTIVE',
    assignedAgentId: 'agent001',
    phone: '+91 9876543217',
    location: 'Undi, Andhra Pradesh',
    tankIds: ['T011']
  },
  {
    id: 'F009',
    name: 'Ramu',
    status: 'ACTIVE',
    assignedAgentId: 'agent001',
    phone: '+91 9876543218',
    location: 'Akividu, Andhra Pradesh',
    tankIds: ['T012', 'T013']
  },
  {
    id: 'F010',
    name: 'Satyanarayana',
    status: 'ACTIVE',
    assignedAgentId: 'agent002',
    phone: '+91 9876543219',
    location: 'Palakollu, Andhra Pradesh',
    tankIds: ['T014', 'T015']
  }
];

export const initialTanks = [
  { id: 'T001', name: 'Tank 1', farmerId: 'F001', status: 'ACTIVE', testStatus: 'Overdue', abw: '12g', biomass: '800kg', fcr: '1.2', lastTest: '10 Aug 2026', nextTest: '17 Aug 2026' },
  { id: 'T002', name: 'Tank 2', farmerId: 'F001', status: 'ACTIVE', testStatus: 'Due', abw: '14g', biomass: '950kg', fcr: '1.1', lastTest: '15 Aug 2026', nextTest: '22 Aug 2026' },
  { id: 'T003', name: 'Tank 1', farmerId: 'F002', status: 'ACTIVE', testStatus: 'Completed', abw: '10g', biomass: '600kg', fcr: '1.3', lastTest: '21 Aug 2026', nextTest: '28 Aug 2026' },
  { id: 'T004', name: 'Tank 1', farmerId: 'F003', status: 'ACTIVE', testStatus: 'Completed', abw: '20g', biomass: '1500kg', fcr: '1.0', lastTest: '22 Aug 2026', nextTest: '29 Aug 2026' },
  { id: 'T005', name: 'Tank 2', farmerId: 'F003', status: 'ACTIVE', testStatus: 'Overdue', abw: '22g', biomass: '1700kg', fcr: '1.05', lastTest: '12 Aug 2026', nextTest: '19 Aug 2026' },
  { id: 'T006', name: 'Tank 1', farmerId: 'F004', status: 'INACTIVE', testStatus: 'Completed', abw: '5g', biomass: '200kg', fcr: '1.4', lastTest: '01 Aug 2026', nextTest: '08 Aug 2026' },
  { id: 'T007', name: 'Tank 1', farmerId: 'F005', status: 'ACTIVE', testStatus: 'Due', abw: '11g', biomass: '700kg', fcr: '1.25', lastTest: '15 Aug 2026', nextTest: '22 Aug 2026' },
  { id: 'T008', name: 'Tank 1', farmerId: 'F006', status: 'ACTIVE', testStatus: 'Completed', abw: '16g', biomass: '1100kg', fcr: '1.15', lastTest: '20 Aug 2026', nextTest: '27 Aug 2026' },
  { id: 'T009', name: 'Tank 2', farmerId: 'F006', status: 'ACTIVE', testStatus: 'Due', abw: '13g', biomass: '850kg', fcr: '1.2', lastTest: '14 Aug 2026', nextTest: '21 Aug 2026' },
  { id: 'T010', name: 'Tank 1', farmerId: 'F007', status: 'ACTIVE', testStatus: 'Overdue', abw: '18g', biomass: '1300kg', fcr: '1.08', lastTest: '08 Aug 2026', nextTest: '15 Aug 2026' },
  { id: 'T011', name: 'Tank 1', farmerId: 'F008', status: 'INACTIVE', testStatus: 'Completed', abw: '0g', biomass: '0kg', fcr: '0', lastTest: '01 Jul 2026', nextTest: '08 Jul 2026' },
  { id: 'T012', name: 'Tank 1', farmerId: 'F009', status: 'ACTIVE', testStatus: 'Completed', abw: '24g', biomass: '1900kg', fcr: '1.02', lastTest: '21 Aug 2026', nextTest: '28 Aug 2026' },
  { id: 'T013', name: 'Tank 2', farmerId: 'F009', status: 'ACTIVE', testStatus: 'Due', abw: '21g', biomass: '1600kg', fcr: '1.06', lastTest: '15 Aug 2026', nextTest: '22 Aug 2026' },
  { id: 'T014', name: 'Tank 1', farmerId: 'F010', status: 'ACTIVE', testStatus: 'Overdue', abw: '10g', biomass: '500kg', fcr: '1.35', lastTest: '09 Aug 2026', nextTest: '16 Aug 2026' },
  { id: 'T015', name: 'Tank 2', farmerId: 'F010', status: 'ACTIVE', testStatus: 'Due', abw: '15g', biomass: '900kg', fcr: '1.18', lastTest: '14 Aug 2026', nextTest: '21 Aug 2026' },
];

export const initialSubmissions = [
  {
    id: 'SUB001',
    agentId: 'agent001',
    farmerId: 'F001',
    tankId: 'T001',
    date: '2026-08-10',
    status: 'COMPLETED',
    data: {
      waterQuality: { salinity: '15', ph: '7.8', do: '5.2', waterColor: 'Light Green' },
      biomass: '1200kg',
      fcr: '1.2'
    }
  },
  {
    id: 'SUB002',
    agentId: 'agent001',
    farmerId: 'F002',
    tankId: 'T003',
    date: '2026-08-12',
    status: 'PENDING_VERIFICATION',
    data: {
      waterQuality: { salinity: '20', ph: '8.1', do: '4.8', waterColor: 'Brown' },
      biomass: '800kg',
      fcr: '1.4'
    }
  }
];

export const initDB = () => {
  const storedFarmers = localStorage.getItem('aqua_farmers');
  if (!storedFarmers || JSON.parse(storedFarmers).length < initialFarmers.length) {
    localStorage.setItem('aqua_farmers', JSON.stringify(initialFarmers));
  }
  const storedTanks = localStorage.getItem('aqua_tanks');
  if (!storedTanks || JSON.parse(storedTanks).length < initialTanks.length || JSON.parse(storedTanks).find(t => t.id === 'T003')?.name === 'Tank 3') {
    localStorage.setItem('aqua_tanks', JSON.stringify(initialTanks));
  }
  if (!localStorage.getItem('aqua_drafts')) {
    localStorage.setItem('aqua_drafts', JSON.stringify([]));
  }
  const storedSub = localStorage.getItem('aqua_submissions');
  if (!storedSub || JSON.parse(storedSub).length === 0) {
    localStorage.setItem('aqua_submissions', JSON.stringify(initialSubmissions));
  }
};

export const getDB = (key) => {
  initDB();
  return JSON.parse(localStorage.getItem(key)) || [];
};

export const setDB = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getAssignedFarmers = (agentId) => {
  const allFarmers = getDB('aqua_farmers');
  const allTanks = getDB('aqua_tanks');

  return allFarmers
    .filter(f => agentId === 'admin' || f.assignedAgentId === agentId)
    .map(farmer => {
      const farmerTanks = allTanks.filter(t => t.farmerId === farmer.id);
      return { ...farmer, tanks: farmerTanks };
    });
};

export const getDashboardMetrics = (agentId) => {
  const farmers = getAssignedFarmers(agentId);
  let totalTanks = 0;
  let testsCompleted = 0;
  let testsDue = 0;
  let overdue = 0;

  const todaysWork = [];

  farmers.forEach(farmer => {
    totalTanks += farmer.tanks.length;
    farmer.tanks.forEach(tank => {
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

  const submissions = getDB('aqua_submissions').filter(s => s.agentId === agentId);
  const pendingVerify = submissions.length; // Assume all are pending for mock

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

export const saveDraft = (draft) => {
  const drafts = getDB('aqua_drafts');
  const existingIndex = drafts.findIndex(d => d.tankId === draft.tankId);
  if (existingIndex >= 0) {
    drafts[existingIndex] = draft;
  } else {
    drafts.push(draft);
  }
  setDB('aqua_drafts', drafts);
};

export const getDraft = (tankId) => {
  const drafts = getDB('aqua_drafts');
  return drafts.find(d => d.tankId === tankId) || null;
};

export const submitVisit = (submission) => {
  const submissions = getDB('aqua_submissions');
  submissions.push({
    ...submission,
    status: 'PENDING_VERIFICATION'
  });
  setDB('aqua_submissions', submissions);

  // Remove from drafts if exists
  const drafts = getDB('aqua_drafts').filter(d => d.tankId !== submission.tankId);
  setDB('aqua_drafts', drafts);

  // Update tank status to Completed
  const tanks = getDB('aqua_tanks');
  const tankIndex = tanks.findIndex(t => t.id === submission.tankId);
  if (tankIndex >= 0) {
    tanks[tankIndex].testStatus = 'Completed';
    setDB('aqua_tanks', tanks);
  }
};

export const createFarmerWithTanks = (agentId, farmerData, tanksData) => {
  const allFarmers = getDB('aqua_farmers');
  const allTanks = getDB('aqua_tanks');

  // Generate unique IDs
  const nextFarmerNum = allFarmers.length > 0
    ? Math.max(...allFarmers.map(f => parseInt(f.id.substring(1)) || 0)) + 1
    : 1;
  const newFarmerId = `F${nextFarmerNum.toString().padStart(3, '0')}`;

  let nextTankNum = allTanks.length > 0
    ? Math.max(...allTanks.map(t => parseInt(t.id.substring(1)) || 0)) + 1
    : 1;

  const newTankIds = [];
  const newTanks = tanksData.map((tankData, index) => {
    const tId = `T${(nextTankNum + index).toString().padStart(3, '0')}`;
    newTankIds.push(tId);
    return {
      id: tId,
      name: `Tank ${index + 1}`,
      farmerId: newFarmerId,
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
    assignedAgentId: agentId,
    phone: farmerData.phone,
    location: `${farmerData.village}, ${farmerData.area}`,
    tankIds: newTankIds,
    acres: farmerData.acres,
    waterSource: farmerData.waterSource
  };

  allFarmers.push(newFarmer);
  setDB('aqua_farmers', allFarmers);

  const updatedTanks = [...allTanks, ...newTanks];
  setDB('aqua_tanks', updatedTanks);

  return newFarmerId;
};

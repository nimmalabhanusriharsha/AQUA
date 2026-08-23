export const initialInchargeKPIs = {
  totalAgents: 12,
  newAgentsMonth: 2,
  totalFarmers: 420,
  newFarmersMonth: 34,
  totalTanks: 1248,
  newTanksMonth: 108,
  testsMonth: 3462,
  newTestsMonth: 286,
  pendingVerification: 185,
  pendingVerificationChange: -12, // from yesterday
  overdueTests: 67,
  overdueTestsChange: 8 // from yesterday
};

export const initialInchargeActivities = [
  { id: 1, action: 'Agent A submitted Water Analysis', detail: 'Ashok - Tank 2', time: '10 mins ago' },
  { id: 2, action: 'Agent B submitted Feed Test', detail: 'Ravi - Tank 3', time: '25 mins ago' },
  { id: 3, action: 'You approved Water Analysis', detail: 'Kumar - Tank 1', time: '45 mins ago' },
  { id: 4, action: 'Agent C submitted Medication', detail: 'Ramesh - Tank 4', time: '1 hour ago' },
  { id: 5, action: 'You allocated new farmer', detail: 'Suresh', time: '2 hours ago' },
];

export const mockInchargeAgents = [
  { id: 'A001', name: 'Agent A', mobile: '9000000001', locality: 'Chinnamiram', farmers: 45, tanks: 112, tests: 98, compliance: 87.5, status: 'Active' },
  { id: 'A002', name: 'Agent B', mobile: '9000000002', locality: 'Undi', farmers: 52, tanks: 128, tests: 110, compliance: 85.9, status: 'Active' },
  { id: 'A003', name: 'Agent C', mobile: '9000000003', locality: 'Akuruvu', farmers: 38, tanks: 98, tests: 92, compliance: 93.9, status: 'Active' }
];

export const mockInchargeFarmers = [
  { id: 'F001', name: 'Ashok', phone: '9888888801', locality: 'Chinnamiram', acres: 25, tanks: 5, agent: 'Agent A', lastTest: '22 Aug 2026', status: 'Active' },
  { id: 'F002', name: 'Ravi', phone: '9888888802', locality: 'Undi', acres: 20, tanks: 4, agent: 'Agent B', lastTest: '22 Aug 2026', status: 'Active' },
  { id: 'F003', name: 'Kumar', phone: '9888888803', locality: 'Chinnamiram', acres: 18, tanks: 3, agent: 'Agent A', lastTest: '22 Aug 2026', status: 'Active' },
  { id: 'F004', name: 'Ramesh', phone: '9888888804', locality: 'Akuruvu', acres: 30, tanks: 6, agent: 'Agent C', lastTest: '21 Aug 2026', status: 'Active' }
];

export const mockInchargeTanks = [
  { id: 'T001', name: 'Tank 1', farmer: 'Kumar', locality: 'Chinnamiram', agent: 'Agent A', lastTest: '22 Aug 2026', nextDue: '29 Aug 2026', status: 'Completed' },
  { id: 'T002', name: 'Tank 2', farmer: 'Ashok', locality: 'Chinnamiram', agent: 'Agent A', lastTest: '22 Aug 2026', nextDue: '29 Aug 2026', status: 'Pending Verification' },
  { id: 'T003', name: 'Tank 3', farmer: 'Ravi', locality: 'Undi', agent: 'Agent B', lastTest: '22 Aug 2026', nextDue: '29 Aug 2026', status: 'Pending Verification' },
  { id: 'T004', name: 'Tank 4', farmer: 'Ramesh', locality: 'Akuruvu', agent: 'Agent C', lastTest: '21 Aug 2026', nextDue: '28 Aug 2026', status: 'Due' }
];

export const mockInchargeVerifications = [
  { id: 'V001', farmer: 'Ashok', tank: 'Tank 2', testType: 'Water Analysis', date: '22 Aug 2026', agent: 'Agent A', submitted: '10 mins ago', status: 'Pending' },
  { id: 'V002', farmer: 'Ravi', tank: 'Tank 3', testType: 'Feed Test', date: '22 Aug 2026', agent: 'Agent B', submitted: '25 mins ago', status: 'Pending' },
  { id: 'V003', farmer: 'Kumar', tank: 'Tank 1', testType: 'Water Analysis', date: '22 Aug 2026', agent: 'Agent A', submitted: '45 mins ago', status: 'Pending' },
  { id: 'V004', farmer: 'Ramesh', tank: 'Tank 4', testType: 'Medication', date: '22 Aug 2026', agent: 'Agent C', submitted: '1 hour ago', status: 'Pending' }
];

// Helper to simulate state in mock without a real backend
let currentVerifications = [...mockInchargeVerifications];
let currentActivities = [...initialInchargeActivities];
let currentAgents = [...mockInchargeAgents];
let currentFarmers = [...mockInchargeFarmers];

export const getFarmers = () => currentFarmers;
export const addFarmer = (farmerData) => {
  const newFarmer = {
    id: `F${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    agent: 'Unassigned',
    lastTest: 'N/A',
    status: 'Active',
    ...farmerData
  };
  currentFarmers.push(newFarmer);
  addActivity('You added a new farmer', newFarmer.name);
};

export const getAgents = () => currentAgents;
export const addAgent = (agentData) => {
  const newAgent = {
    id: `A${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    farmers: 0,
    tanks: 0,
    tests: 0,
    compliance: 100,
    status: 'Active',
    ...agentData
  };
  currentAgents.push(newAgent);
  addActivity('You added a new agent', newAgent.name);
};

export const getVerifications = () => currentVerifications;
export const updateVerificationStatus = (id, newStatus, remarks) => {
  currentVerifications = currentVerifications.map(v => 
    v.id === id ? { ...v, status: newStatus } : v
  );
  
  const vItem = mockInchargeVerifications.find(v => v.id === id);
  if (vItem) {
     addActivity(`You ${newStatus.toLowerCase()} ${vItem.testType}`, `${vItem.farmer} - ${vItem.tank}`);
  }
};

export const getActivities = () => currentActivities;
export const addActivity = (action, detail) => {
  currentActivities.unshift({
    id: Date.now(),
    action,
    detail,
    time: 'Just now'
  });
};

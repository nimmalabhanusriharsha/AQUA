// Core hierarchy data
export const adminRegions = [
  { id: 'REG01', name: 'Bhimavaram', incharges: 3, agents: 25, farmers: 820, tanks: 2450, compliance: 92, testsThisMonth: 12450, status: 'Active' },
  { id: 'REG02', name: 'Narsapur', incharges: 2, agents: 18, farmers: 610, tanks: 1920, compliance: 88, testsThisMonth: 8900, status: 'Active' },
  { id: 'REG03', name: 'Undi', incharges: 2, agents: 20, farmers: 710, tanks: 2180, compliance: 95, testsThisMonth: 11200, status: 'Active' },
  { id: 'REG04', name: 'Palakollu', incharges: 1, agents: 12, farmers: 350, tanks: 980, compliance: 81, testsThisMonth: 4200, status: 'Active' }
];

export const adminIncharges = [
  { id: 'INC001', name: 'Ravi Kumar', regionId: 'REG01', region: 'Bhimavaram', agents: 10, farmers: 320, tanks: 950, compliance: 94, status: 'Active' },
  { id: 'INC002', name: 'Suresh', regionId: 'REG01', region: 'Bhimavaram', agents: 8, farmers: 280, tanks: 800, compliance: 91, status: 'Active' },
  { id: 'INC003', name: 'Pranavi', regionId: 'REG01', region: 'Bhimavaram', agents: 7, farmers: 220, tanks: 700, compliance: 89, status: 'Active' },
  { id: 'INC004', name: 'Venkatesh', regionId: 'REG02', region: 'Narsapur', agents: 9, farmers: 300, tanks: 950, compliance: 87, status: 'Active' }
];

export const adminAgents = [
  { id: 'A001', name: 'Agent A', inchargeId: 'INC001', incharge: 'Ravi Kumar', region: 'Bhimavaram', locality: 'Chinnamiram', farmers: 45, tanks: 112, tests: 98, compliance: 87.5, status: 'Active' },
  { id: 'A002', name: 'Agent B', inchargeId: 'INC001', incharge: 'Ravi Kumar', region: 'Bhimavaram', locality: 'Undi', farmers: 52, tanks: 128, tests: 110, compliance: 85.9, status: 'Active' },
  { id: 'A003', name: 'Agent C', inchargeId: 'INC001', incharge: 'Ravi Kumar', region: 'Bhimavaram', locality: 'Akuruvu', farmers: 38, tanks: 98, tests: 92, compliance: 93.9, status: 'Active' },
  { id: 'A004', name: 'Agent D', inchargeId: 'INC002', incharge: 'Suresh', region: 'Bhimavaram', locality: 'Kalla', farmers: 40, tanks: 120, tests: 105, compliance: 90.0, status: 'Active' }
];

export const adminFarmers = [
  { id: 'F001', name: 'Ashok', agentId: 'A001', agent: 'Agent A', incharge: 'Ravi Kumar', region: 'Bhimavaram', phone: '9888888801', locality: 'Chinnamiram', village: 'Chinnamiram', acres: 25, tanks: 5, status: 'Active' },
  { id: 'F002', name: 'Ravi', agentId: 'A002', agent: 'Agent B', incharge: 'Ravi Kumar', region: 'Bhimavaram', phone: '9888888802', locality: 'Undi', village: 'Undi', acres: 20, tanks: 4, status: 'Active' },
  { id: 'F003', name: 'Kumar', agentId: 'A001', agent: 'Agent A', incharge: 'Ravi Kumar', region: 'Bhimavaram', phone: '9888888803', locality: 'Chinnamiram', village: 'Chinnamiram', acres: 18, tanks: 3, status: 'Active' },
  { id: 'F004', name: 'Ramesh', agentId: 'A003', agent: 'Agent C', incharge: 'Ravi Kumar', region: 'Bhimavaram', phone: '9888888804', locality: 'Akuruvu', village: 'Akuruvu', acres: 30, tanks: 6, status: 'Active' }
];

export const adminTanks = [
  { id: 'T001', name: 'Tank 1', farmerId: 'F001', farmer: 'Ashok', agent: 'Agent A', incharge: 'Ravi Kumar', region: 'Bhimavaram', currentCycle: 'Cycle 1 (2026)', abw: 12.5, biomass: 1500, feed: 1800, fcr: 1.2, compliance: 100, lastTest: '22 Aug 2026', nextDue: '29 Aug 2026' },
  { id: 'T002', name: 'Tank 2', farmerId: 'F001', farmer: 'Ashok', agent: 'Agent A', incharge: 'Ravi Kumar', region: 'Bhimavaram', currentCycle: 'Cycle 1 (2026)', abw: 15.0, biomass: 2100, feed: 2625, fcr: 1.25, compliance: 85, lastTest: '22 Aug 2026', nextDue: '29 Aug 2026' },
  { id: 'T003', name: 'Tank 1', farmerId: 'F002', farmer: 'Ravi', agent: 'Agent B', incharge: 'Ravi Kumar', region: 'Bhimavaram', currentCycle: 'Cycle 1 (2026)', abw: 8.5, biomass: 800, feed: 880, fcr: 1.1, compliance: 100, lastTest: '22 Aug 2026', nextDue: '29 Aug 2026' },
  { id: 'T004', name: 'Tank 1', farmerId: 'F004', farmer: 'Ramesh', agent: 'Agent C', incharge: 'Ravi Kumar', region: 'Bhimavaram', currentCycle: 'Cycle 1 (2026)', abw: 22.0, biomass: 3200, feed: 4480, fcr: 1.4, compliance: 90, lastTest: '21 Aug 2026', nextDue: '28 Aug 2026' }
];

// Historical Data arrays
export const adminActivities = [
  { id: 1, action: 'Incharge Ravi Kumar approved Water Analysis', detail: 'Ashok - Tank 2', time: '10 mins ago', module: 'Verifications', user: 'Ravi Kumar', role: 'Incharge', region: 'Bhimavaram' },
  { id: 2, action: 'Agent A submitted Feed Test', detail: 'Ravi - Tank 1', time: '25 mins ago', module: 'Field Data', user: 'Agent A', role: 'Agent', region: 'Bhimavaram' },
  { id: 3, action: 'Incharge Suresh allocated farmer', detail: 'Kumar', time: '45 mins ago', module: 'Allocations', user: 'Suresh', role: 'Incharge', region: 'Bhimavaram' },
  { id: 4, action: 'Admin viewed Region', detail: 'Narsapur', time: '1 hour ago', module: 'Monitoring', user: 'Admin', role: 'Admin', region: 'Organization' },
];

export const adminTrendData = [
  { name: '16 Aug', tests: 350 },
  { name: '17 Aug', tests: 620 },
  { name: '18 Aug', tests: 650 },
  { name: '19 Aug', tests: 520 },
  { name: '20 Aug', tests: 780 },
  { name: '21 Aug', tests: 620 },
  { name: '22 Aug', tests: 770 },
];

export const adminWeeklyCompliance = {
  completed: 72,
  due: 13,
  overdue: 5,
  notDue: 10
};

export const adminVerifications = [
  { id: 'V001', region: 'Bhimavaram', incharge: 'Ravi Kumar', agent: 'Agent A', farmer: 'Ashok', tank: 'Tank 2', testType: 'Water Analysis', submitted: '10 mins ago', status: 'Pending' },
  { id: 'V002', region: 'Bhimavaram', incharge: 'Ravi Kumar', agent: 'Agent B', farmer: 'Ravi', tank: 'Tank 1', testType: 'Feed Test', submitted: '25 mins ago', status: 'Approved' },
  { id: 'V003', region: 'Narsapur', incharge: 'Venkatesh', agent: 'Agent D', farmer: 'Suresh', tank: 'Tank 1', testType: 'Medication', submitted: '2 hours ago', status: 'Rejected' },
];

// Helper methods for relationships
export const getRegions = () => adminRegions;
export const getRegionById = (id) => adminRegions.find(r => r.id === id);

export const getIncharges = () => adminIncharges;
export const getInchargesByRegion = (regionId) => adminIncharges.filter(i => i.regionId === regionId);
export const getInchargeById = (id) => adminIncharges.find(i => i.id === id);

export const getAgents = () => adminAgents;
export const getAgentsByIncharge = (inchargeId) => adminAgents.filter(a => a.inchargeId === inchargeId);
export const getAgentById = (id) => adminAgents.find(a => a.id === id);

export const getFarmers = () => adminFarmers;
export const getFarmersByAgent = (agentId) => adminFarmers.filter(f => f.agentId === agentId);
export const getFarmerById = (id) => adminFarmers.find(f => f.id === id);

export const getTanks = () => adminTanks;
export const getTanksByFarmer = (farmerId) => adminTanks.filter(t => t.farmerId === farmerId);
export const getTankById = (id) => adminTanks.find(t => t.id === id);

export const getActivities = () => adminActivities;

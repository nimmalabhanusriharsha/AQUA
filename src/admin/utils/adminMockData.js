// Core hierarchy data aligned with Regional Command Center
export const adminRegions = [
  { 
    id: 'REG-SOUTH', 
    code: 'REG-SOUTH',
    name: 'South Andhra Region (Nellore/Prakasam)', 
    shortName: 'South Andhra',
    farmers: 3, 
    tanks: 6, 
    avgFcr: 1.40,
    compliance: 94, 
    incharges: 2, 
    agents: 6,
    status: 'Active',
    localities: [
      { id: 'LOC-01', name: 'Nellore Coastal Belt', fcr: 1.42, farmers: 1, tanks: 3 },
      { id: 'LOC-02', name: 'Kavali Delta', fcr: 1.46, farmers: 2, tanks: 3 }
    ]
  },
  { 
    id: 'REG-CENTRAL', 
    code: 'REG-CENTRAL',
    name: 'Central Andhra Region (Bhimavaram/Godavari)', 
    shortName: 'Central Andhra',
    farmers: 5, 
    tanks: 6, 
    avgFcr: 1.40,
    compliance: 91, 
    incharges: 3, 
    agents: 8,
    status: 'Active',
    localities: [
      { id: 'LOC-03', name: 'Bhimavaram Aqua Zone', fcr: 1.38, farmers: 3, tanks: 4 },
      { id: 'LOC-04', name: 'Kakinada Creek', fcr: 1.42, farmers: 2, tanks: 2 }
    ]
  }
];

export const adminIncharges = [
  { 
    id: 'EMP-INC-02', 
    name: 'M. Srinivas (Incharge - Bhimavaram)', 
    shortName: 'M. Srinivas',
    role: 'Incharge - Bhimavaram',
    regionId: 'REG-CENTRAL', 
    region: 'Central Andhra Region (Bhimavaram/Godavari)', 
    locality: 'Bhimavaram Aqua Zone',
    phone: '+91 9876543212',
    email: 'srinivas.inc@royalsmarine.com',
    agents: 2, 
    farmers: 3, 
    tanks: 4, 
    compliance: 94, 
    status: 'ACTIVE' 
  },
  { 
    id: 'EMP-INC-01', 
    name: 'K. V. Rajesh (Incharge - Nellore)', 
    shortName: 'K. V. Rajesh',
    role: 'Incharge - Nellore',
    regionId: 'REG-SOUTH', 
    region: 'South Andhra Region (Nellore/Prakasam)', 
    locality: 'Nellore Coastal Belt',
    phone: '+91 9876543211',
    email: 'rajesh.inc@royalsmarine.com',
    agents: 1, 
    farmers: 3, 
    tanks: 3, 
    compliance: 95, 
    status: 'ACTIVE' 
  }
];

export const adminAgents = [
  { 
    id: 'EMP-AGT-03', 
    name: 'Ch. Suresh (Field Agent - Kakinada)', 
    shortName: 'Ch. Suresh',
    role: 'Field Agent - Kakinada',
    inchargeId: 'EMP-INC-02', 
    incharge: 'M. Srinivas (Incharge - Bhimavaram)', 
    regionId: 'REG-CENTRAL',
    region: 'Central Andhra Region (Bhimavaram/Godavari)', 
    locality: 'Kakinada Creek', 
    phone: '+91 9876543215',
    email: 'suresh.agt@royalsmarine.com',
    farmers: 1, 
    tanks: 2, 
    siteVisits: 0, 
    tests: 34, 
    compliance: 90.0, 
    status: 'ACTIVE' 
  },
  { 
    id: 'EMP-AGT-02', 
    name: 'V. Kumar (Field Agent - Bhimavaram)', 
    shortName: 'V. Kumar',
    role: 'Field Agent - Bhimavaram',
    inchargeId: 'EMP-INC-02', 
    incharge: 'M. Srinivas (Incharge - Bhimavaram)', 
    regionId: 'REG-CENTRAL',
    region: 'Central Andhra Region (Bhimavaram/Godavari)', 
    locality: 'Bhimavaram Aqua Zone', 
    phone: '+91 9876543214',
    email: 'kumar.agt@royalsmarine.com',
    farmers: 2, 
    tanks: 2, 
    siteVisits: 0, 
    tests: 45, 
    compliance: 91.5, 
    status: 'ACTIVE' 
  },
  { 
    id: 'EMP-AGT-01', 
    name: 'P. Raju (Field Agent - Nellore)', 
    shortName: 'P. Raju',
    role: 'Field Agent - Nellore',
    inchargeId: 'EMP-INC-01', 
    incharge: 'K. V. Rajesh (Incharge - Nellore)', 
    regionId: 'REG-SOUTH',
    region: 'South Andhra Region (Nellore/Prakasam)', 
    locality: 'Nellore Coastal Belt', 
    phone: '+91 9876543213',
    email: 'raju.agt@royalsmarine.com',
    farmers: 3, 
    tanks: 6, 
    siteVisits: 8, 
    tests: 62, 
    compliance: 96.0, 
    status: 'ACTIVE' 
  }
];

export const adminFarmers = [
  { 
    id: 'FAR-349', 
    name: 'Imported Test Farmer 2', 
    agentId: 'EMP-AGT-02', 
    agent: 'V. Kumar (Field Agent - Bhimavaram)', 
    incharge: 'M. Srinivas (Incharge - Bhimavaram)', 
    region: 'Central Andhra Region (Bhimavaram/Godavari)', 
    locality: 'Bhimavaram Aqua Zone', 
    phone: '9876543298', 
    village: 'Kavali East', 
    acres: '4.5 Acres', 
    totalAcres: 4.5,
    tanks: 1, 
    tankBreakdown: [
      { id: 'T-349-1', name: 'Tank 1', acres: 4.5, doc: 45, abw: 12.5, fcr: 1.22, biomass: 1500 }
    ],
    status: 'Active' 
  },
  { 
    id: 'FAR-581', 
    name: 'Imported Test Farmer 1', 
    agentId: 'EMP-AGT-02', 
    agent: 'V. Kumar (Field Agent - Bhimavaram)', 
    incharge: 'M. Srinivas (Incharge - Bhimavaram)', 
    region: 'Central Andhra Region (Bhimavaram/Godavari)', 
    locality: 'Bhimavaram Aqua Zone', 
    phone: '9876543299', 
    village: 'Nellore North', 
    acres: '6.0 Acres', 
    totalAcres: 6.0,
    tanks: 1, 
    tankBreakdown: [
      { id: 'T-581-1', name: 'Tank 1', acres: 6.0, doc: 52, abw: 15.0, fcr: 1.25, biomass: 2100 }
    ],
    status: 'Active' 
  },
  { 
    id: 'FAR-006', 
    name: 'D. Prasad', 
    agentId: 'EMP-AGT-02', 
    agent: 'V. Kumar (Field Agent - Bhimavaram)', 
    incharge: 'M. Srinivas (Incharge - Bhimavaram)', 
    region: 'Central Andhra Region (Bhimavaram/Godavari)', 
    locality: 'Bhimavaram Aqua Zone', 
    phone: '+91 9440667788', 
    village: 'Akividu Aqua Belt', 
    acres: '4.0 Acres', 
    totalAcres: 4.0,
    tanks: 1, 
    tankBreakdown: [
      { id: 'T-006-1', name: 'Tank 1', acres: 4.0, doc: 30, abw: 8.5, fcr: 1.10, biomass: 800 }
    ],
    status: 'Active' 
  },
  { 
    id: 'FAR-005', 
    name: 'B. Nageswara Rao', 
    agentId: 'EMP-AGT-01', 
    agent: 'P. Raju (Field Agent - Nellore)', 
    incharge: 'K. V. Rajesh (Incharge - Nellore)', 
    region: 'South Andhra Region (Nellore/Prakasam)', 
    locality: 'Kavali Delta', 
    phone: '+91 9440556677', 
    village: 'Allur Village', 
    acres: '5.0 Acres', 
    totalAcres: 5.0,
    tanks: 1, 
    tankBreakdown: [
      { id: 'T-005-1', name: 'Tank 1', acres: 5.0, doc: 65, abw: 22.0, fcr: 1.40, biomass: 3200 }
    ],
    status: 'Active' 
  },
  { 
    id: 'FAR-004', 
    name: 'Ch. Satyanarayana', 
    agentId: 'EMP-AGT-03', 
    agent: 'Ch. Suresh (Field Agent - Kakinada)', 
    incharge: 'M. Srinivas (Incharge - Bhimavaram)', 
    region: 'Central Andhra Region (Bhimavaram/Godavari)', 
    locality: 'Kakinada Creek', 
    phone: '+91 9440445566', 
    village: 'Coringa Creek', 
    acres: '3.5 Acres', 
    totalAcres: 3.5,
    tanks: 1, 
    tankBreakdown: [
      { id: 'T-004-1', name: 'Tank 1', acres: 3.5, doc: 48, abw: 14.2, fcr: 1.35, biomass: 1800 }
    ],
    status: 'Active' 
  },
  { 
    id: 'FAR-003', 
    name: 'V. Subba Rao', 
    agentId: 'EMP-AGT-01', 
    agent: 'P. Raju (Field Agent - Nellore)', 
    incharge: 'K. V. Rajesh (Incharge - Nellore)', 
    region: 'South Andhra Region (Nellore/Prakasam)', 
    locality: 'Nellore Coastal Belt', 
    phone: '+91 9440334455', 
    village: 'Mypadu Coastal', 
    acres: '8.0 Acres', 
    totalAcres: 8.0,
    tanks: 3, 
    tankBreakdown: [
      { id: 'T-003-1', name: 'Tank 1', acres: 3.0, doc: 70, abw: 26.5, fcr: 1.35, biomass: 4200 },
      { id: 'T-003-2', name: 'Tank 2', acres: 2.5, doc: 55, abw: 18.0, fcr: 1.30, biomass: 2800 },
      { id: 'T-003-3', name: 'Tank 3', acres: 2.5, doc: 40, abw: 12.0, fcr: 1.25, biomass: 1600 }
    ],
    status: 'Active' 
  },
  { 
    id: 'FAR-002', 
    name: 'M. Srinivas', 
    agentId: 'EMP-AGT-01', 
    agent: 'P. Raju (Field Agent - Nellore)', 
    incharge: 'K. V. Rajesh (Incharge - Nellore)', 
    region: 'South Andhra Region (Nellore/Prakasam)', 
    locality: 'Kavali Delta', 
    phone: '+91 9440223344', 
    village: 'Kavali Rural', 
    acres: '6.0 Acres', 
    totalAcres: 6.0,
    tanks: 2, 
    tankBreakdown: [
      { id: 'T-002-1', name: 'Tank 1', acres: 3.0, doc: 60, abw: 20.5, fcr: 1.38, biomass: 3100 },
      { id: 'T-002-2', name: 'Tank 2', acres: 3.0, doc: 45, abw: 13.5, fcr: 1.28, biomass: 1900 }
    ],
    status: 'Active' 
  },
  { 
    id: 'FAR-001', 
    name: 'K. Venkat Rao', 
    agentId: 'EMP-AGT-03', 
    agent: 'Ch. Suresh (Field Agent - Kakinada)', 
    incharge: 'M. Srinivas (Incharge - Bhimavaram)', 
    region: 'Central Andhra Region (Bhimavaram/Godavari)', 
    locality: 'Kakinada Creek', 
    phone: '+91 9440112233', 
    village: 'Tallarevu', 
    acres: '5.0 Acres', 
    totalAcres: 5.0,
    tanks: 1, 
    tankBreakdown: [
      { id: 'T-001-1', name: 'Tank 1', acres: 5.0, doc: 50, abw: 16.0, fcr: 1.32, biomass: 2400 }
    ],
    status: 'Active' 
  }
];

export const adminTanks = [
  { id: 'T001', name: 'Tank 1', farmerId: 'FAR-349', farmer: 'Imported Test Farmer 2', agent: 'V. Raju', incharge: 'Ravi Kumar', region: 'Central Andhra Region (Bhimavaram/Godavari)', locality: 'Bhimavaram Aqua Zone', currentCycle: 'Cycle 1 (2026)', abw: 12.5, biomass: 1500, feed: 1800, fcr: 1.2, compliance: 100, lastTest: '22 Aug 2026', nextDue: '29 Aug 2026' },
  { id: 'T002', name: 'Tank 1', farmerId: 'FAR-581', farmer: 'Imported Test Farmer 1', agent: 'V. Raju', incharge: 'Ravi Kumar', region: 'Central Andhra Region (Bhimavaram/Godavari)', locality: 'Bhimavaram Aqua Zone', currentCycle: 'Cycle 1 (2026)', abw: 15.0, biomass: 2100, feed: 2625, fcr: 1.25, compliance: 85, lastTest: '22 Aug 2026', nextDue: '29 Aug 2026' },
  { id: 'T003', name: 'Tank 1', farmerId: 'FAR-006', farmer: 'D. Prasad', agent: 'V. Kumar (Field Agent - Bhimavaram)', incharge: 'Ravi Kumar', region: 'Central Andhra Region (Bhimavaram/Godavari)', locality: 'Bhimavaram Aqua Zone', currentCycle: 'Cycle 1 (2026)', abw: 8.5, biomass: 800, feed: 880, fcr: 1.1, compliance: 100, lastTest: '22 Aug 2026', nextDue: '29 Aug 2026' },
  { id: 'T004', name: 'Tank 1', farmerId: 'FAR-005', farmer: 'B. Nageswara Rao', agent: 'P. Raju (Field Agent - Nellore)', incharge: 'Pranavi', region: 'South Andhra Region (Nellore/Prakasam)', locality: 'Kavali Delta', currentCycle: 'Cycle 1 (2026)', abw: 22.0, biomass: 3200, feed: 4480, fcr: 1.4, compliance: 90, lastTest: '21 Aug 2026', nextDue: '28 Aug 2026' },
  { id: 'T005', name: 'Tank 1', farmerId: 'FAR-004', farmer: 'Ch. Satyanarayana', agent: 'Ch. Suresh (Field Agent - Kakinada)', incharge: 'Suresh', region: 'Central Andhra Region (Bhimavaram/Godavari)', locality: 'Kakinada Creek', currentCycle: 'Cycle 1 (2026)', abw: 14.2, biomass: 1800, feed: 2430, fcr: 1.35, compliance: 92, lastTest: '20 Aug 2026', nextDue: '27 Aug 2026' },
  { id: 'T006', name: 'Tank 1', farmerId: 'FAR-003', farmer: 'V. Subba Rao', agent: 'P. Raju (Field Agent - Nellore)', incharge: 'Pranavi', region: 'South Andhra Region (Nellore/Prakasam)', locality: 'Nellore Coastal Belt', currentCycle: 'Cycle 1 (2026)', abw: 26.5, biomass: 4200, feed: 5670, fcr: 1.35, compliance: 100, lastTest: '23 Aug 2026', nextDue: '30 Aug 2026' }
];

// Locality-wise FCR Efficiency Graph data
export const adminLocalityFcrData = [
  { locality: 'Nellore Coastal Belt', fcr: 1.42 },
  { locality: 'Kavali Delta', fcr: 1.46 },
  { locality: 'Bhimavaram Aqua Zone', fcr: 1.38 },
  { locality: 'Kakinada Creek', fcr: 1.42 }
];

export const adminActivities = [
  { id: 1, action: 'Incharge Ravi Kumar approved Water Analysis', detail: 'FAR-349 - Tank 1', time: '10 mins ago', module: 'Verifications', user: 'Ravi Kumar', role: 'Incharge', region: 'Central Andhra' },
  { id: 2, action: 'Agent V. Raju submitted Feed Test', detail: 'FAR-581 - Tank 1', time: '25 mins ago', module: 'Field Data', user: 'V. Raju', role: 'Agent', region: 'Central Andhra' },
  { id: 3, action: 'Incharge Pranavi allocated farmer', detail: 'B. Nageswara Rao', time: '45 mins ago', module: 'Allocations', user: 'Pranavi', role: 'Incharge', region: 'South Andhra' },
  { id: 4, action: 'Admin viewed Region', detail: 'South Andhra', time: '1 hour ago', module: 'Monitoring', user: 'Admin', role: 'Admin', region: 'Organization' }
];

export const adminTrendData = [
  { name: '16 Aug', tests: 350 },
  { name: '17 Aug', tests: 620 },
  { name: '18 Aug', tests: 650 },
  { name: '19 Aug', tests: 520 },
  { name: '20 Aug', tests: 780 },
  { name: '21 Aug', tests: 620 },
  { name: '22 Aug', tests: 770 }
];

export const adminWeeklyCompliance = {
  completed: 72,
  due: 13,
  overdue: 5,
  notDue: 10
};

export const adminVerifications = [
  { id: 'V001', region: 'Central Andhra Region', incharge: 'Ravi Kumar', agent: 'V. Raju', farmer: 'Imported Test Farmer 2', tank: 'Tank 1', testType: 'Water Analysis', submitted: '10 mins ago', status: 'Pending' },
  { id: 'V002', region: 'South Andhra Region', incharge: 'Pranavi', agent: 'P. Raju', farmer: 'B. Nageswara Rao', tank: 'Tank 1', testType: 'Feed Test', submitted: '25 mins ago', status: 'Approved' },
  { id: 'V003', region: 'Central Andhra Region', incharge: 'Suresh', agent: 'Ch. Suresh', farmer: 'Ch. Satyanarayana', tank: 'Tank 1', testType: 'Medication', submitted: '2 hours ago', status: 'Rejected' }
];

// Helper methods
export const getRegions = () => adminRegions;
export const getRegionById = (id) => adminRegions.find(r => r.id === id || r.code === id);

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

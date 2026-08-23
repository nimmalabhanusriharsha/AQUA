const AUTH_KEY = 'agent_auth_session';

const mockUsers = [
  { agentId: 'agent001', password: 'agent123', name: 'Agent A', region: 'Bhimavaram', locality: 'Chinnamiram' },
  { agentId: 'agent002', password: 'agent123', name: 'Agent B', region: 'Narasapuram', locality: 'West Godavari' },
  { agentId: 'admin', password: 'admin', name: 'System Admin', region: 'Head Office', locality: 'Main Branch' }
];

export const login = (agentId, password) => {
  const user = mockUsers.find(u => u.agentId === agentId && u.password === password);
  
  if (user) {
    const session = {
      agentId: user.agentId,
      name: user.name,
      region: user.region,
      locality: user.locality,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return { success: true, session };
  }
  
  return { success: false, error: 'Invalid Agent ID or Password' };
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(AUTH_KEY);
};

export const getSession = () => {
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
};

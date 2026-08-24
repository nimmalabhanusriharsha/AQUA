import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAgents, getIncharges, getRegions } from '../utils/adminMockData';
import { 
  Plus, Search, ArrowLeftRight, UserX, Check, X, 
  MapPin, Phone, Mail, ShieldAlert, UserCheck 
} from 'lucide-react';

const AgentsList = () => {
  const navigate = useNavigate();
  const regions = getRegions();
  const incharges = getIncharges();

  // Load agents from localStorage or fallback to mock data
  const [agents, setAgents] = useState(() => {
    const saved = localStorage.getItem('royal_admin_agents_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return getAgents();
      }
    }
    return getAgents();
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('royal_admin_agents_data', JSON.stringify(agents));
  }, [agents]);

  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const [selectedAgent, setSelectedAgent] = useState(null);

  // New Agent Form state
  const [newAgent, setNewAgent] = useState({
    name: '',
    roleSuffix: 'Field Agent - Kavali',
    phone: '+91 ',
    email: '',
    regionId: 'REG-SOUTH',
    locality: 'Kavali Delta',
    inchargeId: 'EMP-INC-01'
  });

  // Transfer Agent Form state
  const [transferData, setTransferData] = useState({
    regionId: 'REG-SOUTH',
    locality: 'Nellore Coastal Belt',
    inchargeId: 'EMP-INC-01',
    reason: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Search filter
  const filteredAgents = agents.filter(ag => {
    const term = searchTerm.toLowerCase();
    return (
      ag.name?.toLowerCase().includes(term) ||
      ag.id?.toLowerCase().includes(term) ||
      ag.phone?.includes(term) ||
      ag.email?.toLowerCase().includes(term) ||
      ag.incharge?.toLowerCase().includes(term) ||
      ag.region?.toLowerCase().includes(term) ||
      ag.locality?.toLowerCase().includes(term)
    );
  });

  // 1. Handle Add Agent
  const handleAddAgentSubmit = (e) => {
    e.preventDefault();
    if (!newAgent.name.trim()) return;

    const nextNumber = agents.length + 1;
    const newId = `EMP-AGT-${String(nextNumber).padStart(2, '0')}`;
    const selectedRegionObj = regions.find(r => r.id === newAgent.regionId) || regions[0];
    const selectedInchargeObj = incharges.find(i => i.id === newAgent.inchargeId) || incharges[0];

    const fullName = `${newAgent.name.trim()} (${newAgent.roleSuffix.trim()})`;

    const createdAgent = {
      id: newId,
      name: fullName,
      shortName: newAgent.name.trim(),
      role: newAgent.roleSuffix.trim(),
      inchargeId: selectedInchargeObj.id,
      incharge: selectedInchargeObj.name,
      regionId: selectedRegionObj.id,
      region: selectedRegionObj.name,
      locality: newAgent.locality,
      phone: newAgent.phone.trim(),
      email: newAgent.email.trim() || `${newAgent.name.trim().toLowerCase().replace(/\s+/g, '')}.agt@royalsmarine.com`,
      farmers: 1,
      tanks: 2,
      siteVisits: 0,
      tests: 12,
      compliance: 90.0,
      status: 'ACTIVE'
    };

    setAgents(prev => [createdAgent, ...prev]);
    showToast(`Field Agent ${createdAgent.name} added successfully!`);
    setShowAddModal(false);
    setNewAgent({
      name: '',
      roleSuffix: 'Field Agent - Kavali',
      phone: '+91 ',
      email: '',
      regionId: 'REG-SOUTH',
      locality: 'Kavali Delta',
      inchargeId: 'EMP-INC-01'
    });
  };

  // 2. Handle Transfer
  const openTransferModal = (ag) => {
    setSelectedAgent(ag);
    const targetRegion = regions.find(r => r.id !== ag.regionId) || regions[0];
    const targetIncharges = incharges.filter(i => i.regionId === targetRegion.id);
    const chosenIncharge = targetIncharges[0] || incharges[0];

    setTransferData({
      regionId: targetRegion.id,
      locality: targetRegion.localities?.[0]?.name || '',
      inchargeId: chosenIncharge.id,
      reason: ''
    });
    setShowTransferModal(true);
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!selectedAgent) return;

    const selectedRegionObj = regions.find(r => r.id === transferData.regionId);
    const selectedInchargeObj = incharges.find(i => i.id === transferData.inchargeId);
    if (!selectedRegionObj || !selectedInchargeObj) return;

    setAgents(prev => prev.map(ag => {
      if (ag.id === selectedAgent.id) {
        return {
          ...ag,
          regionId: selectedRegionObj.id,
          region: selectedRegionObj.name,
          locality: transferData.locality,
          inchargeId: selectedInchargeObj.id,
          incharge: selectedInchargeObj.name
        };
      }
      return ag;
    }));

    showToast(`Transferred ${selectedAgent.shortName || selectedAgent.name} to ${selectedRegionObj.shortName || selectedRegionObj.name} (${transferData.locality})`);
    setShowTransferModal(false);
    setSelectedAgent(null);
  };

  // 3. Handle Deactivate / Remove
  const openDeactivateModal = (ag) => {
    setSelectedAgent(ag);
    setShowDeactivateModal(true);
  };

  const handleToggleStatus = () => {
    if (!selectedAgent) return;

    const newStatus = selectedAgent.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setAgents(prev => prev.map(ag => {
      if (ag.id === selectedAgent.id) {
        return { ...ag, status: newStatus };
      }
      return ag;
    }));

    showToast(`${selectedAgent.name} marked as ${newStatus}`);
    setShowDeactivateModal(false);
    setSelectedAgent(null);
  };

  const handlePermanentRemove = () => {
    if (!selectedAgent) return;

    setAgents(prev => prev.filter(ag => ag.id !== selectedAgent.id));
    showToast(`Agent ${selectedAgent.name} removed from roster.`);
    setShowDeactivateModal(false);
    setSelectedAgent(null);
  };

  // Helpers for localities and incharges based on region
  const getLocalitiesForRegion = (regionId) => {
    const region = regions.find(r => r.id === regionId);
    return region?.localities || [];
  };

  const getInchargesForRegion = (regionId) => {
    return incharges.filter(i => i.regionId === regionId);
  };

  return (
    <div style={styles.container}>
      {/* 1. Top Command Header */}
      <div style={styles.topHeader}>
        <div>
          <h1 style={styles.mainTitle}>FIELD AGENTS MANAGEMENT</h1>
          <p style={styles.mainSubtitle}>
            Manage field agents, assigned farmers, incharge allocations, site visit counts, and status
          </p>
        </div>

        <div style={styles.topActions}>
          {/* Search Box */}
          <div style={styles.searchBox}>
            <Search size={16} color="#94a3b8" />
            <input 
              type="text"
              placeholder="Search agent, ID, incharge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} style={styles.clearSearchBtn}>
                ×
              </button>
            )}
          </div>

          {/* + ADD AGENT Button */}
          <button 
            style={styles.addBtn}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>ADD AGENT</span>
          </button>
        </div>
      </div>

      {/* 2. Main Field Agents Table Card */}
      <div style={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>AGENT NAME / ID</th>
                <th style={styles.th}>CONTACT</th>
                <th style={styles.th}>ASSIGNED INCHARGE</th>
                <th style={styles.th}>REGION &amp; LOCALITY</th>
                <th style={styles.th}>ASSIGNED FARMERS</th>
                <th style={styles.th}>SITE VISITS</th>
                <th style={styles.th}>STATUS</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.length > 0 ? (
                filteredAgents.map(ag => (
                  <tr key={ag.id} style={styles.tr}>
                    {/* Agent Name / ID */}
                    <td style={styles.td}>
                      <div style={styles.nameColumn}>
                        <span style={styles.agentName}>{ag.name}</span>
                        <span style={styles.empIdBadge}>{ag.id}</span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td style={styles.td}>
                      <div style={styles.contactColumn}>
                        <span style={styles.contactPhone}>{ag.phone}</span>
                        <span style={styles.contactEmail}>{ag.email}</span>
                      </div>
                    </td>

                    {/* Assigned Incharge */}
                    <td style={styles.td}>
                      <span style={styles.inchargeText}>
                        {ag.incharge}
                      </span>
                    </td>

                    {/* Region & Locality */}
                    <td style={styles.td}>
                      <div style={styles.regionColumn}>
                        <span style={styles.regionName}>{ag.region}</span>
                        <span style={styles.localityName}>{ag.locality}</span>
                      </div>
                    </td>

                    {/* Assigned Farmers */}
                    <td style={styles.td}>
                      <span style={styles.assignedFarmersText}>
                        {ag.farmers} Farmers
                      </span>
                    </td>

                    {/* Site Visits */}
                    <td style={styles.td}>
                      <span style={styles.siteVisitsText}>
                        {ag.siteVisits || 0} Visits
                      </span>
                    </td>

                    {/* Status */}
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: ag.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
                        color: ag.status === 'ACTIVE' ? '#16a34a' : '#dc2626'
                      }}>
                        {ag.status}
                      </span>
                    </td>

                    {/* Actions: Transfer & Deactivate */}
                    <td style={styles.td}>
                      <div style={styles.actionsGroup}>
                        <button 
                          style={styles.transferBtn}
                          onClick={() => openTransferModal(ag)}
                          title="Transfer to another Region or Locality"
                        >
                          <ArrowLeftRight size={13} />
                          <span>Transfer</span>
                        </button>

                        <button 
                          style={{
                            ...styles.deactivateBtn,
                            color: ag.status === 'ACTIVE' ? '#dc2626' : '#16a34a',
                            backgroundColor: ag.status === 'ACTIVE' ? '#fef2f2' : '#f0fdf4',
                            borderColor: ag.status === 'ACTIVE' ? '#fecaca' : '#bbf7d0'
                          }}
                          onClick={() => openDeactivateModal(ag)}
                          title={ag.status === 'ACTIVE' ? "Deactivate Agent" : "Reactivate Agent"}
                        >
                          <UserX size={13} />
                          <span>{ag.status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                    No field agents found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Modal: Add New Agent */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                Add New Field Agent
              </h3>
              <button onClick={() => setShowAddModal(false)} style={styles.modalCloseBtn}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAgentSubmit}>
              <div style={styles.modalBody}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={styles.modalLabel}>Agent Full Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. K. Mahesh"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                    style={styles.modalInput}
                    required
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={styles.modalLabel}>Role / Jurisdiction Suffix</label>
                  <input 
                    type="text"
                    placeholder="e.g. Field Agent - Kavali"
                    value={newAgent.roleSuffix}
                    onChange={(e) => setNewAgent({ ...newAgent, roleSuffix: e.target.value })}
                    style={styles.modalInput}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={styles.modalLabel}>Phone Number</label>
                    <input 
                      type="text"
                      placeholder="+91 9876543216"
                      value={newAgent.phone}
                      onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                      style={styles.modalInput}
                      required
                    />
                  </div>
                  <div>
                    <label style={styles.modalLabel}>Corporate Email</label>
                    <input 
                      type="email"
                      placeholder="mahesh.agt@royalsmarine.com"
                      value={newAgent.email}
                      onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                      style={styles.modalInput}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={styles.modalLabel}>Assigned Region</label>
                    <select 
                      style={styles.modalSelect}
                      value={newAgent.regionId}
                      onChange={(e) => {
                        const regId = e.target.value;
                        const locs = getLocalitiesForRegion(regId);
                        const incs = getInchargesForRegion(regId);
                        setNewAgent({ 
                          ...newAgent, 
                          regionId: regId, 
                          locality: locs[0]?.name || '',
                          inchargeId: incs[0]?.id || ''
                        });
                      }}
                    >
                      {regions.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={styles.modalLabel}>Assigned Locality</label>
                    <select 
                      style={styles.modalSelect}
                      value={newAgent.locality}
                      onChange={(e) => setNewAgent({ ...newAgent, locality: e.target.value })}
                    >
                      {getLocalitiesForRegion(newAgent.regionId).map(loc => (
                        <option key={loc.id} value={loc.name}>{loc.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={styles.modalLabel}>Reporting Incharge</label>
                  <select 
                    style={styles.modalSelect}
                    value={newAgent.inchargeId}
                    onChange={(e) => setNewAgent({ ...newAgent, inchargeId: e.target.value })}
                  >
                    {incharges.map(inc => (
                      <option key={inc.id} value={inc.id}>{inc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={styles.submitBtn}
                >
                  Create Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Transfer Agent */}
      {showTransferModal && selectedAgent && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                Transfer Field Agent
              </h3>
              <button onClick={() => setShowTransferModal(false)} style={styles.modalCloseBtn}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit}>
              <div style={styles.modalBody}>
                <div style={styles.transferCurrentBox}>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Current Agent Assignment</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{selectedAgent.name}</div>
                  <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
                    {selectedAgent.region} • {selectedAgent.locality}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Reports to: {selectedAgent.incharge}
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={styles.modalLabel}>New Destination Region</label>
                  <select 
                    style={styles.modalSelect}
                    value={transferData.regionId}
                    onChange={(e) => {
                      const regId = e.target.value;
                      const locs = getLocalitiesForRegion(regId);
                      const incs = getInchargesForRegion(regId);
                      setTransferData({ 
                        ...transferData, 
                        regionId: regId, 
                        locality: locs[0]?.name || '',
                        inchargeId: incs[0]?.id || ''
                      });
                    }}
                  >
                    {regions.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={styles.modalLabel}>New Jurisdiction Locality</label>
                  <select 
                    style={styles.modalSelect}
                    value={transferData.locality}
                    onChange={(e) => setTransferData({ ...transferData, locality: e.target.value })}
                  >
                    {getLocalitiesForRegion(transferData.regionId).map(loc => (
                      <option key={loc.id} value={loc.name}>{loc.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={styles.modalLabel}>New Reporting Incharge</label>
                  <select 
                    style={styles.modalSelect}
                    value={transferData.inchargeId}
                    onChange={(e) => setTransferData({ ...transferData, inchargeId: e.target.value })}
                  >
                    {incharges.map(inc => (
                      <option key={inc.id} value={inc.id}>{inc.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={styles.modalLabel}>Transfer Reason / Handover Notes</label>
                  <input 
                    type="text"
                    placeholder="e.g. Strategic re-allocation for Bhimavaram harvest cycle"
                    value={transferData.reason}
                    onChange={(e) => setTransferData({ ...transferData, reason: e.target.value })}
                    style={styles.modalInput}
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button 
                  type="button" 
                  onClick={() => setShowTransferModal(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ ...styles.submitBtn, backgroundColor: '#2563eb' }}
                >
                  Confirm &amp; Log Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Deactivate / Remove Agent */}
      {showDeactivateModal && selectedAgent && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={20} color="#dc2626" />
                Manage Agent Status
              </h3>
              <button onClick={() => setShowDeactivateModal(false)} style={styles.modalCloseBtn}>
                <X size={18} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                You are managing status for <strong>{selectedAgent.name}</strong> ({selectedAgent.id}) assigned to <em>{selectedAgent.incharge}</em> in <em>{selectedAgent.locality}</em>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={handleToggleStatus}
                  style={{
                    ...styles.actionModalBtn,
                    backgroundColor: selectedAgent.status === 'ACTIVE' ? '#fef2f2' : '#f0fdf4',
                    color: selectedAgent.status === 'ACTIVE' ? '#dc2626' : '#16a34a',
                    borderColor: selectedAgent.status === 'ACTIVE' ? '#fecaca' : '#bbf7d0'
                  }}
                >
                  {selectedAgent.status === 'ACTIVE' ? 'Deactivate Agent (Mark Inactive)' : 'Reactivate Agent (Mark Active)'}
                </button>

                <button 
                  onClick={handlePermanentRemove}
                  style={{
                    ...styles.actionModalBtn,
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    borderColor: '#fca5a5'
                  }}
                >
                  Permanently Delete from Roster
                </button>
              </div>
            </div>

            <div style={{ ...styles.modalFooter, marginTop: '20px' }}>
              <button 
                type="button" 
                onClick={() => setShowDeactivateModal(false)}
                style={styles.cancelBtn}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '14px'
  },
  mainTitle: {
    fontSize: '22px',
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-0.2px'
  },
  mainSubtitle: {
    fontSize: '13.5px',
    color: '#64748b',
    margin: '4px 0 0 0'
  },
  topActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '7px 12px',
    width: '260px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    fontSize: '13px',
    color: '#1e293b'
  },
  clearSearchBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '16px',
    padding: 0
  },
  addBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '9px 18px',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
    transition: 'background-color 0.15s',
    flexShrink: 0
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    padding: '16px 20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  theadRow: {
    borderBottom: '2px solid #e2e8f0'
  },
  th: {
    padding: '12px 14px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'background-color 0.15s',
    '&:hover': {
      backgroundColor: '#f8fafc'
    }
  },
  td: {
    padding: '16px 14px',
    verticalAlign: 'middle'
  },
  nameColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  agentName: {
    fontSize: '14.5px',
    fontWeight: 700,
    color: '#0f172a'
  },
  empIdBadge: {
    fontSize: '11.5px',
    fontWeight: 700,
    color: '#2563eb'
  },
  contactColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  contactPhone: {
    fontSize: '13.5px',
    fontWeight: 600,
    color: '#1e293b'
  },
  contactEmail: {
    fontSize: '12px',
    color: '#64748b'
  },
  inchargeText: {
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#0f172a'
  },
  regionColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  regionName: {
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#0f172a'
  },
  localityName: {
    fontSize: '12px',
    color: '#64748b'
  },
  assignedFarmersText: {
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#16a34a'
  },
  siteVisitsText: {
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#2563eb'
  },
  statusBadge: {
    fontSize: '11px',
    fontWeight: 800,
    padding: '3px 10px',
    borderRadius: '9999px',
    letterSpacing: '0.4px',
    display: 'inline-block'
  },
  actionsGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    alignItems: 'center'
  },
  transferBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    border: '1px solid #bfdbfe',
    borderRadius: '6px',
    padding: '5px 12px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    width: '105px',
    justifyContent: 'center',
    transition: 'all 0.15s'
  },
  deactivateBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    borderRadius: '6px',
    padding: '5px 12px',
    fontSize: '12px',
    fontWeight: 600,
    border: '1px solid transparent',
    cursor: 'pointer',
    width: '105px',
    justifyContent: 'center',
    transition: 'all 0.15s'
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
    width: '460px',
    maxWidth: '92vw',
    padding: '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px'
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer'
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column'
  },
  modalLabel: {
    display: 'block',
    fontSize: '12.5px',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '6px'
  },
  modalInput: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: '13.5px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  modalSelect: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: '13.5px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  transferCurrentBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: '10px',
    padding: '12px 14px',
    marginBottom: '16px',
    border: '1px solid #e2e8f0'
  },
  actionModalBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid transparent',
    fontSize: '13.5px',
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.15s'
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

export default AgentsList;

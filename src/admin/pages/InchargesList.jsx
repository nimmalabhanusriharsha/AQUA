import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIncharges, getRegions } from '../utils/adminMockData';
import { 
  Plus, Search, ArrowLeftRight, UserX, Check, X, 
  MapPin, Phone, Mail, ShieldAlert, UserCheck 
} from 'lucide-react';

const InchargesList = () => {
  const navigate = useNavigate();
  const regions = getRegions();

  // Load incharges from localStorage or initialize with mock data
  const [incharges, setIncharges] = useState(() => {
    const saved = localStorage.getItem('royal_admin_incharges_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return getIncharges();
      }
    }
    return getIncharges();
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('royal_admin_incharges_data', JSON.stringify(incharges));
  }, [incharges]);

  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const [selectedIncharge, setSelectedIncharge] = useState(null);

  // New Incharge Form
  const [newIncharge, setNewIncharge] = useState({
    name: '',
    roleSuffix: 'Incharge - Kakinada',
    phone: '+91 ',
    email: '',
    regionId: 'REG-CENTRAL',
    locality: 'Kakinada Creek'
  });

  // Transfer Form
  const [transferData, setTransferData] = useState({
    regionId: 'REG-SOUTH',
    locality: 'Kavali Delta',
    reason: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Filter incharges based on search term
  const filteredIncharges = incharges.filter(inc => {
    const term = searchTerm.toLowerCase();
    return (
      inc.name?.toLowerCase().includes(term) ||
      inc.id?.toLowerCase().includes(term) ||
      inc.phone?.includes(term) ||
      inc.email?.toLowerCase().includes(term) ||
      inc.region?.toLowerCase().includes(term) ||
      inc.locality?.toLowerCase().includes(term)
    );
  });

  // 1. Handle Add Incharge
  const handleAddInchargeSubmit = (e) => {
    e.preventDefault();
    if (!newIncharge.name.trim()) return;

    const nextNumber = incharges.length + 1;
    const newId = `EMP-INC-${String(nextNumber).padStart(2, '0')}`;
    const selectedRegionObj = regions.find(r => r.id === newIncharge.regionId) || regions[0];

    const fullName = `${newIncharge.name.trim()} (${newIncharge.roleSuffix.trim()})`;

    const createdIncharge = {
      id: newId,
      name: fullName,
      shortName: newIncharge.name.trim(),
      role: newIncharge.roleSuffix.trim(),
      regionId: selectedRegionObj.id,
      region: selectedRegionObj.name,
      locality: newIncharge.locality,
      phone: newIncharge.phone.trim(),
      email: newIncharge.email.trim() || `${newIncharge.name.trim().toLowerCase().replace(/\s+/g, '')}.inc@royalsmarine.com`,
      agents: 1,
      farmers: 2,
      tanks: 3,
      compliance: 92,
      status: 'ACTIVE'
    };

    setIncharges(prev => [createdIncharge, ...prev]);
    showToast(`Incharge ${createdIncharge.name} added successfully!`);
    setShowAddModal(false);
    setNewIncharge({
      name: '',
      roleSuffix: 'Incharge - Kakinada',
      phone: '+91 ',
      email: '',
      regionId: 'REG-CENTRAL',
      locality: 'Kakinada Creek'
    });
  };

  // 2. Handle Transfer
  const openTransferModal = (inc) => {
    setSelectedIncharge(inc);
    const targetRegion = regions.find(r => r.id !== inc.regionId) || regions[0];
    setTransferData({
      regionId: targetRegion.id,
      locality: targetRegion.localities?.[0]?.name || '',
      reason: ''
    });
    setShowTransferModal(true);
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!selectedIncharge) return;

    const selectedRegionObj = regions.find(r => r.id === transferData.regionId);
    if (!selectedRegionObj) return;

    setIncharges(prev => prev.map(inc => {
      if (inc.id === selectedIncharge.id) {
        return {
          ...inc,
          regionId: selectedRegionObj.id,
          region: selectedRegionObj.name,
          locality: transferData.locality
        };
      }
      return inc;
    }));

    showToast(`Transferred ${selectedIncharge.shortName || selectedIncharge.name} to ${selectedRegionObj.shortName || selectedRegionObj.name} (${transferData.locality})`);
    setShowTransferModal(false);
    setSelectedIncharge(null);
  };

  // 3. Handle Deactivate / Remove
  const openDeactivateModal = (inc) => {
    setSelectedIncharge(inc);
    setShowDeactivateModal(true);
  };

  const handleToggleStatus = () => {
    if (!selectedIncharge) return;

    const newStatus = selectedIncharge.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setIncharges(prev => prev.map(inc => {
      if (inc.id === selectedIncharge.id) {
        return { ...inc, status: newStatus };
      }
      return inc;
    }));

    showToast(`${selectedIncharge.name} marked as ${newStatus}`);
    setShowDeactivateModal(false);
    setSelectedIncharge(null);
  };

  const handlePermanentRemove = () => {
    if (!selectedIncharge) return;

    setIncharges(prev => prev.filter(inc => inc.id !== selectedIncharge.id));
    showToast(`Incharge ${selectedIncharge.name} removed from roster.`);
    setShowDeactivateModal(false);
    setSelectedIncharge(null);
  };

  // Helper for available localities in a selected region
  const getLocalitiesForRegion = (regionId) => {
    const region = regions.find(r => r.id === regionId);
    return region?.localities || [];
  };

  return (
    <div style={styles.container}>
      {/* 1. Top Command Header */}
      <div style={styles.topHeader}>
        <div>
          <h1 style={styles.mainTitle}>INCHARGE PERSONNEL MANAGEMENT</h1>
          <p style={styles.mainSubtitle}>
            Manage regional operations incharges, jurisdiction scopes, agent assignments, and transfer logs
          </p>
        </div>

        <div style={styles.topActions}>
          {/* Search Bar */}
          <div style={styles.searchBox}>
            <Search size={16} color="#94a3b8" />
            <input 
              type="text"
              placeholder="Search incharge, ID, region.."
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

          {/* + ADD INCHARGE button */}
          <button 
            style={styles.addBtn}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>ADD INCHARGE</span>
          </button>
        </div>
      </div>

      {/* 2. Main Incharges Table Card */}
      <div style={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>EMPLOYEE ID / NAME</th>
                <th style={styles.th}>CONTACT</th>
                <th style={styles.th}>REGION &amp; LOCALITY</th>
                <th style={styles.th}>AGENTS MANAGED</th>
                <th style={styles.th}>FARMERS SCOPE</th>
                <th style={styles.th}>STATUS</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncharges.length > 0 ? (
                filteredIncharges.map(inc => (
                  <tr key={inc.id} style={styles.tr}>
                    {/* Employee ID / Name */}
                    <td style={styles.td}>
                      <div style={styles.nameColumn}>
                        <span style={styles.inchargeName}>{inc.name}</span>
                        <span style={styles.empIdBadge}>{inc.id}</span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td style={styles.td}>
                      <div style={styles.contactColumn}>
                        <span style={styles.contactPhone}>{inc.phone}</span>
                        <span style={styles.contactEmail}>{inc.email}</span>
                      </div>
                    </td>

                    {/* Region & Locality */}
                    <td style={styles.td}>
                      <div style={styles.regionColumn}>
                        <span style={styles.regionName}>{inc.region}</span>
                        <span style={styles.localityName}>{inc.locality}</span>
                      </div>
                    </td>

                    {/* Agents Managed */}
                    <td style={styles.td}>
                      <span style={styles.agentsManagedText}>
                        {inc.agents} Agents
                      </span>
                    </td>

                    {/* Farmers Scope */}
                    <td style={styles.td}>
                      <span style={styles.farmersScopeText}>
                        {inc.farmers} Farmers
                      </span>
                    </td>

                    {/* Status */}
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: inc.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
                        color: inc.status === 'ACTIVE' ? '#16a34a' : '#dc2626'
                      }}>
                        {inc.status}
                      </span>
                    </td>

                    {/* Actions: Transfer & Deactivate */}
                    <td style={styles.td}>
                      <div style={styles.actionsGroup}>
                        <button 
                          style={styles.transferBtn}
                          onClick={() => openTransferModal(inc)}
                          title="Transfer to another Region or Locality"
                        >
                          <ArrowLeftRight size={13} />
                          <span>Transfer</span>
                        </button>

                        <button 
                          style={{
                            ...styles.deactivateBtn,
                            color: inc.status === 'ACTIVE' ? '#dc2626' : '#16a34a',
                            backgroundColor: inc.status === 'ACTIVE' ? '#fef2f2' : '#f0fdf4',
                            borderColor: inc.status === 'ACTIVE' ? '#fecaca' : '#bbf7d0'
                          }}
                          onClick={() => openDeactivateModal(inc)}
                          title={inc.status === 'ACTIVE' ? "Deactivate Incharge" : "Reactivate Incharge"}
                        >
                          <UserX size={13} />
                          <span>{inc.status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                    No incharges found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Modal: Add New Incharge */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                Add New Regional Incharge
              </h3>
              <button onClick={() => setShowAddModal(false)} style={styles.modalCloseBtn}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddInchargeSubmit}>
              <div style={styles.modalBody}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={styles.modalLabel}>Incharge Full Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. P. Suresh"
                    value={newIncharge.name}
                    onChange={(e) => setNewIncharge({ ...newIncharge, name: e.target.value })}
                    style={styles.modalInput}
                    required
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={styles.modalLabel}>Role / Jurisdiction Suffix</label>
                  <input 
                    type="text"
                    placeholder="e.g. Incharge - Kakinada"
                    value={newIncharge.roleSuffix}
                    onChange={(e) => setNewIncharge({ ...newIncharge, roleSuffix: e.target.value })}
                    style={styles.modalInput}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={styles.modalLabel}>Phone Number</label>
                    <input 
                      type="text"
                      placeholder="+91 9876543213"
                      value={newIncharge.phone}
                      onChange={(e) => setNewIncharge({ ...newIncharge, phone: e.target.value })}
                      style={styles.modalInput}
                      required
                    />
                  </div>
                  <div>
                    <label style={styles.modalLabel}>Corporate Email</label>
                    <input 
                      type="email"
                      placeholder="suresh.inc@royalsmarine.com"
                      value={newIncharge.email}
                      onChange={(e) => setNewIncharge({ ...newIncharge, email: e.target.value })}
                      style={styles.modalInput}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={styles.modalLabel}>Assigned Region</label>
                    <select 
                      style={styles.modalSelect}
                      value={newIncharge.regionId}
                      onChange={(e) => {
                        const regId = e.target.value;
                        const locs = getLocalitiesForRegion(regId);
                        setNewIncharge({ 
                          ...newIncharge, 
                          regionId: regId, 
                          locality: locs[0]?.name || '' 
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
                      value={newIncharge.locality}
                      onChange={(e) => setNewIncharge({ ...newIncharge, locality: e.target.value })}
                    >
                      {getLocalitiesForRegion(newIncharge.regionId).map(loc => (
                        <option key={loc.id} value={loc.name}>{loc.name}</option>
                      ))}
                    </select>
                  </div>
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
                  Create Incharge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Transfer Incharge */}
      {showTransferModal && selectedIncharge && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                Transfer Incharge Jurisdiction
              </h3>
              <button onClick={() => setShowTransferModal(false)} style={styles.modalCloseBtn}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit}>
              <div style={styles.modalBody}>
                <div style={styles.transferCurrentBox}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Current Assignment</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{selectedIncharge.name}</div>
                  <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
                    {selectedIncharge.region} • {selectedIncharge.locality}
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
                      setTransferData({ 
                        ...transferData, 
                        regionId: regId, 
                        locality: locs[0]?.name || '' 
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
                  <label style={styles.modalLabel}>Transfer Reason / Audit Notes</label>
                  <input 
                    type="text"
                    placeholder="e.g. Operational balancing for Kavali Delta season expansion"
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

      {/* 5. Modal: Deactivate / Remove Incharge */}
      {showDeactivateModal && selectedIncharge && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={20} color="#dc2626" />
                Manage Incharge Status
              </h3>
              <button onClick={() => setShowDeactivateModal(false)} style={styles.modalCloseBtn}>
                <X size={18} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                You are managing status for <strong>{selectedIncharge.name}</strong> ({selectedIncharge.id}) in <em>{selectedIncharge.region}</em>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={handleToggleStatus}
                  style={{
                    ...styles.actionModalBtn,
                    backgroundColor: selectedIncharge.status === 'ACTIVE' ? '#fef2f2' : '#f0fdf4',
                    color: selectedIncharge.status === 'ACTIVE' ? '#dc2626' : '#16a34a',
                    borderColor: selectedIncharge.status === 'ACTIVE' ? '#fecaca' : '#bbf7d0'
                  }}
                >
                  {selectedIncharge.status === 'ACTIVE' ? 'Deactivate Incharge (Mark Inactive)' : 'Reactivate Incharge (Mark Active)'}
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
  inchargeName: {
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
  agentsManagedText: {
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#2563eb'
  },
  farmersScopeText: {
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#16a34a'
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

export default InchargesList;

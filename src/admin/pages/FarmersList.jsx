import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFarmers, getRegions, getAgents, getIncharges } from '../utils/adminMockData';
import PageHeader from '../components/PageHeader';
import { 
  Search, Filter, Eye, Plus, Trash2, Check, X, 
  MapPin, Phone, User, ShieldAlert, Tractor, Layers 
} from 'lucide-react';

const FarmersList = () => {
  const navigate = useNavigate();
  const regions = getRegions();
  const allAgents = getAgents();
  const allIncharges = getIncharges();

  // Load farmers from localStorage or mock data
  const [farmers, setFarmers] = useState(() => {
    const saved = localStorage.getItem('royal_admin_farmers_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return getFarmers();
      }
    }
    return getFarmers();
  });

  // Save to localStorage whenever farmers change
  useEffect(() => {
    localStorage.setItem('royal_admin_farmers_data', JSON.stringify(farmers));
  }, [farmers]);

  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [tankFilter, setTankFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  // New Farmer Form State
  const [newFarmer, setNewFarmer] = useState({
    name: '',
    phone: '+91 ',
    regionId: 'REG-SOUTH',
    locality: 'Nellore Coastal Belt',
    village: '',
    agentId: 'EMP-AGT-01',
    waterSource: 'Creek / Estuary', // Source of Water
    tankCount: 1,
    tankSizes: [4.5] // array of numbers representing acres of each tank
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Helper to get localities for a region
  const getLocalitiesForRegion = (regionId) => {
    const region = regions.find(r => r.id === regionId);
    return region?.localities || [];
  };

  // Helper to get agents for a region
  const getAgentsForRegion = (regionId) => {
    return allAgents.filter(a => a.regionId === regionId);
  };

  // Handle Tank Count changes in form
  const handleTankCountChange = (count) => {
    const num = Math.max(1, Math.min(10, parseInt(count) || 1));
    const currentSizes = [...newFarmer.tankSizes];
    
    // Adjust array length
    if (num > currentSizes.length) {
      while (currentSizes.length < num) {
        currentSizes.push(3.0);
      }
    } else if (num < currentSizes.length) {
      currentSizes.length = num;
    }

    setNewFarmer({
      ...newFarmer,
      tankCount: num,
      tankSizes: currentSizes
    });
  };

  // Handle individual tank size changes
  const handleTankSizeChange = (index, value) => {
    const val = parseFloat(value) || 0;
    const updated = [...newFarmer.tankSizes];
    updated[index] = val;
    setNewFarmer({ ...newFarmer, tankSizes: updated });
  };

  // 1. Add Farmer Submit
  const handleAddFarmerSubmit = (e) => {
    e.preventDefault();
    if (!newFarmer.name.trim()) return;

    const nextNumber = farmers.length + 1;
    const newId = `FAR-${String(100 + nextNumber)}`;
    const selectedRegionObj = regions.find(r => r.id === newFarmer.regionId) || regions[0];
    const selectedAgentObj = allAgents.find(a => a.id === newFarmer.agentId) || allAgents[0];

    const totalAcresCalculated = newFarmer.tankSizes.reduce((acc, s) => acc + (parseFloat(s) || 0), 0);

    const tankBreakdown = newFarmer.tankSizes.map((size, idx) => ({
      id: `T-${newId}-${idx + 1}`,
      name: `Tank ${idx + 1}`,
      acres: parseFloat(size) || 0,
      waterSource: newFarmer.waterSource,
      doc: 35,
      abw: 14.0,
      fcr: 1.30,
      biomass: Math.round((parseFloat(size) || 0) * 800)
    }));

    const createdFarmer = {
      id: newId,
      name: newFarmer.name.trim(),
      phone: newFarmer.phone.trim(),
      region: selectedRegionObj.name,
      regionId: selectedRegionObj.id,
      locality: newFarmer.locality,
      village: newFarmer.village.trim() || `${newFarmer.locality} Village`,
      agentId: selectedAgentObj.id,
      agent: selectedAgentObj.name,
      incharge: selectedAgentObj.incharge,
      waterSource: newFarmer.waterSource,
      acres: `${totalAcresCalculated.toFixed(1)} Acres`,
      totalAcres: totalAcresCalculated,
      tanks: newFarmer.tankCount,
      tankBreakdown: tankBreakdown,
      status: 'Active'
    };

    setFarmers(prev => [createdFarmer, ...prev]);
    showToast(`Farmer ${createdFarmer.name} (${createdFarmer.id}) added successfully!`);
    setShowAddModal(false);

    // Reset Form
    setNewFarmer({
      name: '',
      phone: '+91 ',
      regionId: 'REG-SOUTH',
      locality: 'Nellore Coastal Belt',
      village: '',
      agentId: 'EMP-AGT-01',
      waterSource: 'Creek / Estuary',
      tankCount: 1,
      tankSizes: [4.5]
    });
  };

  // 2. Delete / Remove Farmer
  const openDeleteModal = (farmer) => {
    setSelectedFarmer(farmer);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedFarmer) return;

    setFarmers(prev => prev.filter(f => f.id !== selectedFarmer.id));
    showToast(`Farmer ${selectedFarmer.name} (${selectedFarmer.id}) removed from directory.`);
    setShowDeleteModal(false);
    setSelectedFarmer(null);
  };

  // Filter farmers
  const filtered = farmers.filter(f => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      f.name?.toLowerCase().includes(term) || 
      f.id?.toLowerCase().includes(term) ||
      f.village?.toLowerCase().includes(term) ||
      f.agent?.toLowerCase().includes(term) ||
      f.incharge?.toLowerCase().includes(term) ||
      f.region?.toLowerCase().includes(term) ||
      f.phone?.includes(term) ||
      (f.locality && f.locality.toLowerCase().includes(term));

    const matchesRegion = regionFilter === 'ALL' || f.region?.includes(regionFilter);
    const matchesTank = 
      tankFilter === 'ALL' || 
      (tankFilter === '1' && f.tanks === 1) || 
      (tankFilter === 'MULTI' && f.tanks > 1);

    return matchesSearch && matchesRegion && matchesTank;
  });

  // Calculate totals
  const totalFarmersCount = farmers.length;
  const totalTanksCount = farmers.reduce((acc, f) => acc + (f.tanks || 1), 0);
  const totalAcresCount = farmers.reduce((acc, f) => acc + (f.totalAcres || parseFloat(f.acres) || 0), 0);

  return (
    <div style={styles.container}>
      {/* Top Header Row with Page Title + Action Button */}
      <div style={styles.topHeader}>
        <div>
          <PageHeader 
            title="All Farmers Directory" 
            breadcrumbs={[{ label: 'Organization' }, { label: 'Farmers', active: true }]} 
          />
        </div>
        <button 
          style={styles.addFarmerBtn}
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>ADD NEW FARMER</span>
        </button>
      </div>

      {/* Summary Stat Chips Bar */}
      <div style={styles.summaryBar}>
        <div style={styles.summaryChip}>
          <span style={styles.chipLabel}>TOTAL FARMERS</span>
          <span style={styles.chipValue}>{totalFarmersCount}</span>
        </div>
        <div style={styles.summaryChip}>
          <span style={styles.chipLabel}>TOTAL ACTIVE TANKS</span>
          <span style={{ ...styles.chipValue, color: '#2563eb' }}>{totalTanksCount} Tanks</span>
        </div>
        <div style={styles.summaryChip}>
          <span style={styles.chipLabel}>TOTAL CULTIVATED LAND</span>
          <span style={{ ...styles.chipValue, color: '#16a34a' }}>{totalAcresCount.toFixed(1)} Acres</span>
        </div>
      </div>

      <div style={styles.card}>
        {/* Search & Filter Bar */}
        <div style={styles.filterBar}>
          <div style={styles.searchBox}>
            <Search size={16} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search by farmer name, ID, village, agent, incharge..." 
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

          <div style={styles.filterGroup}>
            <select 
              value={regionFilter} 
              onChange={(e) => setRegionFilter(e.target.value)}
              style={styles.selectFilter}
            >
              <option value="ALL">All Regions</option>
              <option value="South Andhra">South Andhra</option>
              <option value="Central Andhra">Central Andhra</option>
            </select>

            <select 
              value={tankFilter} 
              onChange={(e) => setTankFilter(e.target.value)}
              style={styles.selectFilter}
            >
              <option value="ALL">All Tank Counts</option>
              <option value="1">Single Tank (1)</option>
              <option value="MULTI">Multiple Tanks (2+)</option>
            </select>
          </div>
        </div>

        {/* Farmers Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>FARMER NAME / ID</th>
                <th style={styles.th}>VILLAGE &amp; LOCALITY</th>
                <th style={styles.th}>AGENT &amp; INCHARGE</th>
                <th style={styles.th}>REGION</th>
                <th style={styles.th}>TOTAL ACRES</th>
                <th style={styles.th}>TOTAL TANKS &amp; SPREAD PER TANK</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item) => {
                  const totalAcresVal = item.totalAcres || parseFloat(item.acres) || 0;
                  const avgPerTank = (totalAcresVal / (item.tanks || 1)).toFixed(2);

                  return (
                    <tr key={item.id} style={styles.tr}>
                      {/* Farmer Name & ID */}
                      <td style={styles.td}>
                        <div 
                          style={{ display: 'flex', flexDirection: 'column', gap: '3px', cursor: 'pointer' }}
                          onClick={() => navigate(`/admin/farmers/${item.id}`)}
                          title="Click to view Tank Growth Graphs"
                        >
                          <span style={styles.farmerName}>{item.name}</span>
                          <span style={styles.farmerId}>{item.id}</span>
                        </div>
                      </td>

                      {/* Village & Locality */}
                      <td style={styles.td}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span style={styles.villageText}>{item.village}</span>
                          <span style={styles.localityText}>{item.locality}</span>
                        </div>
                      </td>

                      {/* Agent & Incharge */}
                      <td style={styles.td}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span style={styles.agentText}>{item.agent}</span>
                          <span style={styles.inchargeText}>Incharge: {item.incharge}</span>
                        </div>
                      </td>

                      {/* Region */}
                      <td style={styles.td}>
                        <span style={styles.regionText}>{item.region}</span>
                      </td>

                      {/* Total Acres */}
                      <td style={styles.td}>
                        <span style={styles.acresBadge}>
                          {item.acres}
                        </span>
                      </td>

                      {/* Total Tanks & No. of Acres Each Tank is Spreaded */}
                      <td style={styles.td}>
                        <div 
                          style={{ ...styles.tanksContainer, cursor: 'pointer' }}
                          onClick={() => navigate(`/admin/farmers/${item.id}`)}
                          title="Click to view Tank Growth Graphs"
                        >
                          {/* Tank count tag */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{
                              ...styles.tanksCountBadge,
                              backgroundColor: item.tanks > 1 ? '#eff6ff' : '#f0fdf4',
                              color: item.tanks > 1 ? '#2563eb' : '#16a34a',
                              borderColor: item.tanks > 1 ? '#bfdbfe' : '#bbf7d0'
                            }}>
                              {item.tanks} {item.tanks > 1 ? 'Tanks' : 'Tank'}
                            </span>
                            <span style={styles.avgSpreadText}>
                              {item.tanks > 1 ? `(Avg: ${avgPerTank} Ac/Tank)` : `(${totalAcresVal} Ac spread)`}
                            </span>
                          </div>

                          {/* Individual Tank Acreage Spread Breakdown */}
                          <div style={styles.tankBreakdownList}>
                            {item.tankBreakdown && item.tankBreakdown.length > 0 ? (
                              item.tankBreakdown.map((t, idx) => (
                                <span key={t.id || idx} style={styles.tankSpreadChip}>
                                  <strong style={{ color: '#1e293b' }}>{t.name}:</strong> {t.acres} Ac
                                </span>
                              ))
                            ) : (
                              <span style={styles.tankSpreadChip}>
                                <strong style={{ color: '#1e293b' }}>Tank 1:</strong> {item.acres}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Actions: View Growth & Delete */}
                      <td style={styles.td}>
                        <div style={styles.actionBtnGroup}>
                          <button 
                            style={styles.viewBtn}
                            onClick={() => navigate(`/admin/farmers/${item.id}`)}
                            title="View Tank Growth Graphs & Performance"
                          >
                            <Eye size={13} />
                            <span>View Growth</span>
                          </button>

                          <button 
                            style={styles.deleteBtn}
                            onClick={() => openDeleteModal(item)}
                            title="Remove Farmer from Directory"
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                    No farmers found matching current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New Farmer */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tractor size={20} color="#2563eb" />
                Add New Aquaculture Farmer
              </h3>
              <button onClick={() => setShowAddModal(false)} style={styles.modalCloseBtn}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddFarmerSubmit}>
              <div style={styles.modalBody}>
                {/* Name & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={styles.modalLabel}>Farmer Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. K. Venkateswara Rao" 
                      value={newFarmer.name}
                      onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
                      style={styles.modalInput}
                      required
                    />
                  </div>
                  <div>
                    <label style={styles.modalLabel}>Phone Number *</label>
                    <input 
                      type="text" 
                      placeholder="+91 9440123456" 
                      value={newFarmer.phone}
                      onChange={(e) => setNewFarmer({ ...newFarmer, phone: e.target.value })}
                      style={styles.modalInput}
                      required
                    />
                  </div>
                </div>

                {/* Region & Locality */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={styles.modalLabel}>Region</label>
                    <select 
                      style={styles.modalSelect}
                      value={newFarmer.regionId}
                      onChange={(e) => {
                        const regId = e.target.value;
                        const locs = getLocalitiesForRegion(regId);
                        const agts = getAgentsForRegion(regId);
                        setNewFarmer({
                          ...newFarmer,
                          regionId: regId,
                          locality: locs[0]?.name || '',
                          agentId: agts[0]?.id || ''
                        });
                      }}
                    >
                      {regions.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={styles.modalLabel}>Locality</label>
                    <select 
                      style={styles.modalSelect}
                      value={newFarmer.locality}
                      onChange={(e) => setNewFarmer({ ...newFarmer, locality: e.target.value })}
                    >
                      {getLocalitiesForRegion(newFarmer.regionId).map(loc => (
                        <option key={loc.id} value={loc.name}>{loc.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Village & Assigned Field Agent */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={styles.modalLabel}>Village Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mypadu Coastal" 
                      value={newFarmer.village}
                      onChange={(e) => setNewFarmer({ ...newFarmer, village: e.target.value })}
                      style={styles.modalInput}
                    />
                  </div>
                  <div>
                    <label style={styles.modalLabel}>Assigned Field Agent</label>
                    <select 
                      style={styles.modalSelect}
                      value={newFarmer.agentId}
                      onChange={(e) => setNewFarmer({ ...newFarmer, agentId: e.target.value })}
                    >
                      {getAgentsForRegion(newFarmer.regionId).map(ag => (
                        <option key={ag.id} value={ag.id}>{ag.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Source of Water & Number of Tanks */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={styles.modalLabel}>Source of Water *</label>
                    <select 
                      style={styles.modalSelect}
                      value={newFarmer.waterSource}
                      onChange={(e) => setNewFarmer({ ...newFarmer, waterSource: e.target.value })}
                    >
                      <option value="Creek / Estuary">Creek / Estuary</option>
                      <option value="Sea / Coastal Canal">Sea / Coastal Canal</option>
                      <option value="Borewell / Ground Water">Borewell / Ground Water</option>
                      <option value="River / Freshwater Canal">River / Freshwater Canal</option>
                      <option value="Reservoir / Agricultural Canal">Reservoir / Agricultural Canal</option>
                      <option value="Other">Other Source</option>
                    </select>
                  </div>
                  <div>
                    <label style={styles.modalLabel}>Number of Cultivated Tanks</label>
                    <select 
                      style={styles.modalSelect}
                      value={newFarmer.tankCount}
                      onChange={(e) => handleTankCountChange(e.target.value)}
                    >
                      <option value="1">1 Tank</option>
                      <option value="2">2 Tanks</option>
                      <option value="3">3 Tanks</option>
                      <option value="4">4 Tanks</option>
                      <option value="5">5 Tanks</option>
                    </select>
                  </div>
                </div>

                {/* Dynamic Tank Acreage Inputs */}
                <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                  <label style={{ ...styles.modalLabel, color: '#0f172a', fontWeight: 700, marginBottom: '8px' }}>
                    Tank Acreage Spread Allocation (Acres per Tank)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(newFarmer.tankCount, 3)}, 1fr)`, gap: '10px' }}>
                    {newFarmer.tankSizes.map((size, index) => (
                      <div key={index}>
                        <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Tank {index + 1} (Acres)</label>
                        <input 
                          type="number" 
                          step="0.1" 
                          min="0.1" 
                          value={size}
                          onChange={(e) => handleTankSizeChange(index, e.target.value)}
                          style={{ ...styles.modalInput, marginTop: '2px' }}
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#2563eb', fontWeight: 700 }}>
                    Total Cultivated Spread: {newFarmer.tankSizes.reduce((a, b) => a + (parseFloat(b) || 0), 0).toFixed(1)} Acres
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
                  Create Farmer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete / Remove Farmer Confirmation */}
      {showDeleteModal && selectedFarmer && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={20} color="#dc2626" />
                Remove Farmer Record
              </h3>
              <button onClick={() => setShowDeleteModal(false)} style={styles.modalCloseBtn}>
                <X size={18} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                Are you sure you want to permanently remove <strong>{selectedFarmer.name}</strong> ({selectedFarmer.id}) from the directory?
              </p>

              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#991b1b', fontWeight: 600 }}>
                  • Region: {selectedFarmer.region} ({selectedFarmer.locality})
                </div>
                <div style={{ fontSize: '12px', color: '#991b1b', fontWeight: 600, marginTop: '4px' }}>
                  • Total Land: {selectedFarmer.acres} across {selectedFarmer.tanks} Tank(s)
                </div>
                <div style={{ fontSize: '12px', color: '#991b1b', fontWeight: 600, marginTop: '4px' }}>
                  • Assigned Agent: {selectedFarmer.agent}
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button 
                type="button" 
                onClick={() => setShowDeleteModal(false)}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleConfirmDelete}
                style={{ ...styles.submitBtn, backgroundColor: '#dc2626' }}
              >
                Confirm Delete
              </button>
            </div>
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
    gap: '16px',
    maxWidth: '1380px',
    margin: '0 auto'
  },
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px'
  },
  addFarmerBtn: {
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
  summaryBar: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap'
  },
  summaryChip: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '10px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
  },
  chipLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.4px'
  },
  chipValue: {
    fontSize: '16px',
    fontWeight: 800,
    color: '#0f172a'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '8px 12px',
    width: '380px'
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
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  selectFilter: {
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '7px 12px',
    fontSize: '13px',
    color: '#334155',
    outline: 'none',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  theadRow: {
    borderBottom: '2px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  },
  th: {
    padding: '12px 14px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.4px'
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'background-color 0.15s',
    '&:hover': {
      backgroundColor: '#f8fafc'
    }
  },
  td: {
    padding: '14px',
    verticalAlign: 'middle',
    fontSize: '13px',
    color: '#334155'
  },
  farmerName: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#0f172a'
  },
  farmerId: {
    fontSize: '11.5px',
    fontWeight: 700,
    color: '#2563eb'
  },
  villageText: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#1e293b'
  },
  localityText: {
    fontSize: '12px',
    color: '#64748b'
  },
  agentText: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#0f172a'
  },
  inchargeText: {
    fontSize: '11.5px',
    color: '#64748b'
  },
  regionText: {
    fontSize: '12.5px',
    fontWeight: 500,
    color: '#334155',
    lineHeight: '1.3'
  },
  acresBadge: {
    fontSize: '13.5px',
    fontWeight: 800,
    color: '#0f172a'
  },
  tanksContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  tanksCountBadge: {
    fontSize: '11.5px',
    fontWeight: 800,
    padding: '2px 8px',
    borderRadius: '6px',
    border: '1px solid',
    letterSpacing: '0.3px',
    display: 'inline-block'
  },
  avgSpreadText: {
    fontSize: '11.5px',
    fontWeight: 600,
    color: '#64748b'
  },
  tankBreakdownList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px'
  },
  tankSpreadChip: {
    fontSize: '11px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '2px 7px',
    borderRadius: '5px',
    border: '1px solid #e2e8f0'
  },
  actionBtnGroup: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center'
  },
  viewBtn: {
    display: 'inline-flex',
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
    transition: 'all 0.15s'
  },
  deleteBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    padding: '5px 12px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
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
    width: '480px',
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
    marginTop: '16px'
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

export default FarmersList;

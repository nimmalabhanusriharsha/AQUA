import React, { useState, useEffect } from 'react';
import InchargeHeader from '../components/InchargeHeader';
import { getFarmers, addFarmer } from '../utils/mockData';
import { Search, Filter, Eye, X } from 'lucide-react';

const Farmers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [farmers, setFarmers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [farmerName, setFarmerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [areaMandal, setAreaMandal] = useState('');
  const [village, setVillage] = useState('');
  const [totalLandArea, setTotalLandArea] = useState('');
  const [waterSource, setWaterSource] = useState('');
  const [numberOfTanks, setNumberOfTanks] = useState('');

  useEffect(() => {
    setFarmers(getFarmers());
  }, []);

  const filteredFarmers = farmers.filter(farmer => 
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.locality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFarmer = (e) => {
    e.preventDefault();
    if (!farmerName || !phoneNumber || !numberOfTanks) return;

    addFarmer({
      name: farmerName,
      phone: phoneNumber,
      locality: village || areaMandal || 'Unknown',
      acres: totalLandArea || 0,
      tanks: numberOfTanks
    });

    // Refresh list
    setFarmers([...getFarmers()]);
    
    // Reset and close
    setFarmerName('');
    setPhoneNumber('');
    setAreaMandal('');
    setVillage('');
    setTotalLandArea('');
    setWaterSource('');
    setNumberOfTanks('');
    setIsModalOpen(false);
  };

  return (
    <>
      <InchargeHeader title="Farmers Management" />
      <div className="content-inner">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', flex: 1, maxWidth: '500px' }}>
              <div className="input-field" style={{ flex: 1, margin: 0, padding: '8px 12px' }}>
                <Search size={18} color="var(--color-text-muted)" />
                <input 
                  type="text" 
                  placeholder="Search farmers..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                padding: '8px 16px', backgroundColor: 'white', 
                border: '1px solid var(--color-border)', borderRadius: '8px',
                cursor: 'pointer'
              }}>
                <Filter size={18} />
                Filter
              </button>
            </div>
            <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => setIsModalOpen(true)}>
              + Add Farmer
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Farmer Name</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Phone</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Locality</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Acres</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Tanks</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Assigned Agent</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Last Test</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFarmers.map((farmer) => (
                  <tr key={farmer.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px', fontWeight: 500 }}>{farmer.name}</td>
                    <td style={{ padding: '16px', color: 'var(--color-text-muted)', fontSize: '14px' }}>{farmer.phone}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{farmer.locality}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{farmer.acres}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{farmer.tanks}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{farmer.agent}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--color-text-muted)' }}>{farmer.lastTest}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                        backgroundColor: farmer.status === 'Active' ? '#dcfce7' : '#f1f5f9',
                        color: farmer.status === 'Active' ? 'var(--status-green)' : 'var(--color-text-muted)'
                      }}>
                        {farmer.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}>
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredFarmers.length === 0 && (
                  <tr>
                    <td colSpan="9" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No farmers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Farmer Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Add New Farmer</h2>
            
            <form onSubmit={handleAddFarmer}>
              <div className="input-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Farmer Name *</label>
                <div className="input-field" style={{ backgroundColor: '#f1f5f9' }}>
                  <input type="text" placeholder="e.g. Ramesh Kumar" required value={farmerName} onChange={e => setFarmerName(e.target.value)} />
                </div>
              </div>
              
              <div className="input-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Phone Number *</label>
                <div className="input-field" style={{ backgroundColor: '#f1f5f9' }}>
                  <input type="tel" placeholder="e.g. +91 9876543210" required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                </div>
              </div>

              <div className="grid md:grid-cols-2" style={{ gap: '16px' }}>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Area / Mandal</label>
                  <div className="input-field" style={{ backgroundColor: '#f1f5f9' }}>
                    <input type="text" placeholder="e.g. Bhimavaram" value={areaMandal} onChange={e => setAreaMandal(e.target.value)} />
                  </div>
                </div>

                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Village</label>
                  <div className="input-field" style={{ backgroundColor: '#f1f5f9' }}>
                    <input type="text" placeholder="e.g. Chinnamiram" value={village} onChange={e => setVillage(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2" style={{ gap: '16px' }}>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Total Land Area (Acres)</label>
                  <div className="input-field" style={{ backgroundColor: '#f1f5f9' }}>
                    <input type="number" step="0.01" placeholder="e.g. 5" value={totalLandArea} onChange={e => setTotalLandArea(e.target.value)} />
                  </div>
                </div>

                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Number of Tanks *</label>
                  <div className="input-field" style={{ backgroundColor: '#f1f5f9' }}>
                    <input type="number" placeholder="e.g. 2" required value={numberOfTanks} onChange={e => setNumberOfTanks(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Water Source</label>
                <select 
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: '#f1f5f9', fontSize: '14px', outline: 'none' }}
                  value={waterSource} 
                  onChange={e => setWaterSource(e.target.value)}
                >
                  <option value="">Select Source</option>
                  <option value="Canal">Canal</option>
                  <option value="Borewell">Borewell</option>
                  <option value="River">River</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Farmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Farmers;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, UserPlus } from 'lucide-react';

const AddFarmer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: '',
    village: '',
    acres: '',
    numberOfTanks: '1',
    waterSource: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.numberOfTanks) {
      alert('Please fill out the required fields (Name, Phone, Number of Tanks).');
      return;
    }
    // Navigate to Add Tanks step, passing the form data in router state
    navigate('/add-tanks', { state: { farmerData: formData } });
  };

  return (
    <div>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="card">
        <div style={styles.cardHeader}>
          <div style={styles.iconCircle}>
            <UserPlus size={24} color="var(--color-primary)" />
          </div>
          <div>
            <h2 style={styles.title}>Add New Farmer</h2>
            <div style={styles.subtitle}>Step 1: Farmer Details</div>
          </div>
        </div>

        <form onSubmit={handleNext}>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="input-group">
              <label style={styles.label}>Farmer Name *</label>
              <div className="input-field">
                <input 
                  type="text" 
                  name="name"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="input-group">
              <label style={styles.label}>Phone Number *</label>
              <div className="input-field">
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label style={styles.label}>Area / Mandal</label>
              <div className="input-field">
                <input 
                  type="text" 
                  name="area"
                  placeholder="e.g. Bhimavaram"
                  value={formData.area}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label style={styles.label}>Village</label>
              <div className="input-field">
                <input 
                  type="text" 
                  name="village"
                  placeholder="e.g. Chinnamiram"
                  value={formData.village}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label style={styles.label}>Total Land Area (Acres)</label>
              <div className="input-field">
                <input 
                  type="number" 
                  name="acres"
                  placeholder="e.g. 5"
                  value={formData.acres}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label style={styles.label}>Water Source</label>
              <div className="input-field">
                <select name="waterSource" value={formData.waterSource} onChange={handleChange}>
                  <option value="">Select Source</option>
                  <option value="Borewell">Borewell</option>
                  <option value="Canal">Canal</option>
                  <option value="River">River</option>
                  <option value="Creek">Creek</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label style={styles.label}>Number of Tanks *</label>
              <div className="input-field">
                <input 
                  type="number" 
                  name="numberOfTanks"
                  min="1"
                  max="20"
                  value={formData.numberOfTanks}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div style={styles.footer}>
            <button type="submit" className="btn-primary">
              Next – Add Tanks <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  header: { display: 'flex', alignItems: 'center', marginBottom: '20px' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--color-text-main)', fontWeight: '600', cursor: 'pointer', fontSize: '15px' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' },
  iconCircle: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: '20px', fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '4px' },
  subtitle: { fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: '600' },
  label: { fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '8px', display: 'block' },
  footer: { marginTop: '24px', borderTop: '1px solid var(--color-border)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }
};

export default AddFarmer;

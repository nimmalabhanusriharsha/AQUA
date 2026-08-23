import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Save, Send, MapPin, AlertTriangle, Droplet, Fish, Pill, Bug, Ship, ChevronRight, Check } from 'lucide-react';
import { useMockData } from '../../context/MockDataContext';
import { getSession } from '../utils/agentAuth';

const STEPS = [
  'GPS Verification',
  'Water Quality',
  'Feed',
  'Medication',
  'Disease',
  'Harvest',
  'Review'
];

const DISEASE_OPTIONS = [
  'White muscle', 'White gut', 'Moulting', 'Cramping', 
  'Black gill', 'Vibriosis', 'EHP', 'Hard shell', 
  'Soft shell', 'Black spots', 'ASDS', 'WSSV', 
  'Loose shell', 'Other'
];

const SiteVisit = () => {
  const { tankId } = useParams();
  const navigate = useNavigate();
  const [tank, setTank] = useState(null);
  const [session, setSession] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const { getTankById, getDraft, saveDraft, submitRecord } = useMockData();
  
  // GPS State
  const [gpsStatus, setGpsStatus] = useState('pending');

  // Form State
  const [formData, setFormData] = useState({
    water: { doc: '', salinity: '', ph: '', alkalinity: '', hardness: '', ammonia: '', nitrite: '', k: '', do: '', h2s: '', chlorine: '', iron: '', waterColour: '' },
    feed: { doc: '', seed: '', abw: '', dayFeed: '', cumulativeFeed: '', totalBiomass: '', fcr: '', checkTrayFeed: '', checkTrayTime: '', remarks: '' },
    medication: { treatmentType: '', category: '', product: '', dosage: '', remarks: '' },
    disease: { observations: [], remarks: '' },
    harvest: { type: 'None', date: '', abw: '', harvestedNumber: '', harvestedBiomass: '', finalDoc: '', finalAbw: '', finalBiomass: '', totalBiomass: '', totalFeed: '', remarks: '' }
  });

  useEffect(() => {
    const s = getSession();
    setSession(s);
    
    setTank(getTankById(tankId));

    // Load draft if exists
    const draft = getDraft(tankId);
    if (draft) {
      setFormData(draft.formData);
      setCurrentStep('MENU'); 
      setGpsStatus('success'); 
    }
  }, [tankId, getTankById, getDraft]);

  // FCR Calculation Effect
  useEffect(() => {
    const cumFeed = parseFloat(formData.feed.cumulativeFeed);
    const biomass = parseFloat(formData.feed.totalBiomass);
    if (!isNaN(cumFeed) && !isNaN(biomass) && biomass > 0) {
      const fcr = (cumFeed / biomass).toFixed(2);
      if (formData.feed.fcr !== fcr) {
        setFormData(prev => ({ ...prev, feed: { ...prev.feed, fcr } }));
      }
    } else if (formData.feed.fcr !== '') {
      setFormData(prev => ({ ...prev, feed: { ...prev.feed, fcr: '' } }));
    }
  }, [formData.feed.cumulativeFeed, formData.feed.totalBiomass, formData.feed.fcr]);

  if (!tank || !session) return <div style={styles.loading}>Initializing Visit...</div>;

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep('MENU');
    } else if (typeof currentStep === 'number' && currentStep >= 1 && currentStep <= 5) {
      setCurrentStep('MENU');
    } else if (currentStep === 'MENU') {
      setCurrentStep(6);
    }
  };

  const handleBack = () => {
    if (currentStep === 'MENU') {
      navigate(`/tanks/${tankId}`);
    } else if (typeof currentStep === 'number' && currentStep >= 1 && currentStep <= 6) {
      setCurrentStep('MENU');
    } else {
      navigate(`/tanks/${tankId}`);
    }
  };

  const verifyGPS = () => {
    setGpsStatus('loading');
    setTimeout(() => {
      setGpsStatus('success'); // Mock success
    }, 1500);
  };

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const toggleDisease = (diseaseStr) => {
    setFormData(prev => {
      const current = prev.disease.observations;
      const updated = current.includes(diseaseStr) 
        ? current.filter(d => d !== diseaseStr) 
        : [...current, diseaseStr];
      return { ...prev, disease: { ...prev.disease, observations: updated } };
    });
  };

  const checkWaterWarning = (field, value) => {
    if (!value || value === '') return null;
    const num = parseFloat(value);
    if (isNaN(num)) return null;

    switch (field) {
      case 'salinity': return (num < 0 || num > 30) ? 'Salinity outside prototype range (0-30 ppt)' : null;
      case 'ph': return (num < 7.5 || num > 8.5) ? 'pH outside prototype range (7.5-8.5)' : null;
      case 'alkalinity': return (num < 100 || num > 300) ? 'Alkalinity outside prototype range (100-300 ppm)' : null;
      case 'do': return (num < 4) ? 'DO is below 4. Flagging as low.' : null;
      case 'h2s': return (num < 0 || num > 0.02) ? 'H2S outside prototype range (0-0.02)' : null;
      case 'iron': return (num < 0 || num > 0.02) ? 'Iron outside prototype range (0-0.02)' : null;
      default: return null;
    }
  };

  const renderInput = (section, field, label, type="text", placeholder="") => {
    const value = formData[section][field];
    const warning = section === 'water' ? checkWaterWarning(field, value) : null;
    
    return (
      <div className="input-group">
        <label style={styles.label}>{label}</label>
        <div className="input-field" style={warning ? { border: '1px solid var(--status-orange)' } : {}}>
          <input 
            type={type} 
            placeholder={placeholder}
            value={value}
            readOnly={field === 'fcr'}
            style={field === 'fcr' ? { color: 'var(--color-primary)', fontWeight: 'bold' } : {}}
            onChange={e => updateFormData(section, field, e.target.value)}
          />
        </div>
        {warning && (
          <div style={styles.warningText}>
            <AlertTriangle size={12} /> {warning}
          </div>
        )}
      </div>
    );
  };

  const handleSaveDraft = () => {
    saveDraft({
      tankId,
      agentId: session.agentId,
      formData,
      lastSaved: new Date().toISOString()
    });
    alert('Draft saved successfully!');
  };

  const handleSubmit = () => {
    submitRecord({
      tankId,
      agentId: session.agentId,
      formData,
      submittedAt: new Date().toISOString()
    });
    alert('Site Visit submitted successfully! Pending verification.');
    navigate('/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'MENU':
        return (
          <div style={styles.menuContainer}>
            <div style={styles.menuHeaderRow}>
              <div>
                <div style={styles.menuLabel}>Farmer</div>
                <div style={styles.menuValue}>Ashok</div>
              </div>
              <div>
                <div style={styles.menuLabel}>GPS</div>
                <div style={styles.menuStatusVerified}><Check size={14} style={{ marginRight: 4 }}/> Verified</div>
              </div>
            </div>
            <div style={styles.menuHeaderRow}>
              <div>
                <div style={styles.menuLabel}>Test Date</div>
                <div style={styles.menuValue}>22 Aug 2026</div>
              </div>
            </div>

            <div style={styles.menuList}>
              <div style={styles.menuCard} onClick={() => setCurrentStep(1)}>
                <div style={styles.menuCardIconWrapper}>
                  <div style={styles.menuCardNumber}>01</div>
                  <Droplet size={24} color="#003399" />
                </div>
                <div style={styles.menuCardContent}>
                  <div style={styles.menuCardTitle}>Water Analysis</div>
                  <div style={styles.menuCardSubtitle}>Last Test: 20 Aug 2026</div>
                  <div style={styles.menuCardStatusDue}>Status: Due</div>
                </div>
                <div style={styles.menuCardAction}>ENTER TEST <ChevronRight size={16} /></div>
              </div>

              <div style={styles.menuCard} onClick={() => setCurrentStep(2)}>
                <div style={styles.menuCardIconWrapper}>
                  <div style={styles.menuCardNumber}>02</div>
                  <Fish size={24} color="#003399" />
                </div>
                <div style={styles.menuCardContent}>
                  <div style={styles.menuCardTitle}>Feed Test</div>
                  <div style={styles.menuCardSubtitle}>Last Test: 20 Aug 2026</div>
                  <div style={styles.menuCardStatusDue}>Status: Due</div>
                </div>
                <div style={styles.menuCardAction}>ENTER TEST <ChevronRight size={16} /></div>
              </div>

              <div style={styles.menuCard} onClick={() => setCurrentStep(3)}>
                <div style={styles.menuCardIconWrapper}>
                  <div style={styles.menuCardNumber}>03</div>
                  <Pill size={24} color="#15803d" />
                </div>
                <div style={styles.menuCardContent}>
                  <div style={styles.menuCardTitle}>Medication</div>
                  <div style={styles.menuCardSubtitle}>Last Record: 18 Aug 2026</div>
                </div>
                <div style={styles.menuCardAction}>ADD RECORD <ChevronRight size={16} /></div>
              </div>

              <div style={styles.menuCard} onClick={() => setCurrentStep(4)}>
                <div style={styles.menuCardIconWrapper}>
                  <div style={styles.menuCardNumber}>04</div>
                  <Bug size={24} color="#b45309" />
                </div>
                <div style={styles.menuCardContent}>
                  <div style={styles.menuCardTitle}>Disease Observation</div>
                  <div style={styles.menuCardSubtitle}>Last Record: 18 Aug 2026</div>
                </div>
                <div style={styles.menuCardAction}>ADD OBSERVATION <ChevronRight size={16} /></div>
              </div>

              <div style={styles.menuCard} onClick={() => setCurrentStep(5)}>
                <div style={styles.menuCardIconWrapper}>
                  <div style={styles.menuCardNumber}>05</div>
                  <Ship size={24} color="#6b21a8" />
                </div>
                <div style={styles.menuCardContent}>
                  <div style={styles.menuCardTitle}>Harvest</div>
                  <div style={styles.menuCardSubtitle}>Last Record: 10 Aug 2026</div>
                </div>
                <div style={styles.menuCardAction}>ADD HARVEST <ChevronRight size={16} /></div>
              </div>
            </div>
            
            <div style={styles.siteVerifiedBox}>
              <MapPin size={20} color="#15803d" />
              <div>
                <div style={styles.siteVerifiedTitle}>SITE VERIFIED</div>
                <div style={styles.siteVerifiedText}>You are within permitted location.</div>
              </div>
            </div>
          </div>
        );
      case 0:
        return (
          <div style={styles.stepContainer}>
            <div style={styles.gpsBox}>
              <MapPin size={48} color={gpsStatus === 'success' ? 'var(--status-green)' : 'var(--color-primary)'} />
              <h3 style={{ margin: '16px 0', fontSize: '18px' }}>Location Verification</h3>
              {gpsStatus === 'pending' && <p>Please verify your physical location at the tank.</p>}
              {gpsStatus === 'loading' && <p>Acquiring GPS coordinates...</p>}
              {gpsStatus === 'success' && (
                <div style={{ color: 'var(--status-green)', fontWeight: 'bold' }}>
                  <CheckCircle size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }}/>
                  Location Verified ✓ (Distance: 12m)
                </div>
              )}
              {gpsStatus !== 'success' && (
                <button className="btn-primary" style={{ marginTop: '24px' }} onClick={verifyGPS} disabled={gpsStatus === 'loading'}>
                  {gpsStatus === 'loading' ? 'Verifying...' : 'Verify Location'}
                </button>
              )}
            </div>
          </div>
        );
      
      case 1:
        return (
          <div style={styles.stepContainer}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {renderInput('water', 'doc', 'DOC / Date', 'date')}
              {renderInput('water', 'salinity', 'Salinity (0-30 ppt)', 'number')}
              {renderInput('water', 'ph', 'pH (7.5-8.5)', 'number')}
              {renderInput('water', 'alkalinity', 'Alkalinity (100-300 ppm)', 'number')}
              {renderInput('water', 'hardness', 'Hardness', 'number')}
              {renderInput('water', 'ammonia', 'Ammonia', 'number')}
              {renderInput('water', 'nitrite', 'Nitrite', 'number')}
              {renderInput('water', 'k', 'Potassium (K)', 'number')}
              {renderInput('water', 'do', 'DO (mg/L)', 'number')}
              {renderInput('water', 'h2s', 'H2S (0-0.02)', 'number')}
              {renderInput('water', 'chlorine', 'Chlorine', 'number')}
              {renderInput('water', 'iron', 'Iron (0-0.02)', 'number')}
              {renderInput('water', 'waterColour', 'Water Colour', 'text', 'e.g. Greenish')}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div style={styles.stepContainer}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {renderInput('feed', 'doc', 'DOC', 'number')}
              {renderInput('feed', 'seed', 'Seed', 'number')}
              {renderInput('feed', 'abw', 'ABW', 'number')}
              {renderInput('feed', 'dayFeed', 'Day Feed (kg)', 'number')}
              {renderInput('feed', 'cumulativeFeed', 'Cumulative Feed (kg)', 'number')}
              {renderInput('feed', 'totalBiomass', 'Total Biomass (kg)', 'number')}
              {renderInput('feed', 'fcr', 'FCR (Auto-Calculated)', 'text')}
              {renderInput('feed', 'checkTrayFeed', 'Check-tray Feed', 'text')}
              {renderInput('feed', 'checkTrayTime', 'Check-tray Time', 'time')}
              {renderInput('feed', 'remarks', 'Remarks', 'text')}
            </div>
          </div>
        );

      case 3:
        return (
          <div style={styles.stepContainer}>
            <div className="input-group">
              <label style={styles.label}>Treatment Type</label>
              <div className="input-field">
                <select value={formData.medication.treatmentType} onChange={e => updateFormData('medication', 'treatmentType', e.target.value)}>
                  <option value="">Select Type</option>
                  <option value="Preventive">Preventive</option>
                  <option value="Curative">Curative</option>
                </select>
              </div>
            </div>
            {renderInput('medication', 'category', 'Category', 'text', 'e.g. Probiotics')}
            {renderInput('medication', 'product', 'Product Name', 'text')}
            {renderInput('medication', 'dosage', 'Dosage', 'text')}
            {renderInput('medication', 'remarks', 'Remarks', 'text')}
          </div>
        );

      case 4:
        return (
          <div style={styles.stepContainer}>
            <label style={styles.label}>Observed Diseases</label>
            <div className="grid grid-cols-2" style={{ gap: '12px', marginBottom: '16px' }}>
              {DISEASE_OPTIONS.map(disease => (
                <label key={disease} style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={formData.disease.observations.includes(disease)}
                    onChange={() => toggleDisease(disease)}
                  />
                  <span>{disease}</span>
                </label>
              ))}
            </div>
            {renderInput('disease', 'remarks', 'Remarks', 'text', 'Additional observations')}
          </div>
        );

      case 5:
        return (
          <div style={styles.stepContainer}>
            <div className="input-group">
              <label style={styles.label}>Harvest Type</label>
              <div className="input-field">
                <select value={formData.harvest.type} onChange={e => updateFormData('harvest', 'type', e.target.value)}>
                  <option value="None">None / Not Planned</option>
                  <option value="Partial">Partial Harvest</option>
                  <option value="Final">Final Harvest</option>
                </select>
              </div>
            </div>
            {formData.harvest.type !== 'None' && (
              <div className="grid grid-cols-1 md:grid-cols-2">
                {renderInput('harvest', 'date', 'Harvest Date / DOC', 'text')}
                {renderInput('harvest', 'abw', 'ABW', 'number')}
                {renderInput('harvest', 'harvestedNumber', 'Harvested Number', 'number')}
                {renderInput('harvest', 'harvestedBiomass', 'Harvested Biomass (kg)', 'number')}
                {renderInput('harvest', 'finalDoc', 'Final DOC', 'number')}
                {renderInput('harvest', 'finalAbw', 'Final ABW', 'number')}
                {renderInput('harvest', 'finalBiomass', 'Final Biomass (kg)', 'number')}
                {renderInput('harvest', 'totalBiomass', 'Total Biomass (kg)', 'number')}
                {renderInput('harvest', 'totalFeed', 'Total Feed (kg)', 'number')}
                {renderInput('harvest', 'remarks', 'Remarks', 'text')}
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div style={styles.stepContainer}>
            <div style={styles.reviewBox}>
              <h4 style={styles.reviewTitle}>1. Water Quality</h4>
              <div className="grid grid-cols-2 md:grid-cols-3" style={styles.reviewGrid}>
                {Object.entries(formData.water).map(([key, val]) => val && <div key={key}><strong>{key}:</strong> {val}</div>)}
              </div>
              
              <h4 style={styles.reviewTitle}>2. Feed</h4>
              <div className="grid grid-cols-2 md:grid-cols-3" style={styles.reviewGrid}>
                {Object.entries(formData.feed).map(([key, val]) => val && <div key={key}><strong>{key}:</strong> {val}</div>)}
              </div>
              
              <h4 style={styles.reviewTitle}>3. Medication</h4>
              <div className="grid grid-cols-2" style={styles.reviewGrid}>
                {Object.entries(formData.medication).map(([key, val]) => val && <div key={key}><strong>{key}:</strong> {val}</div>)}
              </div>

              <h4 style={styles.reviewTitle}>4. Disease</h4>
              <p><strong>Observations:</strong> {formData.disease.observations.length > 0 ? formData.disease.observations.join(', ') : 'None'}</p>
              <p><strong>Remarks:</strong> {formData.disease.remarks || '-'}</p>

              <h4 style={styles.reviewTitle}>5. Harvest</h4>
              <p><strong>Type:</strong> {formData.harvest.type}</p>
              {formData.harvest.type !== 'None' && (
                <div className="grid grid-cols-2" style={styles.reviewGrid}>
                  {Object.entries(formData.harvest).map(([key, val]) => key !== 'type' && val && <div key={key}><strong>{key}:</strong> {val}</div>)}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={handleBack}>
          <ArrowLeft size={20} />
          <span>{currentStep === 0 ? 'Cancel Visit' : 'Back'}</span>
        </button>
        {currentStep > 0 && currentStep < 6 && (
          <button style={styles.draftBtn} onClick={handleSaveDraft}>
            <Save size={16} /> Save Draft
          </button>
        )}
      </div>

      <div className="card">
        <div style={styles.cardHeader}>
          <h2 style={{...styles.title, textAlign: currentStep === 'MENU' ? 'center' : 'left'}}>{currentStep === 'MENU' ? `${tank.name} - Tests` : STEPS[currentStep]}</h2>
          {currentStep !== 'MENU' && <div style={styles.subtitle}>{tank.name} - Step {currentStep + 1} of {STEPS.length}</div>}
        </div>

        {/* Progress Bar */}
        {currentStep !== 'MENU' && (
          <div style={styles.progressContainer}>
            <div style={{
              ...styles.progressBar, 
              width: `${((currentStep + 1) / STEPS.length) * 100}%`
            }}></div>
          </div>
        )}

        {/* Content */}
        {renderStepContent()}

        {/* Footer Actions */}
        <div style={styles.footer}>
          {currentStep === 0 ? (
            <button 
              className="btn-primary"
              onClick={handleNext}
              disabled={gpsStatus !== 'success'}
            >
              Continue
            </button>
          ) : currentStep === 'MENU' ? (
            <button 
              className="btn-primary"
              onClick={handleNext}
              style={{ width: '100%', padding: '16px', fontSize: '15px' }}
            >
              REVIEW & SUBMIT TESTS
            </button>
          ) : currentStep === 6 ? (
            <button 
              className="btn-primary"
              style={{ backgroundColor: 'var(--status-green)', width: '100%', padding: '16px', fontSize: '15px' }}
              onClick={handleSubmit}
            >
              <Send size={18} /> Submit Data
            </button>
          ) : (
            <button 
              className="btn-primary"
              onClick={handleNext}
              style={{ width: '100%', padding: '16px', fontSize: '15px' }}
            >
              Save & Return
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--color-text-main)', fontWeight: '600', cursor: 'pointer', fontSize: '15px' },
  draftBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', border: '1px solid var(--color-border)', padding: '6px 12px', borderRadius: '6px', color: 'var(--color-text-muted)', fontWeight: '600', cursor: 'pointer', fontSize: '13px' },
  cardHeader: { marginBottom: '16px' },
  title: { fontSize: '20px', fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '4px' },
  subtitle: { fontSize: '13px', color: 'var(--color-text-muted)' },
  progressContainer: { height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', marginBottom: '24px' },
  progressBar: { height: '100%', backgroundColor: 'var(--color-primary)', transition: 'width 0.3s ease' },
  stepContainer: { minHeight: '250px' },
  gpsBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed var(--color-border)' },
  label: { fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '8px', display: 'block' },
  warningText: { color: 'var(--status-orange)', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', backgroundColor: '#f1f5f9', padding: '10px 12px', borderRadius: '6px' },
  footer: { marginTop: '24px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' },
  reviewBox: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' },
  reviewTitle: { fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)', marginTop: '20px', marginBottom: '8px', textTransform: 'uppercase', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' },
  reviewGrid: { gap: '8px', fontSize: '13px', color: 'var(--color-text-muted)' },
  loading: { padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' },
  
  // New Menu Styles
  menuContainer: { display: 'flex', flexDirection: 'column', gap: '16px' },
  menuHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  menuLabel: { fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: '600', marginBottom: '2px' },
  menuValue: { fontSize: '15px', color: 'var(--color-text-main)', fontWeight: '700' },
  menuStatusVerified: { display: 'flex', alignItems: 'center', color: 'var(--status-green)', fontSize: '14px', fontWeight: '600' },
  menuList: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' },
  menuCard: { display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
  menuCardIconWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '8px 12px', marginRight: '16px', minWidth: '60px' },
  menuCardNumber: { fontSize: '12px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '4px' },
  menuCardContent: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  menuCardTitle: { fontSize: '15px', fontWeight: '700', color: 'var(--color-text-main)' },
  menuCardSubtitle: { fontSize: '13px', color: 'var(--color-text-muted)' },
  menuCardStatusDue: { fontSize: '12px', fontWeight: '600', color: 'var(--status-red)' },
  menuCardAction: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700', color: 'var(--color-primary)' },
  siteVerifiedBox: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#f0fdf4', border: '1px dashed var(--status-green)', borderRadius: '8px', marginTop: '16px' },
  siteVerifiedTitle: { fontSize: '14px', fontWeight: '700', color: 'var(--status-green)' },
  siteVerifiedText: { fontSize: '13px', color: '#166534', marginTop: '2px' },
};

export default SiteVisit;

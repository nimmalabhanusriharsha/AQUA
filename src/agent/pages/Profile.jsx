import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit2, Save, LogOut, X, CheckCircle, Camera, Upload, Trash2 } from 'lucide-react';
import { getSession, logout, updateAgentProfile } from '../utils/agentAuth';

const Profile = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [locality, setLocality] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const s = getSession();
    if (!s) {
      navigate('/login');
      return;
    }
    setSession(s);
    setName(s.name || '');
    setRegion(s.region || '');
    setLocality(s.locality || '');
    setPhone(s.phone || '9876543210');
    setPhoto(s.photo || '');
  }, [navigate, isEditing]);

  if (!session) return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setMessage('Image size must be less than 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 300;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedPhoto = canvas.toDataURL('image/jpeg', 0.8);

          setPhoto(compressedPhoto);
          const updated = updateAgentProfile({ photo: compressedPhoto });
          if (updated) {
            setSession(updated);
          }
          setMessage('Profile photo updated successfully!');
          setTimeout(() => setMessage(''), 3000);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto('');
    const updated = updateAgentProfile({ photo: null });
    if (updated) {
      setSession(updated);
    }
    setMessage('Profile photo removed.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveProfile = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!name || !name.trim()) {
      setMessage('Name cannot be empty.');
      return;
    }

    try {
      const profileData = {
        name: name.trim(),
        region: region ? region.trim() : '',
        locality: locality ? locality.trim() : '',
        phone: phone ? phone.trim() : '',
        photo: photo || null
      };

      const updated = updateAgentProfile(profileData);

      if (updated) {
        setSession(updated);
        setIsEditing(false);
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Failed to update profile. Please try again.');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      try {
        const updated = updateAgentProfile({
          name: name.trim(),
          region: region ? region.trim() : '',
          locality: locality ? locality.trim() : '',
          phone: phone ? phone.trim() : ''
        });
        if (updated) {
          setSession(updated);
          setIsEditing(false);
          setMessage('Profile details updated successfully!');
          setTimeout(() => setMessage(''), 3000);
          return;
        }
      } catch (err2) {
        console.error('Fallback save error:', err2);
      }
      setMessage('An error occurred while saving profile changes.');
    }

    setTimeout(() => setMessage(''), 4000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Format last login time without seconds
  const formatLastLogin = (loginTime) => {
    if (!loginTime) return 'N/A';
    const date = new Date(loginTime);
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconCircle}>
            {session.photo ? (
              <img src={session.photo} alt={session.name} style={styles.headerAvatarImg} />
            ) : (
              <User size={28} color="#2563D9" />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={styles.title}>{session?.name ? `${session.name}'s Profile` : 'Agent Profile'}</h2>
              <span 
                onClick={() => setIsEditing(!isEditing)}
                style={styles.editChip}
              >
                <Edit2 size={12} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </span>
            </div>
            <div style={styles.subtitle}>
              View and manage your account information
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div style={{
          ...styles.messageBox,
          backgroundColor: message.includes('successfully') || message.includes('removed') ? '#E8F8EE' : '#FDECEC',
          color: message.includes('successfully') || message.includes('removed') ? '#22A65A' : '#DC3F3F',
          border: `1px solid ${message.includes('successfully') || message.includes('removed') ? '#22A65A' : '#DC3F3F'}`
        }}>
          {message.includes('successfully') && <CheckCircle size={16} />}
          <span>{message}</span>
        </div>
      )}

      {/* Main Profile View / Edit Mode */}
      <div className="card" style={styles.card}>
        {!isEditing ? (
          /* Display View */
          <div>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Account Information</h3>
              <button 
                style={styles.editBtn} 
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={15} /> Edit Profile
              </button>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Agent ID</span>
              <span style={styles.infoValue}>{session.agentId}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Full Name</span>
              <span style={styles.infoValue}>{session.name}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Region</span>
              <span style={styles.infoValue}>{session.region || 'N/A'}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Locality</span>
              <span style={styles.infoValue}>{session.locality || 'N/A'}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Mobile Number</span>
              <span style={styles.infoValue}>{session.phone || '9876543210'}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Last Login</span>
              <span style={styles.infoValue}>{formatLastLogin(session.loginTime)}</span>
            </div>

            <button 
              style={styles.logoutBtn} 
              onClick={handleLogout}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSaveProfile}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Edit Profile Information</h3>
              <button 
                type="button" 
                style={styles.cancelBtnIcon}
                onClick={() => setIsEditing(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Photo Edit Section */}
            <div style={styles.photoContainer}>
              <div style={styles.avatarWrapper}>
                {photo ? (
                  <img src={photo} alt="Profile preview" style={styles.profileAvatarImg} />
                ) : (
                  <div style={styles.profileAvatarPlaceholder}>
                    {name ? name.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}
                <label htmlFor="edit-profile-photo-input" style={styles.cameraBadge} title="Upload photo">
                  <Camera size={14} color="white" />
                </label>
                <input 
                  id="edit-profile-photo-input" 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoChange} 
                  style={{ display: 'none' }} 
                />
              </div>

              <div style={styles.photoMeta}>
                <div style={styles.photoTitle}>Profile Photo</div>
                <div style={styles.photoSubtitle}>PNG, JPG or JPEG up to 10MB</div>
                <div style={styles.photoActionRow}>
                  <label htmlFor="edit-profile-photo-input" style={styles.uploadBtn}>
                    <Upload size={13} /> {photo ? 'Change Photo' : 'Upload Photo'}
                  </label>
                  {photo && (
                    <button type="button" onClick={handleRemovePhoto} style={styles.removePhotoBtn}>
                      <Trash2 size={13} /> Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="input-group">
              <label style={styles.label}>Agent ID (Read Only)</label>
              <div className="input-field" style={{ backgroundColor: '#F3F6FA' }}>
                <input type="text" value={session.agentId} disabled style={{ color: '#64748B' }} />
              </div>
            </div>

            <div className="input-group">
              <label style={styles.label}>Full Name *</label>
              <div className="input-field">
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Enter full name"
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="input-group">
                <label style={styles.label}>Region</label>
                <div className="input-field">
                  <input 
                    type="text" 
                    value={region} 
                    onChange={e => setRegion(e.target.value)} 
                    placeholder="Enter region" 
                  />
                </div>
              </div>

              <div className="input-group">
                <label style={styles.label}>Locality / Village</label>
                <div className="input-field">
                  <input 
                    type="text" 
                    value={locality} 
                    onChange={e => setLocality(e.target.value)} 
                    placeholder="Enter locality" 
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label style={styles.label}>Mobile Number</label>
              <div className="input-field">
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="Enter phone number" 
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                type="submit" 
                className="btn-primary"
                onClick={handleSaveProfile}
                style={{ flex: 1, padding: '12px', fontSize: '15px' }}
              >
                <Save size={18} /> Save Profile Changes
              </button>
              <button 
                type="button" 
                style={styles.cancelBtn}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  iconCircle: { width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#EAF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  headerAvatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  title: { fontSize: '20px', fontWeight: '700', color: '#17233C', marginBottom: '4px' },
  editChip: { fontSize: '12px', color: '#2563D9', backgroundColor: '#EAF3FF', padding: '3px 8px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' },
  subtitle: { fontSize: '13px', color: '#64748B' },
  messageBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: '600' },
  card: { padding: '24px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #DCE4EE', paddingBottom: '12px' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#17233C', margin: 0 },
  
  photoContainer: { display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #DCE4EE', marginBottom: '20px' },
  avatarWrapper: { position: 'relative', width: '80px', height: '80px', flexShrink: 0 },
  profileAvatarImg: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563D9' },
  profileAvatarPlaceholder: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#2563D9', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '700', border: '2px solid #2563D9' },
  cameraBadge: { position: 'absolute', bottom: '2px', right: '2px', backgroundColor: '#2563D9', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' },
  photoMeta: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  photoTitle: { fontSize: '15px', fontWeight: '700', color: '#17233C' },
  photoSubtitle: { fontSize: '12px', color: '#64748B' },
  photoActionRow: { display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' },
  uploadBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#2563D9', color: '#FFFFFF', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  removePhotoBtn: { display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#FDECEC', color: '#DC3F3F', border: '1px solid #DC3F3F', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },

  editBtn: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#EAF3FF', color: '#2563D9', border: '1px solid #DCE4EE', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F1F5F9', fontSize: '14px' },
  infoLabel: { color: '#64748B', fontWeight: '500' },
  infoValue: { color: '#17233C', fontWeight: '700' },
  logoutBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', backgroundColor: '#FDECEC', color: '#DC3F3F', border: '1px solid #DC3F3F', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', marginTop: '24px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#17233C', marginBottom: '6px', display: 'block' },
  cancelBtn: { padding: '12px 20px', backgroundColor: '#FFFFFF', color: '#64748B', border: '1px solid #DCE4EE', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' },
  cancelBtnIcon: { background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }
};

export default Profile;

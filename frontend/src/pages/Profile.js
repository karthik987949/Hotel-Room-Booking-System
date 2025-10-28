import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profilePicture: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    preferredLanguage: 'English',
    notificationPreferences: 'EMAIL'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      setProfile(response.data);
      setFormData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        profilePicture: response.data.profilePicture || '',
        dateOfBirth: response.data.dateOfBirth || '',
        address: response.data.address || '',
        city: response.data.city || '',
        state: response.data.state || '',
        postalCode: response.data.postalCode || '',
        country: response.data.country || '',
        emergencyContactName: response.data.emergencyContactName || '',
        emergencyContactPhone: response.data.emergencyContactPhone || '',
        preferredLanguage: response.data.preferredLanguage || 'English',
        notificationPreferences: response.data.notificationPreferences || 'EMAIL'
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.put('/profile', formData);
      setProfile(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getProfilePictureUrl = () => {
    if (profile?.profilePicture) {
      return profile.profilePicture;
    }
    // Default avatar based on user's initials
    return `https://ui-avatars.com/api/?name=${profile?.firstName}+${profile?.lastName}&background=4f46e5&color=fff&size=200`;
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={getProfilePictureUrl()} 
            alt="Profile" 
            className="avatar-image"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${profile?.firstName}+${profile?.lastName}&background=4f46e5&color=fff&size=200`;
            }}
          />
          {isEditing && (
            <div className="avatar-upload">
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={handleProfilePictureChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="profilePicture" className="upload-btn">
                📷 Change Photo
              </label>
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1>{profile?.fullName}</h1>
          <p className="profile-role">{profile?.role === 'CUSTOMER' ? 'Customer' : 'Hotel Administrator'}</p>
          <p className="profile-email">{profile?.email}</p>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{profile?.totalBookings || 0}</span>
              <span className="stat-label">Total Bookings</span>
            </div>
            <div className="stat">
              <span className="stat-number">{profile?.totalReviews || 0}</span>
              <span className="stat-label">Reviews Written</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {profile?.createdAt ? new Date(profile.createdAt).getFullYear() : 'N/A'}
              </span>
              <span className="stat-label">Member Since</span>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button 
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                className="save-btn"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? '💾 Saving...' : '💾 Save Changes'}
              </button>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile(); // Reset form data
                }}
              >
                ❌ Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2>Personal Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Preferred Language</label>
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Address Information</h2>
            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter your street address"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Emergency Contact</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Emergency Contact Name</label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Emergency Contact Phone</label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Preferences</h2>
            <div className="form-group">
              <label>Notification Preferences</label>
              <select
                name="notificationPreferences"
                value={formData.notificationPreferences}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="EMAIL">Email Only</option>
                <option value="SMS">SMS Only</option>
                <option value="BOTH">Email & SMS</option>
                <option value="NONE">No Notifications</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
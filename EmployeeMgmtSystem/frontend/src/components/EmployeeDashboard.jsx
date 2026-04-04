import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiLogOut, FiUser, FiBriefcase, FiMail, FiDollarSign, FiSettings, FiCheckCircle, FiLock } from 'react-icons/fi';
import './EmployeeDashboard.css'; // Reusing and extending styles

const EmployeeDashboard = ({ setAuth }) => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(true);

  const [copiedItem, setCopiedItem] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleCopy = (label, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/employees/profile');
      setProfile(res.data);
      setFormData(prev => ({ ...prev, email: res.data.email }));
    } catch (error) {
      console.error("Error fetching profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return setStatusMsg({ type: 'error', text: 'Passwords do not match' });
    }

    try {
      await axios.put('/api/employees/profile', {
        email: formData.email,
        password: formData.password || undefined
      });
      setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      setStatusMsg({ type: 'error', text: 'Update failed. Please try again.' });
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setAuth(false);
    } catch (error) {
      console.error("Logout failed");
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
  };

  if (isLoading) return <div className="spinner"></div>;

  return (
    <div className="employee-dashboard fade-in">
      <header className="dashboard-header">
        <div className="header-left">
          <FiUser className="header-icon" />
          <div className="header-text">
            <h1>Employee Portal</h1>
            <p>Welcome back, {profile?.name}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary">
          <FiLogOut /> Logout
        </button>
      </header>

      <div className="dashboard-grid">
        {/* Profile Card */}
        <div className="glass-panel profile-summary">
          <div className="profile-banner"></div>
          <div className="avatar-large">{getInitials(profile?.name)}</div>
          <div className="profile-info">
            <h2>{profile?.name}</h2>
            <p className="profile-role">{profile?.position}</p>
            <span className={`status-pill ${profile?.status}`}>{profile?.status}</span>
          </div>
          <div className="profile-actions">
            <button 
              className={`btn ${editMode ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? <FiBriefcase /> : <FiSettings />} 
              {editMode ? ' View Details' : ' Account Settings'}
            </button>
          </div>
        </div>

        {/* Dynamic Content: Stats or Settings */}
        <div className="main-content-area">
          {statusMsg.text && (
            <div className={`status-banner ${statusMsg.type}`}>
               {statusMsg.type === 'success' ? <FiCheckCircle /> : <FiUser />} {statusMsg.text}
            </div>
          )}

          {!editMode ? (
            <div className="stats-layout">
              <div 
                className={`glass-panel detail-card interactive ${copiedItem === 'Department' ? 'copied' : ''}`}
                onClick={() => handleCopy('Department', profile?.department)}
              >
                <FiBriefcase className="card-icon blue" />
                <div className="card-content">
                  <label>Department</label>
                  <h3>{profile?.department}</h3>
                </div>
                <span className="copy-hint">{copiedItem === 'Department' ? '✓ Copied!' : 'Click to copy'}</span>
              </div>
              <div 
                className={`glass-panel detail-card interactive ${copiedItem === 'Email' ? 'copied' : ''}`}
                onClick={() => handleCopy('Email', profile?.email)}
              >
                <FiMail className="card-icon purple" />
                <div className="card-content">
                  <label>Work Email</label>
                  <h3>{profile?.email}</h3>
                </div>
                <span className="copy-hint">{copiedItem === 'Email' ? '✓ Copied!' : 'Click to copy'}</span>
              </div>
              <div 
                className={`glass-panel detail-card interactive ${copiedItem === 'Salary' ? 'copied' : ''}`}
                onClick={() => handleCopy('Salary', profile?.salary?.toString())}
              >
                <FiDollarSign className="card-icon green" />
                <div className="card-content">
                  <label>Salary</label>
                  <h3>₹{profile?.salary?.toLocaleString()}</h3>
                  <p className="subtext">Current monthly pay</p>
                </div>
                <span className="copy-hint">{copiedItem === 'Salary' ? '✓ Copied!' : 'Click to copy'}</span>
              </div>
              <div 
                className={`glass-panel detail-card interactive ${copiedItem === 'Username' ? 'copied' : ''}`}
                onClick={() => handleCopy('Username', profile?.username)}
              >
                <FiUser className="card-icon cyan" />
                <div className="card-content">
                  <label>Username</label>
                  <h3>{profile?.username}</h3>
                </div>
                <span className="copy-hint">{copiedItem === 'Username' ? '✓ Copied!' : 'Click to copy'}</span>
              </div>
            </div>
          ) : (
            <div className="glass-panel settings-card">
              <div className="settings-header">
                <h2><FiLock /> Account Settings</h2>
                <p>Update your credentials below</p>
              </div>
              <form onSubmit={handleUpdate} className="settings-form">
                <div className="form-group">
                  <label>Update Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="Leave blank to keep"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-footer">
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

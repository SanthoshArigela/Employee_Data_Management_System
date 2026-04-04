import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX } from 'react-icons/fi';
import './EmployeeForm.css';

const EmployeeForm = ({ employee, onClose, refreshList }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    department: 'Engineering',
    position: '',
    salary: '',
    status: 'active'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If we are editing, populate the form
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        username: employee.username || '',
        password: '', // Leave password blank on edit unless changing
        department: employee.department,
        position: employee.position || '',
        salary: employee.salary,
        status: employee.status || 'active'
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (employee) {
        // Update existing - only send non-empty password
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password) delete dataToUpdate.password;
        await axios.put(`/api/employees/${employee._id}`, dataToUpdate);
      } else {
        // Add new
        await axios.post('/api/employees', formData);
      }
      refreshList();
      onClose(); // Close modal on success
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving employee. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Support', 'Finance'];

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2>{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name" 
              className="form-control" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              className="form-control" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="e.g. jane@company.com"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                name="username" 
                className="form-control" 
                value={formData.username} 
                onChange={handleChange} 
                required 
                placeholder="e.g. jane_doe"
              />
            </div>

            <div className="form-group">
              <label>{employee ? 'New Password' : 'Password'}</label>
              <input 
                type="password" 
                name="password" 
                className="form-control" 
                value={formData.password} 
                onChange={handleChange} 
                required={!employee} 
                placeholder={employee ? "Leave blank to keep" : "Enter password"}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Position</label>
            <input 
              type="text" 
              name="position" 
              className="form-control" 
              value={formData.position} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Senior Developer"
            />
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Salary (₹)</label>
              <input 
                type="number" 
                name="salary" 
                className="form-control" 
                value={formData.salary} 
                onChange={handleChange} 
                required 
                min="0"
                placeholder="e.g. 75000"
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select 
                name="status" 
                className="form-control" 
                value={formData.status} 
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : (employee ? 'Update Employee' : 'Add Employee')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;

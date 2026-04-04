import axios from 'axios';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import './EmployeeList.css';

const EmployeeList = ({ employees, onEdit, refreshList }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`/api/employees/${id}`);
        refreshList();
      } catch (error) {
        console.error("Failed to delete employee", error);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (employees.length === 0) {
    return (
      <div className="glass-panel empty-state">
        <h3>No Employees Found</h3>
        <p>Try adding a new employee to get started.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel table-container fade-in">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Position</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>
                <div className="employee-info">
                  <div className="avatar">{getInitials(emp.name)}</div>
                  <div className="name-email">
                    <span className="emp-name">{emp.name}</span>
                    <span className="emp-email">{emp.email}</span>
                  </div>
                </div>
              </td>
              <td>
                <span className="dept-badge">{emp.department}</span>
              </td>
              <td className="emp-position">{emp.position || 'Staff'}</td>
              <td className="emp-salary">
                {formatCurrency(emp.salary)}
              </td>
              <td>
                <span className={`status-badge ${emp.status || 'active'}`}>
                  {emp.status || 'active'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="icon-btn edit" onClick={() => onEdit(emp)}>
                    <FiEdit2 />
                  </button>
                  <button className="icon-btn delete" onClick={() => handleDelete(emp._id)}>
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;

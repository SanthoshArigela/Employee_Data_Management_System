import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiLogOut, FiPlus, FiSearch, FiFilter, FiUsers, FiPieChart, FiDollarSign } from 'react-icons/fi';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import Sidebar from './Sidebar';
import ChartModal from './ChartModal';
import './Dashboard.css';

const Dashboard = ({ setAuth }) => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, [searchTerm, departmentFilter]);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/employees', {
        params: { search: searchTerm, department: departmentFilter }
      });
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees");
    } finally {
      setIsLoading(false);
    }
  };

  const totalEmployees = employees.length;
  const deptCount = [...new Set(employees.map(e => e.department))].length;
  const avgSalary = totalEmployees > 0 ? employees.reduce((s, e) => s + e.salary, 0) / totalEmployees : 0;
  const activeCount = employees.filter(e => e.status === 'active').length;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="app-container">
      <Sidebar setAuth={setAuth} />
      
      <main className="main-content">
        <div className="dashboard-content">
          <header className="content-header">
            <div className="header-titles">
              <h1>Admin Dashboard</h1>
              <p>Manage your employees and departments</p>
            </div>
            <button 
              className="btn btn-primary add-btn"
              onClick={() => { setEditingEmployee(null); setIsFormOpen(true); }}
            >
              <FiPlus /> Add Employee
            </button>
          </header>

          <section className="stats-row">
            <button className="stat-card glass-panel stat-btn" onClick={() => setSelectedChart('employees')}>
              <div className="stat-content">
                <span className="stat-label">Total Employees</span>
                <h2 className="stat-value">{totalEmployees}</h2>
                <span className="stat-sub">Across all departments</span>
              </div>
              <div className="stat-icon-bg purple"><FiUsers /></div>
              <span className="chart-hint">Click to view chart →</span>
            </button>
            <button className="stat-card glass-panel stat-btn" onClick={() => setSelectedChart('departments')}>
              <div className="stat-content">
                <span className="stat-label">Departments</span>
                <h2 className="stat-value">{deptCount}</h2>
                <span className="stat-sub">Active departments</span>
              </div>
              <div className="stat-icon-bg purple"><FiPieChart /></div>
              <span className="chart-hint">Click to view chart →</span>
            </button>
            <button className="stat-card glass-panel stat-btn" onClick={() => setSelectedChart('salary')}>
              <div className="stat-content">
                <span className="stat-label">Avg. Salary</span>
                <h2 className="stat-value">{formatCurrency(avgSalary)}</h2>
                <span className="stat-sub">Per employee</span>
              </div>
              <div className="stat-icon-bg purple"><FiDollarSign /></div>
              <span className="chart-hint">Click to view chart →</span>
            </button>
            <button className="stat-card glass-panel stat-btn" onClick={() => setSelectedChart('active')}>
              <div className="stat-content">
                <span className="stat-label">Active</span>
                <h2 className="stat-value">{activeCount}</h2>
                <span className="stat-sub">{totalEmployees - activeCount} inactive</span>
              </div>
              <div className="stat-icon-bg purple"><FiUsers /></div>
              <span className="chart-hint">Click to view chart →</span>
            </button>
          </section>

          <div className="dashboard-controls glass-panel">
            <div className="search-bar">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by name, email, or position..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <select 
                className="form-control select-filter" 
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
              </select>
              <select className="form-control select-filter">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            <EmployeeList 
              employees={employees} 
              onEdit={(emp) => { setEditingEmployee(emp); setIsFormOpen(true); }}
              refreshList={fetchEmployees}
            />
          )}

          {isFormOpen && (
            <EmployeeForm 
              employee={editingEmployee}
              onClose={() => setIsFormOpen(false)}
              refreshList={fetchEmployees}
            />
          )}

          {selectedChart && (
            <ChartModal
              type={selectedChart}
              employees={employees}
              onClose={() => setSelectedChart(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

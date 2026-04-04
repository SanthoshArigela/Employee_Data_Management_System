import { FiUsers, FiDollarSign, FiTrendingUp, FiPieChart } from 'react-icons/fi';

const StatsView = ({ employees }) => {
  const totalEmployees = employees.length;
  const totalPayroll = employees.reduce((acc, curr) => acc + curr.salary, 0);
  const averageSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;
  
  // Department breakdown
  const deptCounts = employees.reduce((acc, curr) => {
    acc[curr.department] = (acc[curr.department] || 0) + 1;
    return acc;
  }, {});

  const departments = Object.keys(deptCounts);
  const maxDeptCount = Math.max(...Object.values(deptCounts), 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(val);
  };

  return (
    <div className="stats-container fade-in">
      <div className="stats-grid">
        <div className="stat-card glass-panel highlight-blue">
          <div className="stat-icon"><FiUsers /></div>
          <div className="stat-info">
            <h3>{totalEmployees}</h3>
            <p>Total Employees</p>
          </div>
        </div>
        
        <div className="stat-card glass-panel highlight-green">
          <div className="stat-icon"><FiDollarSign /></div>
          <div className="stat-info">
            <h3>{formatCurrency(totalPayroll)}</h3>
            <p>Annual Payroll</p>
          </div>
        </div>

        <div className="stat-card glass-panel highlight-purple">
          <div className="stat-icon"><FiTrendingUp /></div>
          <div className="stat-info">
            <h3>{formatCurrency(averageSalary)}</h3>
            <p>Average Salary</p>
          </div>
        </div>
      </div>

      <div className="stats-detailed glass-panel">
        <div className="detailed-header">
          <h2><FiPieChart /> Department Distribution</h2>
          <p>Personnel breakdown across organization units</p>
        </div>
        
        <div className="dept-distribution">
          {departments.length === 0 ? (
            <p className="empty-msg">No data available for distribution.</p>
          ) : (
            departments.map(dept => (
              <div key={dept} className="dept-row">
                <div className="dept-label">
                  <span>{dept}</span>
                  <span className="dept-count">{deptCounts[dept]} employees</span>
                </div>
                <div className="dept-progress-bg">
                  <div 
                    className="dept-progress-bar" 
                    style={{ width: `${(deptCounts[dept] / totalEmployees) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsView;

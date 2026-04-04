import { FiGrid, FiLogOut, FiChevronLeft, FiPieChart } from 'react-icons/fi';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = ({ setAuth }) => {
  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setAuth(false);
    } catch (error) {
      console.error("Logout failed");
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo-icon">
          <FiPieChart />
        </div>
        <span className="brand-name">EmpManager</span>
        <FiChevronLeft className="toggle-sidebar" />
      </div>

      <nav className="sidebar-nav">
        <div className="nav-item active">
          <FiGrid className="nav-icon" />
          <span>Dashboard</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="admin-profile">
          <div className="admin-avatar">A</div>
          <div className="admin-info">
            <span className="admin-name">Admin</span>
            <span className="admin-role">Admin</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <FiLogOut /> <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

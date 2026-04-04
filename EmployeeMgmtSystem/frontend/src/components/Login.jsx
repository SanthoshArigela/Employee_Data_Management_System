import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiLock, FiUser } from 'react-icons/fi';
import './Login.css';

const Login = ({ setAuth, setRole }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/auth/login', credentials);
      setAuth(true);
      setRole(res.data.role);

      // Redirect based on username as requested
      if (credentials.username === 'admin') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper fade-in">
      <div className="login-card glass-panel">
        <div className="login-header">
          <h1>Welcome Back...!!!</h1>
          <p>Sign in to Employee System</p>
        </div>
        {error && <div className="error-msg">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', top: '12px', left: '12px', color: '#94a3b8' }} />
              <input
                type="text"
                name="username"
                className="form-control"
                style={{ paddingLeft: '2.5rem', width: '100%' }}
                value={credentials.username}
                onChange={handleChange}
                required
                placeholder="Enter Username"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', top: '12px', left: '12px', color: '#94a3b8' }} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', width: '100%' }}
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="Enter Password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  userSelect: 'none'
                }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          {/* <p>Default credentials: admin / admin123</p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;

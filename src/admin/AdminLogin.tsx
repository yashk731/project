import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/googleSheets';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      const from = (location.state as { from?: string })?.from || '/admin/dashboard';
      navigate(from, { replace: true });
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <i className="bi bi-shield-lock-fill"></i>
        </div>
        <h3 className="text-center fw-bold mb-1">India GCC Admin</h3>
        <p className="text-center text-muted mb-4" style={{ fontSize: '0.85rem' }}>
          Consumer Benefit Solutions
        </p>

        {error && (
          <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem' }}>
            <i className="bi bi-exclamation-circle me-1"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Username</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-person text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Enter username"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-lock text-muted"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control border-start-0 border-end-0"
                placeholder="Enter password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary border-start-0"
                onClick={() => setShowPassword(!showPassword)}
                style={{ fontSize: '0.8rem' }}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-aon-red w-100 py-2">
            <i className="bi bi-box-arrow-in-right me-2"></i>SIGN IN
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top">
          <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
            Demo credentials: <strong>admin</strong> / <strong>admin123</strong>
          </p>
          <a href="/" className="text-decoration-none mt-2 d-inline-block" style={{ fontSize: '0.8rem', color: 'var(--aon-red)' }}>
            <i className="bi bi-arrow-left me-1"></i>Back to site
          </a>
        </div>
      </div>
    </div>
  );
}

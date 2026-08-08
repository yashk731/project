import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { logout } from '../services/googleSheets';
import { useAdmin } from './AdminContext';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
  { to: '/admin/team', icon: 'bi-people-fill', label: 'Team Members' },
  { to: '/admin/structure', icon: 'bi-diagram-3-fill', label: 'Team Structure' },
  { to: '/admin/modules', icon: 'bi-grid-3x3-gap-fill', label: 'Modules' },
  { to: '/admin/gallery', icon: 'bi-images', label: 'Gallery' },
  { to: '/admin/settings', icon: 'bi-gear-fill', label: 'Settings' },
];

function usePageTitle() {
  const location = useLocation();
  const item = NAV_ITEMS.find(n => n.to === location.pathname);
  return item ? item.label : 'Dashboard';
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { saving, toasts, dismissToast } = useAdmin();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-body">
      {/* Toasts */}
      <div className="toast-container-custom">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`toast show align-items-center text-white border-0 mb-2 ${
              t.type === 'success' ? 'bg-success' : t.type === 'error' ? 'bg-danger' : 'bg-info'
            }`}
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body" style={{ fontSize: '0.85rem' }}>
                <i className={`bi ${
                  t.type === 'success' ? 'bi-check-circle' :
                  t.type === 'error' ? 'bi-x-circle' : 'bi-info-circle'
                } me-2`}></i>
                {t.message}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => dismissToast(t.id)}></button>
            </div>
          </div>
        ))}
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="admin-overlay show" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="p-4 border-bottom border-secondary">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-black text-aon-red" style={{ fontSize: '1.25rem', fontWeight: 800 }}>India</span>
            <span className="text-white" style={{ fontSize: '1.25rem', fontWeight: 800 }}>GCC</span>
          </div>
          <p className="text-white-50 mt-1 mb-0" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
            Admin Panel
          </p>
        </div>

        <nav className="flex-grow-1 py-3 overflow-auto">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-top border-secondary">
          <Link to="/" className="nav-link" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <i className="bi bi-globe"></i>
            View Public Site
          </Link>
          <button onClick={handleLogout} className="nav-link btn btn-link text-start p-0 w-100" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <button
            className="btn btn-link d-md-none p-0 me-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="bi bi-list fs-4 text-dark"></i>
          </button>
          <h5 className="mb-0 fw-bold text-dark">{usePageTitle()}</h5>
          <div className="ms-auto d-flex align-items-center gap-3">
            {saving && (
              <span className="badge bg-light text-dark border d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                <span className="spinner-border spinner-border-sm text-aon-red" style={{ width: '0.8rem', height: '0.8rem' }}></span>
                Saving...
              </span>
            )}
            <div className="dropdown">
              <button className="btn btn-light btn-sm dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                <div className="bg-aon-red text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', fontSize: '0.75rem', fontWeight: 700 }}>
                  A
                </div>
                <span className="d-none d-sm-inline fw-semibold" style={{ fontSize: '0.85rem' }}>Admin</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
              </ul>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

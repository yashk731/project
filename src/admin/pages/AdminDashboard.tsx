import { useAdmin } from '../AdminContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { data } = useAdmin();

  const stats = [
    { label: 'Team Members', value: data.teamMembers.length, icon: 'bi-people-fill', color: '#cc0000', bg: '#fff5f5', link: '/admin/team' },
    { label: 'Modules', value: data.modules.length, icon: 'bi-grid-3x3-gap-fill', color: '#0d6efd', bg: '#e7f1ff', link: '/admin/modules' },
    { label: 'Gallery Photos', value: data.gallery.length, icon: 'bi-images', color: '#198754', bg: '#e8f5e9', link: '/admin/gallery' },
    { label: 'AON Tools', value: data.config.tools.length, icon: 'bi-tools', color: '#6f42c1', bg: '#f3e8ff', link: '/admin/settings' },
  ];

  return (
    <div>
      {/* Welcome banner */}
      <div className="admin-card p-4 mb-4" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', borderRadius: '0.75rem' }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h3 className="text-white fw-bold mb-1">Welcome back, Admin!</h3>
            <p className="text-white-50 mb-0" style={{ fontSize: '0.875rem' }}>
              Manage your India GCC website content from here.
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/team" className="btn btn-aon-red btn-sm">
              <i className="bi bi-person-plus me-1"></i>Add Member
            </Link>
            <Link to="/admin/gallery" className="btn btn-outline-light btn-sm">
              <i className="bi bi-image me-1"></i>Add Photo
            </Link>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        {stats.map(s => (
          <div key={s.label} className="col-6 col-lg-3">
            <Link to={s.link} className="text-decoration-none">
              <div className="card stat-card h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="stat-icon flex-shrink-0" style={{ background: s.bg, color: s.color }}>
                    <i className={`bi ${s.icon}`}></i>
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0 text-dark">{s.value}</h3>
                    <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>{s.label}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Recent team members */}
      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="admin-card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0">Recent Team Members</h6>
                <Link to="/admin/team" className="text-decoration-none" style={{ fontSize: '0.8rem', color: 'var(--aon-red)' }}>
                  View all <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
              {data.teamMembers.length === 0 ? (
                <p className="text-muted text-center py-4" style={{ fontSize: '0.85rem' }}>No members yet</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {data.teamMembers.slice(-4).reverse().map(m => (
                    <div key={m.id} className="d-flex align-items-center gap-3 p-2 rounded-3 hover-bg-light">
                      <img src={m.photo} alt={m.name} className="admin-avatar" style={{ width: '36px', height: '36px' }} />
                      <div className="flex-grow-1">
                        <p className="fw-semibold mb-0 text-dark" style={{ fontSize: '0.85rem' }}>{m.name}</p>
                        <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>{m.email}</p>
                      </div>
                      <span className="badge bg-light text-dark" style={{ fontSize: '0.7rem' }}>{m.dept}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="col-12 col-lg-6">
          <div className="admin-card h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Quick Actions</h6>
              <div className="row g-2">
                {[
                  { label: 'Add Team Member', icon: 'bi-person-plus', to: '/admin/team', color: 'var(--aon-red)' },
                  { label: 'Add Module', icon: 'bi-plus-square', to: '/admin/modules', color: '#0d6efd' },
                  { label: 'Add Gallery Photo', icon: 'bi-image', to: '/admin/gallery', color: '#198754' },
                  { label: 'Edit Settings', icon: 'bi-gear', to: '/admin/settings', color: '#6f42c1' },
                ].map(a => (
                  <div key={a.label} className="col-6">
                    <Link to={a.to} className="text-decoration-none">
                      <div className="border rounded-3 p-3 text-center h-100 hover-shadow-sm transition">
                        <i className={`bi ${a.icon} fs-4`} style={{ color: a.color }}></i>
                        <p className="fw-semibold mb-0 mt-2 text-dark" style={{ fontSize: '0.8rem' }}>{a.label}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Checklist preview */}
              <div className="mt-4 pt-3 border-top">
                <h6 className="fw-bold mb-2" style={{ fontSize: '0.85rem' }}>New Joiner Checklist</h6>
                <ul className="list-unstyled mb-0">
                  {data.config.checklist.map((item, i) => (
                    <li key={i} className="d-flex align-items-center gap-2 py-1" style={{ fontSize: '0.8rem' }}>
                      <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '0.7rem' }}></i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

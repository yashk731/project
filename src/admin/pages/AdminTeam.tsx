import { useState } from 'react';
import { useAdmin } from '../AdminContext';
import type { TeamMember } from '../../types';
import { fileToBase64 } from '../../utils/imageUpload';

const EMPTY_MEMBER: Omit<TeamMember, 'id'> = {
  name: '',
  photo: '',
  bio: '',
  birthday: '',
  email: '',
  dept: 'CBS',
  interests: '',
  motivators: '',
};

export default function AdminTeam() {
  const { data, addMember, updateMember, deleteMember, loading } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<TeamMember, 'id'>>(EMPTY_MEMBER);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setForm(prev => ({ ...prev, photo: base64 }));
    } catch {
      // ignore read errors
    }
    setUploading(false);
  };

  const openAdd = () => {
    setForm(EMPTY_MEMBER);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (m: TeamMember) => {
    const { id, ...rest } = m;
    void id;
    setForm(rest);
    setEditingId(id);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMember(editingId, form);
    } else {
      addMember(form);
    }
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMember(deleteId);
      setDeleteId(null);
    }
  };

  const filtered = data.teamMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border loading-spinner" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h4 className="fw-bold mb-0">Team Members</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Manage your team profiles</p>
        </div>
        <button className="btn btn-aon-red" onClick={openAdd}>
          <i className="bi bi-person-plus me-2"></i>Add Member
        </button>
      </div>

      {/* Search */}
      <div className="admin-card mb-3">
        <div className="card-body py-3">
          <div className="input-group" style={{ maxWidth: '400px' }}>
            <span className="input-group-text bg-light">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card">
        <div className="card-body">
          {filtered.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-3">No team members found</p>
              <button className="btn btn-aon-red" onClick={openAdd}>
                <i className="bi bi-person-plus me-2"></i>Add First Member
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table admin-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Email</th>
                    <th>Dept</th>
                    <th>Birthday</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(m => (
                    <tr key={m.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img src={m.photo} alt={m.name} className="admin-avatar" />
                          <div>
                            <p className="fw-semibold mb-0 text-dark" style={{ fontSize: '0.875rem' }}>{m.name}</p>
                            <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>{m.bio.substring(0, 50)}{m.bio.length > 50 ? '...' : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{m.email}</td>
                      <td><span className="badge bg-light text-dark border">{m.dept}</span></td>
                      <td style={{ fontSize: '0.85rem' }}>{m.birthday}</td>
                      <td>
                        <div className="d-flex justify-content-end gap-1">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => openEdit(m)} title="Edit">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteId(m.id)} title="Delete">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: '0.75rem' }}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">{editingId ? 'Edit Member' : 'Add New Member'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Full Name *</label>
                        <input type="text" className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Email *</label>
                        <input type="email" className="form-control" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Department</label>
                        <input type="text" className="form-control" value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Birthday</label>
                        <input type="text" className="form-control" placeholder="e.g. 12th July" value={form.birthday} onChange={e => setForm({ ...form, birthday: e.target.value })} />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Photo *</label>
                        <div className="d-flex align-items-center gap-3">
                          {form.photo ? (
                            <img src={form.photo} alt="Preview" className="rounded-3" style={{ width: '80px', height: '80px', objectFit: 'cover', border: '1px solid #dee2e6' }} />
                          ) : (
                            <div className="d-flex align-items-center justify-content-center rounded-3 bg-light border" style={{ width: '80px', height: '80px' }}>
                              <i className="bi bi-person text-muted" style={{ fontSize: '1.5rem' }}></i>
                            </div>
                          )}
                          <div className="flex-grow-1">
                            <input type="file" accept="image/*" className="form-control" onChange={handlePhotoUpload} />
                            {uploading && <p className="text-muted mt-1" style={{ fontSize: '0.75rem' }}><span className="spinner-border spinner-border-sm me-1"></span>Uploading...</p>}
                            {form.photo && !uploading && (
                              <button type="button" className="btn btn-sm btn-outline-danger mt-1" onClick={() => setForm({ ...form, photo: '' })}>
                                <i className="bi bi-x-circle me-1"></i>Remove Photo
                              </button>
                            )}
                          </div>
                        </div>
                        <input type="hidden" required value={form.photo} onChange={() => {}} />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Bio</label>
                        <textarea className="form-control" rows={2} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Interests / Hobbies</label>
                        <textarea className="form-control" rows={2} value={form.interests} onChange={e => setForm({ ...form, interests: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Motivators</label>
                        <textarea className="form-control" rows={2} value={form.motivators} onChange={e => setForm({ ...form, motivators: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-aon-red">
                      <i className="bi bi-check-lg me-1"></i>{editingId ? 'Save Changes' : 'Add Member'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: '0.75rem' }}>
                <div className="modal-body text-center p-4">
                  <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                    <i className="bi bi-exclamation-triangle-fill text-danger fs-3"></i>
                  </div>
                  <h5 className="fw-bold">Delete this member?</h5>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>This action cannot be undone.</p>
                  <div className="d-flex gap-2 justify-content-center mt-3">
                    <button className="btn btn-light" onClick={() => setDeleteId(null)}>Cancel</button>
                    <button className="btn btn-danger" onClick={confirmDelete}>
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

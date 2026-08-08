import { useState } from 'react';
import { useAdmin } from '../AdminContext';
import type { OrgNode } from '../../types';
import { fileToBase64 } from '../../utils/imageUpload';

const EMPTY_NODE: Omit<OrgNode, 'id'> = {
  name: '',
  role: '',
  photo: '',
  parentId: null,
  email: '',
  phone: '',
  location: '',
};

export default function AdminTeamStructure() {
  const { data, addOrgNode, updateOrgNode, deleteOrgNode, loading } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<OrgNode, 'id'>>(EMPTY_NODE);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => {
    setForm(EMPTY_NODE);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (n: OrgNode) => {
    const { id, ...rest } = n;
    void id;
    setForm(rest);
    setEditingId(id);
    setShowModal(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setForm(prev => ({ ...prev, photo: base64 }));
    } catch {
      // ignore
    }
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateOrgNode(editingId, form);
    } else {
      addOrgNode(form);
    }
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteOrgNode(deleteId);
      setDeleteId(null);
    }
  };

  const buildTree = (nodes: OrgNode[], parentId: string | null): OrgNode[] => {
    return nodes.filter(n => n.parentId === parentId);
  };

  const renderTree = (nodes: OrgNode[], parentId: string | null, level: number = 0): React.ReactNode => {
    const children = buildTree(nodes, parentId);
    if (children.length === 0) return null;
    return (
      <ul className="list-unstyled ms-3" style={{ borderLeft: level > 0 ? '2px solid #e9ecef' : 'none', paddingLeft: level > 0 ? '1rem' : 0 }}>
        {children.map(node => {
          const hasChildren = nodes.some(n => n.parentId === node.id);
          return (
            <li key={node.id} className="mb-2">
              <div className="d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: '0.85rem' }}>
                <span style={{ width: `${12 - level}px` }}></span>
                {node.photo ? (
                  <img src={node.photo} alt={node.name} className="rounded-circle" style={{ width: '32px', height: '32px', objectFit: 'cover', border: '2px solid #cc0000' }} />
                ) : (
                  <div className="d-flex align-items-center justify-content-center rounded-circle bg-light border" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-person text-muted" style={{ fontSize: '0.8rem' }}></i>
                  </div>
                )}
                <div className="flex-grow-1">
                  <span className="fw-semibold text-dark">{node.name}</span>
                  <span className="text-muted ms-2" style={{ fontSize: '0.75rem' }}>{node.role}</span>
                  {node.location && <span className="badge bg-light text-muted border ms-2" style={{ fontSize: '0.65rem' }}><i className="bi bi-geo-alt me-1"></i>{node.location}</span>}
                </div>
                <button className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => openEdit(node)} title="Edit">
                  <i className="bi bi-pencil" style={{ fontSize: '0.7rem' }}></i>
                </button>
                <button className="btn btn-sm btn-outline-danger py-0 px-2" onClick={() => setDeleteId(node.id)} title="Delete" disabled={node.parentId === null && hasChildren}>
                  <i className="bi bi-trash" style={{ fontSize: '0.7rem' }}></i>
                </button>
              </div>
              {renderTree(nodes, node.id, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

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
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h4 className="fw-bold mb-0">Team Structure</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Manage the organizational hierarchy chart</p>
        </div>
        <button className="btn btn-aon-red" onClick={openAdd}>
          <i className="bi bi-person-plus me-2"></i>Add Member
        </button>
      </div>

      <div className="admin-card">
        <div className="card-body">
          {data.orgChart.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-diagram-3 text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-3">No team structure yet</p>
              <button className="btn btn-aon-red" onClick={openAdd}>
                <i className="bi bi-person-plus me-2"></i>Add First Member
              </button>
            </div>
          ) : (
            <>
              <div className="mb-3 pb-3 border-bottom">
                <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                  <i className="bi bi-info-circle me-1"></i>
                  The hierarchy shows reporting relationships. Root-level members have no parent. Deleting a member moves their direct reports up to the deleted member's parent.
                </p>
              </div>
              {renderTree(data.orgChart, null, 0)}
            </>
          )}
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: '0.75rem' }}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">{editingId ? 'Edit Member' : 'Add Team Member'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Photo</label>
                      <div className="d-flex align-items-center gap-3">
                        {form.photo ? (
                          <img src={form.photo} alt="Preview" className="rounded-circle" style={{ width: '64px', height: '64px', objectFit: 'cover', border: '2px solid #cc0000' }} />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center rounded-circle bg-light border" style={{ width: '64px', height: '64px' }}>
                            <i className="bi bi-person text-muted" style={{ fontSize: '1.5rem' }}></i>
                          </div>
                        )}
                        <div className="flex-grow-1">
                          <input type="file" accept="image/*" className="form-control" onChange={handleUpload} />
                          {uploading && <p className="text-muted mt-1" style={{ fontSize: '0.75rem' }}><span className="spinner-border spinner-border-sm me-1"></span>Uploading...</p>}
                          {form.photo && !uploading && (
                            <button type="button" className="btn btn-sm btn-outline-danger mt-1" onClick={() => setForm({ ...form, photo: '' })}>
                              <i className="bi bi-x-circle me-1"></i>Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Name *</label>
                        <input type="text" className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Role *</label>
                        <input type="text" className="form-control" required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Operations Lead" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Reports To</label>
                        <select className="form-select" value={form.parentId || ''} onChange={e => setForm({ ...form, parentId: e.target.value || null })}>
                          <option value="">— Root (No parent) —</option>
                          {data.orgChart.filter(n => n.id !== editingId).map(n => (
                            <option key={n.id} value={n.id}>{n.name} ({n.role})</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Location</label>
                        <input type="text" className="form-control" value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Noida" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Email</label>
                        <input type="email" className="form-control" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@aon.com" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Phone</label>
                        <input type="tel" className="form-control" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 ..." />
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
                  <h5 className="fw-bold">Remove this member?</h5>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {data.orgChart.find(n => n.id === deleteId)?.name} will be removed. Their direct reports will move up to this member's parent.
                  </p>
                  <div className="d-flex gap-2 justify-content-center mt-3">
                    <button className="btn btn-light" onClick={() => setDeleteId(null)}>Cancel</button>
                    <button className="btn btn-danger" onClick={confirmDelete}>
                      <i className="bi bi-trash me-1"></i>Remove
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

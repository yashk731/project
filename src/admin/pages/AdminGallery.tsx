import { useState } from 'react';
import { useAdmin } from '../AdminContext';
import type { GalleryPhoto } from '../../types';
import { fileToBase64 } from '../../utils/imageUpload';

const EMPTY_PHOTO: Omit<GalleryPhoto, 'id'> = {
  url: '',
  category: 'All',
  tag: '',
};

export default function AdminGallery() {
  const { data, addPhoto, updatePhoto, deletePhoto, addGalleryCategory, deleteGalleryCategory, loading } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<GalleryPhoto, 'id'>>(EMPTY_PHOTO);
  const [filter, setFilter] = useState('All');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [deleteCat, setDeleteCat] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setForm(prev => ({ ...prev, url: base64 }));
    } catch {
      // ignore read errors
    }
    setUploading(false);
  };

  const openAdd = () => {
    setForm({ ...EMPTY_PHOTO, category: filter === 'All' ? (data.galleryCategories[1] || 'All') : filter });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (p: GalleryPhoto) => {
    const { id, ...rest } = p;
    void id;
    setForm(rest);
    setEditingId(id);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updatePhoto(editingId, form);
    } else {
      addPhoto(form);
    }
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deletePhoto(deleteId);
      setDeleteId(null);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addGalleryCategory(newCategory.trim());
      setNewCategory('');
      setShowCatModal(false);
    }
  };

  const confirmDeleteCategory = () => {
    if (deleteCat) {
      deleteGalleryCategory(deleteCat);
      setDeleteCat(null);
      if (filter === deleteCat) setFilter('All');
    }
  };

  const filtered = data.gallery.filter(p => filter === 'All' || p.category === filter);

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
          <h4 className="fw-bold mb-0">Gallery</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Manage your photo gallery</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-aon-red" onClick={() => setShowCatModal(true)}>
            <i className="bi bi-tags me-2"></i>Manage Categories
          </button>
          <button className="btn btn-aon-red" onClick={openAdd}>
            <i className="bi bi-image me-2"></i>Add Photo
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {data.galleryCategories.map(cat => (
          <button
            key={cat}
            className={`btn ${filter === cat ? 'btn-aon-red' : 'btn-light border'}`}
            onClick={() => setFilter(cat)}
            style={{ fontSize: '0.85rem' }}
          >
            {cat}
            {cat !== 'All' && (
              <span className="badge bg-secondary bg-opacity-50 ms-1" style={{ fontSize: '0.65rem' }}>
                {data.gallery.filter(p => p.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="admin-card">
        <div className="card-body">
          {filtered.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-images text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-3">No photos found</p>
              <button className="btn btn-aon-red" onClick={openAdd}>
                <i className="bi bi-image me-2"></i>Add First Photo
              </button>
            </div>
          ) : (
            <div className="row g-3">
              {filtered.map(p => (
                <div key={p.id} className="col-6 col-md-4 col-lg-3">
                  <div className="position-relative rounded-3 overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img src={p.url} alt={p.tag} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    <div className="position-absolute top-0 start-0 end-0 d-flex justify-content-between p-2">
                      <span className="badge bg-dark bg-opacity-75" style={{ fontSize: '0.65rem' }}>{p.category}</span>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-light border-0 py-0 px-1" onClick={() => openEdit(p)} title="Edit" style={{ width: '24px', height: '24px' }}>
                          <i className="bi bi-pencil" style={{ fontSize: '0.65rem' }}></i>
                        </button>
                        <button className="btn btn-sm btn-danger border-0 py-0 px-1" onClick={() => setDeleteId(p.id)} title="Delete" style={{ width: '24px', height: '24px' }}>
                          <i className="bi bi-trash" style={{ fontSize: '0.65rem' }}></i>
                        </button>
                      </div>
                    </div>
                    <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-50 text-white p-2">
                      <p className="mb-0 fw-semibold" style={{ fontSize: '0.75rem' }}>{p.tag}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Photo Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: '0.75rem' }}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">{editingId ? 'Edit Photo' : 'Add New Photo'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Image *</label>
                      <div className="text-center">
                        {form.url ? (
                          <div className="position-relative d-inline-block">
                            <img src={form.url} alt="Preview" className="rounded-3" style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'cover' }} />
                            <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1" onClick={() => setForm({ ...form, url: '' })}>
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        ) : (
                          <label className="d-flex flex-column align-items-center justify-content-center border border-2 border-dashed rounded-3 py-4 px-3" style={{ cursor: 'pointer', borderColor: '#dee2e6' }}>
                            <i className="bi bi-cloud-arrow-up text-muted" style={{ fontSize: '2rem' }}></i>
                            <span className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>Click to upload an image</span>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>PNG, JPG, GIF up to 5MB</span>
                            <input type="file" accept="image/*" className="d-none" onChange={handleImageUpload} />
                          </label>
                        )}
                        {uploading && <p className="text-muted mt-2" style={{ fontSize: '0.75rem' }}><span className="spinner-border spinner-border-sm me-1"></span>Uploading...</p>}
                      </div>
                      <input type="hidden" required value={form.url} onChange={() => {}} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Tag / Caption *</label>
                      <input type="text" className="form-control" required value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} placeholder="e.g. Team Lunch" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Category</label>
                      <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                        {data.galleryCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <p className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                        <i className="bi bi-info-circle me-1"></i>
                        Use "Manage Categories" to add new categories.
                      </p>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-aon-red">
                      <i className="bi bi-check-lg me-1"></i>{editingId ? 'Save Changes' : 'Add Photo'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Manage Categories Modal */}
      {showCatModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: '0.75rem' }}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-tags me-2"></i>Manage Categories
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowCatModal(false)}></button>
                </div>
                <div className="modal-body">
                  {/* Add new category */}
                  <div className="d-flex gap-2 mb-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="New category name..."
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
                      autoFocus
                    />
                    <button className="btn btn-aon-red" onClick={handleAddCategory} type="button">
                      <i className="bi bi-plus-lg me-1"></i>Add
                    </button>
                  </div>

                  {/* Existing categories */}
                  <label className="form-label fw-semibold mb-2" style={{ fontSize: '0.85rem' }}>Existing Categories</label>
                  <ul className="list-group">
                    {data.galleryCategories.map(cat => {
                      const count = data.gallery.filter(p => p.category === cat).length;
                      const isAll = cat === 'All';
                      return (
                        <li key={cat} className="list-group-item d-flex align-items-center justify-content-between" style={{ fontSize: '0.85rem' }}>
                          <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-tag-fill text-aon-red" style={{ fontSize: '0.7rem' }}></i>
                            <span className="fw-semibold">{cat}</span>
                            <span className="badge bg-light text-muted border">{count} photo{count !== 1 ? 's' : ''}</span>
                            {isAll && <span className="badge bg-info bg-opacity-10 text-info" style={{ fontSize: '0.65rem' }}>Default</span>}
                          </div>
                          {!isAll && (
                            <button
                              className="btn btn-sm btn-outline-danger py-0 px-2"
                              onClick={() => setDeleteCat(cat)}
                              title="Delete category"
                            >
                              <i className="bi bi-trash" style={{ fontSize: '0.7rem' }}></i>
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <p className="text-muted mt-3 mb-0" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-info-circle me-1"></i>
                    Deleting a category moves its photos back to "All". The "All" category cannot be deleted.
                  </p>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowCatModal(false)}>Done</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Photo Confirm */}
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
                  <h5 className="fw-bold">Delete this photo?</h5>
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

      {/* Delete Category Confirm */}
      {deleteCat && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: '0.75rem' }}>
                <div className="modal-body text-center p-4">
                  <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                    <i className="bi bi-exclamation-triangle-fill text-danger fs-3"></i>
                  </div>
                  <h5 className="fw-bold">Delete "{deleteCat}"?</h5>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {data.gallery.filter(p => p.category === deleteCat).length} photo(s) will be moved to "All".
                  </p>
                  <div className="d-flex gap-2 justify-content-center mt-3">
                    <button className="btn btn-light" onClick={() => setDeleteCat(null)}>Cancel</button>
                    <button className="btn btn-danger" onClick={confirmDeleteCategory}>
                      <i className="bi bi-trash me-1"></i>Delete Category
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

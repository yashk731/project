import { useState } from 'react';
import { useAdmin } from '../AdminContext';
import type { ModuleItem, ModuleContentItem, AccordionItem, ModuleContentType } from '../../types';

const ICON_OPTIONS = [
  'Link2', 'Users', 'Phone', 'Calendar', 'ShieldCheck', 'FileText', 'GitBranch', 'Layers',
  'Settings', 'BarChart2', 'MessageSquare', 'HelpCircle', 'BookOpen', 'Star', 'Award',
  'Briefcase', 'Target', 'TrendingUp', 'CheckSquare', 'ClipboardList',
];

const EMPTY_MODULE: Omit<ModuleItem, 'id'> = { icon: 'Star', label: '', content: [] };

const EMPTY_CONTENT: Omit<ModuleContentItem, 'id'> = {
  type: 'accordion',
  title: '',
  accordionItems: [],
  pdfUrl: '',
  linkUrl: '',
};

const EMPTY_ACCORDION: Omit<AccordionItem, 'id'> = { title: '', body: '' };

function genId(prefix: string): string {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export default function AdminModules() {
  const { data, addModule, updateModule, deleteModule, loading } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<ModuleItem, 'id'>>(EMPTY_MODULE);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // content editing
  const [showContentModal, setShowContentModal] = useState(false);
  const [contentModuleId, setContentModuleId] = useState<string | null>(null);
  const [contentForm, setContentForm] = useState<Omit<ModuleContentItem, 'id'>>(EMPTY_CONTENT);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [deleteContentId, setDeleteContentId] = useState<string | null>(null);

  const openAdd = () => {
    setForm(EMPTY_MODULE);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (m: ModuleItem) => {
    const { id, ...rest } = m;
    void id;
    setForm(rest);
    setEditingId(id);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateModule(editingId, form);
    } else {
      addModule(form);
    }
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteModule(deleteId);
      setDeleteId(null);
    }
  };

  // ── Content CRUD ──
  const openAddContent = (moduleId: string) => {
    setContentModuleId(moduleId);
    setContentForm({ ...EMPTY_CONTENT, accordionItems: [] });
    setEditingContentId(null);
    setShowContentModal(true);
  };

  const openEditContent = (moduleId: string, c: ModuleContentItem) => {
    setContentModuleId(moduleId);
    const { id, ...rest } = c;
    void id;
    setContentForm(rest);
    setEditingContentId(id);
    setShowContentModal(true);
  };

  const handleContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentModuleId) return;
    const module = data.modules.find(m => m.id === contentModuleId);
    if (!module) return;

    let newContent: ModuleContentItem[];
    if (editingContentId) {
      newContent = module.content.map(c =>
        c.id === editingContentId ? { ...c, ...contentForm } : c
      );
    } else {
      newContent = [...module.content, { ...contentForm, id: genId('c') }];
    }
    updateModule(contentModuleId, { content: newContent });
    setShowContentModal(false);
  };

  const confirmDeleteContent = () => {
    if (!deleteContentId || !contentModuleId) {
      setDeleteContentId(null);
      return;
    }
    const module = data.modules.find(m => m.id === contentModuleId);
    if (!module) {
      setDeleteContentId(null);
      return;
    }
    updateModule(contentModuleId, {
      content: module.content.filter(c => c.id !== deleteContentId),
    });
    setDeleteContentId(null);
  };

  // ── Accordion item helpers (within contentForm) ──
  const addAccordionItem = () => {
    setContentForm(prev => ({
      ...prev,
      accordionItems: [...(prev.accordionItems || []), { ...EMPTY_ACCORDION, id: genId('a') }],
    }));
  };

  const updateAccordionItem = (id: string, field: 'title' | 'body', value: string) => {
    setContentForm(prev => ({
      ...prev,
      accordionItems: (prev.accordionItems || []).map(a =>
        a.id === id ? { ...a, [field]: value } : a
      ),
    }));
  };

  const removeAccordionItem = (id: string) => {
    setContentForm(prev => ({
      ...prev,
      accordionItems: (prev.accordionItems || []).filter(a => a.id !== id),
    }));
  };

  const handleTypeChange = (type: ModuleContentType) => {
    setContentForm(prev => ({
      ...prev,
      type,
      accordionItems: type === 'accordion' ? (prev.accordionItems || []) : [],
      pdfUrl: type === 'pdf' ? (prev.pdfUrl || '') : '',
      linkUrl: type === 'link' ? (prev.linkUrl || '') : '',
    }));
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
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h4 className="fw-bold mb-0">Modules</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Manage module cards and their content (accordion, PDF, or link)</p>
        </div>
        <button className="btn btn-aon-red" onClick={openAdd}>
          <i className="bi bi-plus-lg me-2"></i>Add Module
        </button>
      </div>

      {/* Grid */}
      <div className="admin-card">
        <div className="card-body">
          {data.modules.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-grid-3x3-gap text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-3">No modules yet</p>
              <button className="btn btn-aon-red" onClick={openAdd}>
                <i className="bi bi-plus-lg me-2"></i>Add First Module
              </button>
            </div>
          ) : (
            <div className="row g-3">
              {data.modules.map(m => (
                <div key={m.id} className="col-12 col-md-6 col-lg-4">
                  <div className="border rounded-3 p-3 h-100 position-relative group">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', background: 'var(--aon-red-light)' }}>
                        <i className={`bi bi-${m.icon === 'Link2' ? 'link-45deg' : m.icon === 'ShieldCheck' ? 'shield-check' : m.icon === 'FileText' ? 'file-earmark-text' : m.icon === 'GitBranch' ? 'diagram-2' : m.icon === 'Layers' ? 'stack' : m.icon === 'BarChart2' ? 'bar-chart-line' : m.icon === 'HelpCircle' ? 'question-circle' : m.icon === 'BookOpen' ? 'book' : 'star'} text-aon-red`}></i>
                      </div>
                      <p className="fw-semibold text-dark mb-0 flex-grow-1" style={{ fontSize: '0.85rem' }}>{m.label}</p>
                    </div>

                    {/* Content items */}
                    {m.content.length > 0 ? (
                      <div className="mt-2">
                        {m.content.map(c => (
                          <div key={c.id} className="d-flex align-items-center gap-2 py-1 px-2 rounded-2 mb-1" style={{ fontSize: '0.75rem', background: '#f8f9fa' }}>
                            <i className={`bi bi-${c.type === 'accordion' ? 'list-ul' : c.type === 'pdf' ? 'file-earmark-pdf' : 'link-45deg'} text-aon-red`}></i>
                            <span className="flex-grow-1 text-truncate">{c.title || `Untitled ${c.type}`}</span>
                            <button className="btn btn-sm btn-outline-secondary py-0 px-1" onClick={() => openEditContent(m.id, c)} title="Edit content">
                              <i className="bi bi-pencil" style={{ fontSize: '0.65rem' }}></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger py-0 px-1" onClick={() => { setContentModuleId(m.id); setDeleteContentId(c.id); }} title="Delete content">
                              <i className="bi bi-trash" style={{ fontSize: '0.65rem' }}></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.7rem' }}>No content yet</p>
                    )}

                    <div className="d-flex gap-1 mt-2 pt-2 border-top flex-wrap">
                      <button className="btn btn-sm btn-outline-aon-red py-0 px-2" style={{ fontSize: '0.7rem' }} onClick={() => openAddContent(m.id)}>
                        <i className="bi bi-plus-lg me-1"></i>Add Content
                      </button>
                      <button className="btn btn-sm btn-outline-secondary py-0 px-2" style={{ fontSize: '0.7rem' }} onClick={() => openEdit(m)}>
                        <i className="bi bi-pencil me-1"></i>Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger py-0 px-2" style={{ fontSize: '0.7rem' }} onClick={() => setDeleteId(m.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Add/Edit Module Modal ── */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: '0.75rem' }}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">{editingId ? 'Edit Module' : 'Add New Module'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Label *</label>
                      <input type="text" className="form-control" required value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. Important Links" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Icon</label>
                      <select className="form-select" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}>
                        {ICON_OPTIONS.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                      <p className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>Choose a Lucide icon name</p>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-aon-red">
                      <i className="bi bi-check-lg me-1"></i>{editingId ? 'Save Changes' : 'Add Module'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Add/Edit Content Modal ── */}
      {showContentModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content" style={{ borderRadius: '0.75rem' }}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">{editingContentId ? 'Edit Content' : 'Add Content'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowContentModal(false)}></button>
                </div>
                <form onSubmit={handleContentSubmit}>
                  <div className="modal-body">
                    {/* Type selector */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Content Type *</label>
                      <div className="d-flex gap-2">
                        {(['accordion', 'pdf', 'link'] as ModuleContentType[]).map(t => (
                          <button
                            key={t}
                            type="button"
                            className={`btn btn-sm flex-grow-1 ${contentForm.type === t ? 'btn-aon-red' : 'btn-outline-secondary'}`}
                            onClick={() => handleTypeChange(t)}
                          >
                            <i className={`bi bi-${t === 'accordion' ? 'list-ul' : t === 'pdf' ? 'file-earmark-pdf' : 'link-45deg'} me-1`}></i>
                            {t === 'accordion' ? 'Accordion' : t === 'pdf' ? 'PDF' : 'Link'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Title *</label>
                      <input type="text" className="form-control" required value={contentForm.title} onChange={e => setContentForm(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g. Team Overview" />
                    </div>

                    {/* Accordion editor */}
                    {contentForm.type === 'accordion' && (
                      <div>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <label className="form-label fw-semibold mb-0" style={{ fontSize: '0.85rem' }}>Accordion Sections</label>
                          <button type="button" className="btn btn-sm btn-outline-aon-red" onClick={addAccordionItem}>
                            <i className="bi bi-plus-lg me-1"></i>Add Section
                          </button>
                        </div>
                        {(contentForm.accordionItems || []).length === 0 ? (
                          <p className="text-muted" style={{ fontSize: '0.75rem' }}>No sections yet. Click "Add Section" to create one.</p>
                        ) : (
                          (contentForm.accordionItems || []).map((a, idx) => (
                            <div key={a.id} className="border rounded-3 p-3 mb-2" style={{ background: '#f8f9fa' }}>
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="badge bg-aon-red" style={{ fontSize: '0.65rem' }}>Section {idx + 1}</span>
                                <button type="button" className="btn btn-sm btn-outline-danger py-0 px-1" onClick={() => removeAccordionItem(a.id)}>
                                  <i className="bi bi-trash" style={{ fontSize: '0.7rem' }}></i>
                                </button>
                              </div>
                              <div className="mb-2">
                                <input type="text" className="form-control form-control-sm" placeholder="Section title" value={a.title} onChange={e => updateAccordionItem(a.id, 'title', e.target.value)} />
                              </div>
                              <textarea className="form-control form-control-sm" rows={3} placeholder="Section body text" value={a.body} onChange={e => updateAccordionItem(a.id, 'body', e.target.value)} />
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* PDF editor */}
                    {contentForm.type === 'pdf' && (
                      <div className="mb-3">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>PDF URL</label>
                        <input type="url" className="form-control" value={contentForm.pdfUrl || ''} onChange={e => setContentForm(prev => ({ ...prev, pdfUrl: e.target.value }))} placeholder="https://example.com/document.pdf" />
                        <p className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>Paste a direct link to a PDF file. It will open in a viewer when clicked.</p>
                      </div>
                    )}

                    {/* Link editor */}
                    {contentForm.type === 'link' && (
                      <div className="mb-3">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Link URL</label>
                        <input type="url" className="form-control" value={contentForm.linkUrl || ''} onChange={e => setContentForm(prev => ({ ...prev, linkUrl: e.target.value }))} placeholder="https://example.com" />
                        <p className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>The link will open in a new tab when clicked.</p>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-light" onClick={() => setShowContentModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-aon-red">
                      <i className="bi bi-check-lg me-1"></i>{editingContentId ? 'Save Content' : 'Add Content'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Delete Module Confirm ── */}
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
                  <h5 className="fw-bold">Delete this module?</h5>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>This will also remove all content inside it. This action cannot be undone.</p>
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

      {/* ── Delete Content Confirm ── */}
      {deleteContentId && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: '0.75rem' }}>
                <div className="modal-body text-center p-4">
                  <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                    <i className="bi bi-exclamation-triangle-fill text-danger fs-3"></i>
                  </div>
                  <h5 className="fw-bold">Delete this content?</h5>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>This action cannot be undone.</p>
                  <div className="d-flex gap-2 justify-content-center mt-3">
                    <button className="btn btn-light" onClick={() => setDeleteContentId(null)}>Cancel</button>
                    <button className="btn btn-danger" onClick={confirmDeleteContent}>
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

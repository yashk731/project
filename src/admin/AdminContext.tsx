import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { SiteData, TeamMember, ModuleItem, GalleryPhoto, OrgNode, Toast, ToastType } from '../types';
import { fetchData, saveData } from '../services/googleSheets';

interface AdminContextValue {
  data: SiteData;
  loading: boolean;
  saving: boolean;
  syncError: string | null;
  refresh: () => Promise<void>;
  // Team members
  addMember: (m: Omit<TeamMember, 'id'>) => Promise<void>;
  updateMember: (id: string, m: Partial<TeamMember>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  // Modules
  addModule: (m: Omit<ModuleItem, 'id'>) => Promise<void>;
  updateModule: (id: string, m: Partial<ModuleItem>) => Promise<void>;
  deleteModule: (id: string) => Promise<void>;
  // Gallery
  addPhoto: (p: Omit<GalleryPhoto, 'id'>) => Promise<void>;
  updatePhoto: (id: string, p: Partial<GalleryPhoto>) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
  // Config
  updateConfig: (tools: string[], checklist: string[]) => Promise<void>;
  // Gallery Categories
  addGalleryCategory: (name: string) => Promise<void>;
  deleteGalleryCategory: (name: string) => Promise<void>;
  // Org Chart
  addOrgNode: (n: Omit<OrgNode, 'id'>) => Promise<void>;
  updateOrgNode: (id: string, n: Partial<OrgNode>) => Promise<void>;
  deleteOrgNode: (id: string) => Promise<void>;
  // Toast
  toasts: Toast[];
  showToast: (message: string, type: ToastType) => void;
  dismissToast: (id: string) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

function genId(prefix: string): string {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = genId('t');
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const persist = useCallback(async (newData: SiteData) => {
    setSaving(true);
    setSyncError(null);
    try {
      const result = await saveData(newData);
      if (result.error) {
        setSyncError(result.error);
        showToast(result.error, 'info');
      }
    } finally {
      setSaving(false);
    }
  }, [showToast]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const d = await fetchData();
    setData(d);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ── Team Members ──
  const addMember = useCallback(async (m: Omit<TeamMember, 'id'>) => {
    if (!data) return;
    const newMember = { ...m, id: genId('tm') };
    const newData = { ...data, teamMembers: [...data.teamMembers, newMember] };
    setData(newData);
    await persist(newData);
    showToast('Team member added', 'success');
  }, [data, persist, showToast]);

  const updateMember = useCallback(async (id: string, m: Partial<TeamMember>) => {
    if (!data) return;
    const newData = {
      ...data,
      teamMembers: data.teamMembers.map(tm => tm.id === id ? { ...tm, ...m } : tm),
    };
    setData(newData);
    await persist(newData);
    showToast('Team member updated', 'success');
  }, [data, persist, showToast]);

  const deleteMember = useCallback(async (id: string) => {
    if (!data) return;
    const newData = { ...data, teamMembers: data.teamMembers.filter(tm => tm.id !== id) };
    setData(newData);
    await persist(newData);
    showToast('Team member deleted', 'error');
  }, [data, persist, showToast]);

  // ── Modules ──
  const addModule = useCallback(async (m: Omit<ModuleItem, 'id'>) => {
    if (!data) return;
    const newModule = { ...m, id: genId('m') };
    const newData = { ...data, modules: [...data.modules, newModule] };
    setData(newData);
    await persist(newData);
    showToast('Module added', 'success');
  }, [data, persist, showToast]);

  const updateModule = useCallback(async (id: string, m: Partial<ModuleItem>) => {
    if (!data) return;
    const newData = {
      ...data,
      modules: data.modules.map(mod => mod.id === id ? { ...mod, ...m } : mod),
    };
    setData(newData);
    await persist(newData);
    showToast('Module updated', 'success');
  }, [data, persist, showToast]);

  const deleteModule = useCallback(async (id: string) => {
    if (!data) return;
    const newData = { ...data, modules: data.modules.filter(mod => mod.id !== id) };
    setData(newData);
    await persist(newData);
    showToast('Module deleted', 'error');
  }, [data, persist, showToast]);

  // ── Gallery ──
  const addPhoto = useCallback(async (p: Omit<GalleryPhoto, 'id'>) => {
    if (!data) return;
    const newPhoto = { ...p, id: genId('g') };
    const newData = { ...data, gallery: [...data.gallery, newPhoto] };
    setData(newData);
    await persist(newData);
    showToast('Photo added', 'success');
  }, [data, persist, showToast]);

  const updatePhoto = useCallback(async (id: string, p: Partial<GalleryPhoto>) => {
    if (!data) return;
    const newData = {
      ...data,
      gallery: data.gallery.map(ph => ph.id === id ? { ...ph, ...p } : ph),
    };
    setData(newData);
    await persist(newData);
    showToast('Photo updated', 'success');
  }, [data, persist, showToast]);

  const deletePhoto = useCallback(async (id: string) => {
    if (!data) return;
    const newData = { ...data, gallery: data.gallery.filter(ph => ph.id !== id) };
    setData(newData);
    await persist(newData);
    showToast('Photo deleted', 'error');
  }, [data, persist, showToast]);

  // ── Config ──
  const updateConfig = useCallback(async (tools: string[], checklist: string[]) => {
    if (!data) return;
    const newData = { ...data, config: { tools, checklist } };
    setData(newData);
    await persist(newData);
    showToast('Settings saved', 'success');
  }, [data, persist, showToast]);

  // ── Org Chart ──
  const addOrgNode = useCallback(async (n: Omit<OrgNode, 'id'>) => {
    if (!data) return;
    const newNode = { ...n, id: genId('org') };
    const newData = { ...data, orgChart: [...data.orgChart, newNode] };
    setData(newData);
    await persist(newData);
    showToast('Team member added to structure', 'success');
  }, [data, persist, showToast]);

  const updateOrgNode = useCallback(async (id: string, n: Partial<OrgNode>) => {
    if (!data) return;
    const newData = { ...data, orgChart: data.orgChart.map(node => node.id === id ? { ...node, ...n } : node) };
    setData(newData);
    await persist(newData);
    showToast('Team member updated', 'success');
  }, [data, persist, showToast]);

  const deleteOrgNode = useCallback(async (id: string) => {
    if (!data) return;
    // Re-parent children to the deleted node's parent
    const node = data.orgChart.find(n => n.id === id);
    const newParentId = node?.parentId ?? null;
    const newData = {
      ...data,
      orgChart: data.orgChart
        .filter(n => n.id !== id)
        .map(n => n.parentId === id ? { ...n, parentId: newParentId } : n),
    };
    setData(newData);
    await persist(newData);
    showToast('Team member removed from structure', 'error');
  }, [data, persist, showToast]);

  // ── Gallery Categories ──
  const addGalleryCategory = useCallback(async (name: string) => {
    if (!data) return;
    const trimmed = name.trim();
    if (!trimmed || data.galleryCategories.includes(trimmed)) return;
    const newData = { ...data, galleryCategories: [...data.galleryCategories, trimmed] };
    setData(newData);
    await persist(newData);
    showToast('Category added', 'success');
  }, [data, persist, showToast]);

  const deleteGalleryCategory = useCallback(async (name: string) => {
    if (!data) return;
    if (name === 'All') return;
    const newData = {
      ...data,
      galleryCategories: data.galleryCategories.filter(c => c !== name),
      gallery: data.gallery.map(p => p.category === name ? { ...p, category: 'All' } : p),
    };
    setData(newData);
    await persist(newData);
    showToast('Category deleted', 'error');
  }, [data, persist, showToast]);

  const value: AdminContextValue = {
    data: data || { teamMembers: [], modules: [], gallery: [], config: { tools: [], checklist: [] }, galleryCategories: ['All'], orgChart: [] },
    loading,
    saving,
    syncError,
    refresh,
    addMember,
    updateMember,
    deleteMember,
    addModule,
    updateModule,
    deleteModule,
    addPhoto,
    updatePhoto,
    deletePhoto,
    updateConfig,
    addGalleryCategory,
    deleteGalleryCategory,
    addOrgNode,
    updateOrgNode,
    deleteOrgNode,
    toasts,
    showToast,
    dismissToast,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

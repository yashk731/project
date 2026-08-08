import { useState, useEffect } from 'react';
import {
  Link2, Users, Phone, Calendar, ShieldCheck, FileText, GitBranch, Layers,
  Settings, BarChart2, MessageSquare, HelpCircle, BookOpen, ChevronLeft, ChevronRight,
  Mail, MapPin, Globe, Menu, X, ExternalLink,
} from 'lucide-react';
import type { ModuleItem, ModuleContentItem } from './types';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AdminProvider, useAdmin } from './admin/AdminContext';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import ProtectedRoute from './admin/ProtectedRoute';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminTeam from './admin/pages/AdminTeam';
import AdminTeamStructure from './admin/pages/AdminTeamStructure';
import AdminModules from './admin/pages/AdminModules';
import OrgChart from './components/OrgChart';
import AdminGallery from './admin/pages/AdminGallery';
import AdminSettings from './admin/pages/AdminSettings';

// ─── Icon resolver ────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, typeof Users> = {
  Link2, Users, Phone, Calendar, ShieldCheck, FileText, GitBranch, Layers,
  Settings, BarChart2, MessageSquare, HelpCircle, BookOpen,
};

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Modules', href: '#modules' },
  { label: 'Structure', href: '#team' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact Us', href: '#footer' },
];

// ─── Public Site ───────────────────────────────────────────────────────────────

function PublicSite() {
  const { data, loading } = useAdmin();
  const [activeNav, setActiveNav] = useState('Home');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [teamIndex, setTeamIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('right');
  const [activeModule, setActiveModule] = useState<ModuleItem | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigate = (dir: 'prev' | 'next') => {
    if (animating || data.teamMembers.length === 0) return;
    setSlideDir(dir === 'next' ? 'left' : 'right');
    setAnimating(true);
    setTimeout(() => {
      setTeamIndex(i =>
        dir === 'next'
          ? (i + 1) % data.teamMembers.length
          : (i - 1 + data.teamMembers.length) % data.teamMembers.length
      );
      setAnimating(false);
    }, 300);
  };

  const filteredPhotos = data.gallery.filter(p =>
    galleryFilter === 'All' || p.category === galleryFilter
  );
  const displayedPhotos = showAll ? filteredPhotos : filteredPhotos.slice(0, 6);

  const member = data.teamMembers[teamIndex] || null;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── HEADER ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-xl font-black text-[#cc0000] tracking-tight">India</span>
              <span className="text-xl font-black text-gray-800 tracking-tight ml-1">GCC</span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-gray-200 mx-2" />
            <span className="hidden sm:block text-xs text-gray-500 leading-tight max-w-[120px]">
              Consumer Benefit Solutions
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setActiveNav(link.label)}
                className={`nav-link-custom text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                  activeNav === link.label ? 'text-[#cc0000] active' : 'text-gray-700 hover:text-[#cc0000]'
                }`}
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/admin/login"
              className="text-xs font-bold uppercase tracking-wider text-[#cc0000] border border-[#cc0000] px-3 py-1.5 rounded hover:bg-[#cc0000] hover:text-white transition-all duration-200"
            >
              <i className="bi bi-shield-lock me-1"></i>Admin
            </Link>
          </nav>

          <button
            className="md:hidden text-gray-700 hover:text-[#cc0000] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => { setActiveNav(link.label); setMenuOpen(false); }}
                className="block text-sm font-semibold text-gray-700 hover:text-[#cc0000] transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/admin/login"
              className="block text-sm font-bold text-[#cc0000] py-1"
              onClick={() => setMenuOpen(false)}
            >
              Admin Login
            </Link>
          </div>
        )}
      </header>

      <main className="pt-14">
        {/* ── HERO ── */}
        <section id="home" className="bg-[#fff5f5] py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                  Welcome to <span className="text-[#cc0000]">India GCC</span>
                </h1>
                <p className="text-lg md:text-xl font-bold text-gray-800 mt-1">
                  Consumer Benefit Solutions
                </p>
              </div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-md">
                Transforming client outcomes with{' '}
                <span className="font-semibold text-gray-800">excellence</span>,{' '}
                <span className="font-semibold text-gray-800">passion</span>, and{' '}
                <span className="font-semibold text-gray-800">partnership</span>.
              </p>
              <a
                href="#team"
                className="inline-flex items-center gap-2 bg-[#cc0000] hover:bg-[#aa0000] text-white text-sm font-bold px-7 py-3 rounded transition-all duration-200 hover:shadow-lg hover:shadow-red-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Users size={16} />
                MEET THE TEAM
              </a>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-red-100 aspect-video">
                <img
                  src="https://images.pexels.com/photos/7109063/pexels-photo-7109063.jpeg?auto=compress&cs=tinysrgb&h=500&w=800"
                  alt="India GCC Team"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -left-3 bg-[#cc0000] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg">
                India GCC
              </div>
            </div>
          </div>
        </section>

        {/* ── NEW JOINER ESSENTIALS ── */}
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-[#fff5f5] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className="w-24 h-24 bg-[#cc0000]/10 rounded-2xl flex items-center justify-center">
                  <div className="relative">
                    <Users size={40} className="text-[#cc0000]" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#cc0000] rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">+</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-medium text-center">Welcome to<br />the Team!</p>
              </div>

              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-5">
                  New Joiner Essentials
                </h2>
                {loading ? (
                  <div className="text-sm text-gray-400">Loading...</div>
                ) : (
                  <ul className="space-y-3">
                    {data.config.checklist.map((item, i) => (
                      <li
                        key={i}
                        className="check-item flex items-center gap-3 text-sm text-gray-700"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <div className="w-5 h-5 rounded-full border-2 border-[#cc0000] flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-[#cc0000]" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── MODULES ── */}
        <section id="modules" className="py-14 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Modules</h2>
              <span className="section-underline" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {data.modules.map((mod) => {
                const Icon = ICON_MAP[mod.icon] || BookOpen;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModule(mod)}
                    className="module-card bg-white rounded-xl p-5 flex flex-col items-center gap-3 text-center cursor-pointer border border-gray-100 hover:border-red-100 group"
                  >
                    <div className="w-10 h-10 bg-[#cc0000]/10 rounded-xl flex items-center justify-center group-hover:bg-[#cc0000]/15 transition-colors">
                      <Icon size={20} className="text-[#cc0000]" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 leading-tight group-hover:text-[#cc0000] transition-colors">{mod.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── KNOW YOUR TEAM ── */}
        <section id="team" className="py-14 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Know Your Team</h2>
              <span className="section-underline" />
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading team members...</div>
            ) : member ? (
              <div className="relative bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100 p-6 md:p-8 overflow-hidden">
                <button
                  onClick={() => navigate('prev')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md hover:border-[#cc0000] hover:text-[#cc0000] flex items-center justify-center transition-all duration-200 hover:shadow-lg"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => navigate('next')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md hover:border-[#cc0000] hover:text-[#cc0000] flex items-center justify-center transition-all duration-200 hover:shadow-lg"
                >
                  <ChevronRight size={20} />
                </button>

                <div
                  className={`transition-all duration-300 ${animating ? (slideDir === 'left' ? '-translate-x-8 opacity-0' : 'translate-x-8 opacity-0') : 'translate-x-0 opacity-100'}`}
                >
                  <div className="flex flex-col sm:flex-row gap-6 items-start px-8">
                    <div className="flex-shrink-0">
                      <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#cc0000]/20 shadow-lg">
                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <h3 className="text-xl font-black text-[#cc0000]">{member.name}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed max-w-xl">{member.bio}</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-[#cc0000]" />
                          {member.birthday}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Mail size={13} className="text-[#cc0000]" />
                          {member.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users size={13} className="text-[#cc0000]" />
                          {member.dept}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs text-gray-700">
                          <span className="font-semibold">Interests/Hobbies: </span>
                          {member.interests}
                        </p>
                        <p className="text-xs text-gray-700">
                          <span className="font-semibold">Motivators: </span>
                          {member.motivators}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-2 mt-6">
                  {data.teamMembers.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setSlideDir(i > teamIndex ? 'left' : 'right'); setTeamIndex(i); }}
                      className={`rounded-full transition-all duration-200 ${i === teamIndex ? 'w-6 h-2 bg-[#cc0000]' : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'}`}
                    />
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="avatar-scroll flex gap-2 pb-1">
                    {data.teamMembers.map((m, i) => (
                      <button
                        key={i}
                        onClick={() => { setSlideDir(i > teamIndex ? 'left' : 'right'); setTeamIndex(i); }}
                        className={`flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-200 ${i === teamIndex ? 'border-[#cc0000] scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'}`}
                      >
                        <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">No team members yet. Add some from the admin panel.</div>
            )}
          </div>
        </section>

        {/* ── TEAM STRUCTURE ── */}
        {data.orgChart.length > 0 && (
          <section id="structure" className="py-14 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">Team Structure</h2>
                <span className="section-underline" />
                <p className="text-gray-500 text-sm mt-4 max-w-lg mx-auto">Our organizational hierarchy — click the arrows to expand or collapse teams.</p>
              </div>
              <OrgChart nodes={data.orgChart} />
            </div>
          </section>
        )}

        {/* ── GALLERY ── */}
        <section id="gallery" className="py-14 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Our Gallery</h2>
              <span className="section-underline" />
            </div>

            <div className="flex justify-center gap-2 mb-8 flex-wrap">
              {data.galleryCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setGalleryFilter(cat); setShowAll(false); }}
                  className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider border transition-all duration-200 ${
                    galleryFilter === cat
                      ? 'bg-[#cc0000] text-white border-[#cc0000] shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#cc0000] hover:text-[#cc0000]'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {displayedPhotos.map((photo, i) => (
                <div key={`${photo.id}-${i}`} className="gallery-item rounded-xl overflow-hidden aspect-video bg-gray-200 relative group">
                  <img src={photo.url} alt={photo.tag} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end p-3">
                    <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#cc0000]/80 px-2 py-1 rounded-md">
                      {photo.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredPhotos.length > 6 && !showAll && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowAll(true)}
                  className="border-2 border-[#cc0000] text-[#cc0000] hover:bg-[#cc0000] hover:text-white font-bold text-sm px-8 py-3 rounded-full transition-all duration-200"
                >
                  SHOW MORE PHOTOS
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── AON TOOLS ── */}
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">AON Tools</h2>
              <span className="section-underline" />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {data.config.tools.map(tool => (
                <button
                  key={tool}
                  className="tool-tag border-2 border-gray-200 text-gray-700 font-semibold text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition-all duration-200"
                >
                  <ExternalLink size={13} />
                  {tool}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer id="footer" className="bg-[#1a1a1a] text-white pt-12 pb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 pb-10 border-b border-white/10">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-[#cc0000]">India</span>
                <span className="text-2xl font-black text-white ml-1">GCC</span>
              </div>
              <p className="text-gray-400 text-xs font-medium">Consumer Benefit Solutions | Aon</p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                <Mail size={13} className="text-[#cc0000] flex-shrink-0" />
                <span className="text-gray-400 text-xs">For any query please reach out at:</span>
                <a href="mailto:nitesh.chandra.gupta@aon.com" className="text-[#cc0000] text-xs font-medium hover:underline">
                  nitesh.chandra.gupta@aon.com
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { city: 'Noida', detail: 'Lotus Business Park Power House,\nSector 127, Noida,\nUttar Pradesh 201313' },
                { city: 'Gurgaon', detail: 'The Aon Centre,\nCandor Info Space Central Park II,\nTikri, Sector 48, Gurugram,\nHaryana 122018' },
                { city: 'Bangalore', detail: 'SJR i-Park, 4th Floor,\nPlot 13,14,15,\nEPIP Industrial Area, Phase 1,\nKIADB Export Promotion Industrial Area,\nWhitefield, Bengaluru,\nKarnataka 560066' },
              ].map(loc => (
                <div key={loc.city} className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#cc0000] flex-shrink-0" />
                    <span className="font-bold text-sm text-white">{loc.city}</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-line pl-5">{loc.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="py-6 border-b border-white/10">
            <div className="flex items-start gap-2">
              <MapPin size={13} className="text-[#cc0000] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm text-white">Bangalore (Vaishnnavi Silicon Terraces)</span>
                <p className="text-gray-400 text-xs leading-relaxed mt-0.5">
                  Ground & 1st Floor, Vaishnnavi Silicon Terraces, 26/1, Hosur Rd, 7th Block, Koramangala, Bengaluru, Karnataka 560095
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-xs">© 2025 Consumer Benefit Solutions. All Rights Reserved.</p>
            <a href="https://www.aon.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gray-400 hover:text-[#cc0000] text-xs transition-colors">
              <Globe size={13} />
              www.aon.com
            </a>
          </div>
        </div>
      </footer>

      {/* ── Module Content Modal ── */}
      {activeModule && (
        <ModuleModal module={activeModule} onClose={() => setActiveModule(null)} />
      )}
    </div>
  );
}

// ─── App with routing ──────────────────────────────────────────────────────────

export default function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          {/* Public site */}
          <Route path="/" element={<PublicSite />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="structure" element={<AdminTeamStructure />} />
            <Route path="modules" element={<AdminModules />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<PublicSite />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}

// ─── Module Modal ────────────────────────────────────────────────────────────

function ModuleModal({ module, onClose }: { module: ModuleItem; onClose: () => void }) {
  const Icon = ICON_MAP[module.icon] || BookOpen;
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderContent = (c: ModuleContentItem) => {
    if (c.type === 'accordion') {
      return (
        <div key={c.id} className="mb-4">
          <h4 className="font-bold text-gray-800 text-sm mb-2">{c.title}</h4>
          <div className="space-y-2">
            {(c.accordionItems || []).map(a => {
              const open = openAccordions.has(a.id);
              return (
                <div key={a.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleAccordion(a.id)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <span className="font-semibold text-gray-700 text-sm">{a.title}</span>
                    <svg
                      className={`w-4 h-4 text-[#cc0000] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: open ? '500px' : '0px' }}
                  >
                    <div className="px-4 py-3 text-gray-600 text-sm leading-relaxed">{a.body}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (c.type === 'pdf') {
      return (
        <div key={c.id} className="mb-4">
          <h4 className="font-bold text-gray-800 text-sm mb-2">{c.title}</h4>
          {c.pdfUrl ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <iframe src={c.pdfUrl} title={c.title} className="w-full" style={{ height: '500px' }} />
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">No PDF attached yet.</p>
          )}
        </div>
      );
    }

    // link
    return (
      <div key={c.id} className="mb-3">
        <a
          href={c.linkUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#cc0000]/30 hover:bg-[#cc0000]/5 transition-all group"
        >
          <div className="w-9 h-9 bg-[#cc0000]/10 rounded-lg flex items-center justify-center group-hover:bg-[#cc0000]/15 transition-colors">
            <Link2 size={16} className="text-[#cc0000]" />
          </div>
          <div className="flex-grow-1">
            <p className="font-semibold text-gray-700 text-sm group-hover:text-[#cc0000] transition-colors">{c.title}</p>
            {c.linkUrl && <p className="text-gray-400 text-xs truncate">{c.linkUrl}</p>}
          </div>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-[#cc0000] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        </a>
      </div>
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#cc0000]/10 rounded-xl flex items-center justify-center">
                <Icon size={20} className="text-[#cc0000]" />
              </div>
              <h3 className="font-black text-gray-900 text-lg">{module.label}</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto px-6 py-5 flex-grow-1">
            {module.content.length === 0 ? (
              <div className="text-center py-12">
                <Icon size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No content available for this module yet.</p>
              </div>
            ) : (
              module.content.map(renderContent)
            )}
          </div>
        </div>
      </div>
    </>
  );
}

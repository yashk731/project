import type { SiteData } from '../types';

const STORAGE_KEY = 'gcc_site_data';
const SHEETS_ENDPOINT_KEY = 'gcc_sheets_endpoint';
const ADMIN_AUTH_KEY = 'gcc_admin_auth';

const DEFAULT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzN23Jp5rvvHri90RvF-v6NdGjFkI_g3kfUQVf7Ob6CiEAZJ2g6ILxbXgd21m6LFu-V/exec';

// Default data used as fallback when Google Sheets is not configured
const DEFAULT_DATA: SiteData = {
  teamMembers: [
    {
      id: 'tm1',
      name: 'Ananya Srivastava',
      photo: 'https://images.pexels.com/photos/7316732/pexels-photo-7316732.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      bio: 'A curious learner, positive thinker and someone who believes work is always better with great people and great vibes.',
      birthday: '12th July',
      email: 'ananya.srivastava@aon.com',
      dept: 'CBS',
      interests: 'Enjoy dancing, painting, and baking as creative outlets, and love spending quality time with my pets.',
      motivators: 'Stepping out of my comfort zone and embracing new opportunities.',
    },
    {
      id: 'tm2',
      name: 'Rahul Sharma',
      photo: 'https://images.pexels.com/photos/37148308/pexels-photo-37148308.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      bio: 'Passionate about process improvement and building strong team collaboration across geographies.',
      birthday: '3rd March',
      email: 'rahul.sharma@aon.com',
      dept: 'CBS',
      interests: 'Cricket enthusiast, amateur photographer, and weekend trekker.',
      motivators: 'Making a measurable difference and mentoring new team members.',
    },
    {
      id: 'tm3',
      name: 'Priya Mehta',
      photo: 'https://images.pexels.com/photos/29852852/pexels-photo-29852852.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      bio: 'Detail-oriented analyst who thrives on turning complex data into clear, actionable insights for stakeholders.',
      birthday: '19th September',
      email: 'priya.mehta@aon.com',
      dept: 'CBS',
      interests: 'Reading, yoga, and exploring new cuisines around the city.',
      motivators: 'Continuous learning and building meaningful professional relationships.',
    },
    {
      id: 'tm4',
      name: 'Arjun Kapoor',
      photo: 'https://images.pexels.com/photos/26834972/pexels-photo-26834972.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      bio: 'Strategic thinker with a knack for simplifying processes and driving operational excellence.',
      birthday: '7th January',
      email: 'arjun.kapoor@aon.com',
      dept: 'CBS',
      interests: 'Football, music production, and volunteering with local NGOs.',
      motivators: 'Leading teams toward shared goals and celebrating collective wins.',
    },
    {
      id: 'tm5',
      name: 'Sneha Reddy',
      photo: 'https://images.pexels.com/photos/38197025/pexels-photo-38197025.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      bio: 'Collaborative team player who brings energy and structure to every project she touches.',
      birthday: '22nd November',
      email: 'sneha.reddy@aon.com',
      dept: 'CBS',
      interests: 'Sketching, Bollywood dancing, and weekend road trips.',
      motivators: 'Creating a positive workplace culture where everyone feels valued.',
    },
  ],
  modules: [
    { id: 'm1', icon: 'Link2', label: 'Important Links', content: [
      { id: 'c1', type: 'link', title: 'Aon Portal', linkUrl: 'https://www.aon.com' },
      { id: 'c2', type: 'link', title: 'Workday', linkUrl: 'https://www.myworkday.com' },
    ] },
    { id: 'm2', icon: 'Users', label: 'Know Your Team', content: [
      { id: 'c3', type: 'accordion', title: 'Team Overview', accordionItems: [
        { id: 'a1', title: 'Who We Are', body: 'The India GCC team drives process excellence across multiple service lines.' },
        { id: 'a2', title: 'What We Do', body: 'We deliver consumer benefit solutions with a focus on quality and innovation.' },
      ] },
    ] },
    { id: 'm3', icon: 'Phone', label: 'Point Of Contact', content: [
      { id: 'c4', type: 'accordion', title: 'Key Contacts', accordionItems: [
        { id: 'a3', title: 'HR Helpdesk', body: 'Email: hr-india@aon.com | Phone: +91 124 459 0000' },
        { id: 'a4', title: 'IT Support', body: 'Email: servicedesk-india@aon.com | Ext: 8888' },
      ] },
    ] },
    { id: 'm4', icon: 'Calendar', label: 'Monthly Team Meetings', content: [] },
    { id: 'm5', icon: 'ShieldCheck', label: 'Testing Best Practices', content: [
      { id: 'c5', type: 'pdf', title: 'Testing Guidelines', pdfUrl: '' },
    ] },
    { id: 'm6', icon: 'FileText', label: 'Doc Processing Best Practices', content: [] },
    { id: 'm7', icon: 'GitBranch', label: 'BA Process Best Practices', content: [] },
    { id: 'm8', icon: 'Layers', label: 'Other Process Best Practices', content: [] },
    { id: 'm9', icon: 'Settings', label: 'Kantoo Best Practices', content: [] },
    { id: 'm10', icon: 'BarChart2', label: 'GI Best Practices', content: [] },
    { id: 'm11', icon: 'MessageSquare', label: 'Persuasive Best Practices', content: [] },
    { id: 'm12', icon: 'HelpCircle', label: 'Everyday Benefits - FAQs', content: [
      { id: 'c6', type: 'accordion', title: 'FAQs', accordionItems: [
        { id: 'a5', title: 'How do I apply for leave?', body: 'Submit your leave request through Workday under the Time Off tab.' },
        { id: 'a6', title: 'How do I book a desk?', body: 'Use the Book My Seat tool on the Aon portal to reserve your seat.' },
      ] },
    ] },
    { id: 'm13', icon: 'MessageSquare', label: 'Communication Specialist FAQs', content: [] },
    { id: 'm14', icon: 'BookOpen', label: 'Alight Tracker - FAQs', content: [] },
    { id: 'm15', icon: 'ShieldCheck', label: 'SA Best Practices', content: [] },
  ],
  gallery: [
    { id: 'g1', url: 'https://images.pexels.com/photos/20752572/pexels-photo-20752572.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', category: 'All', tag: 'Team Meeting' },
    { id: 'g2', url: 'https://images.pexels.com/photos/7580801/pexels-photo-7580801.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', category: 'Parties & Trips', tag: 'Birthday Celebration' },
    { id: 'g3', url: 'https://images.pexels.com/photos/7109063/pexels-photo-7109063.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', category: 'Random Clicks', tag: 'Office Candid' },
    { id: 'g4', url: 'https://images.pexels.com/photos/8518844/pexels-photo-8518844.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', category: 'Parties & Trips', tag: 'Team Lunch' },
    { id: 'g5', url: 'https://images.pexels.com/photos/7551408/pexels-photo-7551408.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', category: 'Parties & Trips', tag: 'Offsite Trip' },
    { id: 'g6', url: 'https://images.pexels.com/photos/27892094/pexels-photo-27892094.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', category: 'Random Clicks', tag: 'Random Click' },
    { id: 'g7', url: 'https://images.pexels.com/photos/7845282/pexels-photo-7845282.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', category: 'Random Clicks', tag: 'Office Fun' },
    { id: 'g8', url: 'https://images.pexels.com/photos/7551222/pexels-photo-7551222.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', category: 'Parties & Trips', tag: 'Team Activity' },
    { id: 'g9', url: 'https://images.pexels.com/photos/6405666/pexels-photo-6405666.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', category: 'Parties & Trips', tag: 'Year-End Party' },
  ],
  config: {
    tools: ['AON GPT', 'MyService', 'BDO', 'UPoint', 'Workday', 'Book My Seat', 'HR Online'],
    checklist: [
      'Complete your mandatory trainings',
      'Complete your weekly TRES',
      'Regularization of attendance',
      'Complete your daily tracking sheet',
      'Maintain RTO',
    ],
  },
  galleryCategories: ['All', 'Parties & Trips', 'Random Clicks'],
  orgChart: [
    { id: 'org1', name: 'Rajesh Kumar', role: 'Head of GCC', photo: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&h=300&w=300', parentId: null, email: 'rajesh.kumar@aon.com', phone: '+91 98765 43210', location: 'Noida' },
    { id: 'org2', name: 'Ananya Srivastava', role: 'Operations Lead', photo: 'https://images.pexels.com/photos/7316732/pexels-photo-7316732.jpeg?auto=compress&cs=tinysrgb&h=300&w=300', parentId: 'org1', email: 'ananya.srivastava@aon.com', phone: '+91 98765 43211', location: 'Noida' },
    { id: 'org3', name: 'Rahul Sharma', role: 'Delivery Lead', photo: 'https://images.pexels.com/photos/37148308/pexels-photo-37148308.jpeg?auto=compress&cs=tinysrgb&h=300&w=300', parentId: 'org1', email: 'rahul.sharma@aon.com', phone: '+91 98765 43212', location: 'Gurgaon' },
    { id: 'org4', name: 'Priya Mehta', role: 'Senior Analyst', photo: 'https://images.pexels.com/photos/29852852/pexels-photo-29852852.jpeg?auto=compress&cs=tinysrgb&h=300&w=300', parentId: 'org2', email: 'priya.mehta@aon.com', phone: '+91 98765 43213', location: 'Noida' },
    { id: 'org5', name: 'Arjun Kapoor', role: 'Process Specialist', photo: 'https://images.pexels.com/photos/26834972/pexels-photo-26834972.jpeg?auto=compress&cs=tinysrgb&h=300&w=300', parentId: 'org2', email: 'arjun.kapoor@aon.com', phone: '+91 98765 43214', location: 'Bangalore' },
    { id: 'org6', name: 'Sneha Reddy', role: 'Quality Analyst', photo: 'https://images.pexels.com/photos/38197025/pexels-photo-38197025.jpeg?auto=compress&cs=tinysrgb&h=300&w=300', parentId: 'org3', email: 'sneha.reddy@aon.com', phone: '+91 98765 43215', location: 'Bangalore' },
  ],
};

// Admin credentials (in production, authenticate via Google Sheets)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

function getEndpoint(): string | null {
  return localStorage.getItem(SHEETS_ENDPOINT_KEY) || DEFAULT_ENDPOINT;
}

export function setEndpoint(url: string) {
  localStorage.setItem(SHEETS_ENDPOINT_KEY, url.trim());
}

export function getEndpointValue(): string {
  return localStorage.getItem(SHEETS_ENDPOINT_KEY) || DEFAULT_ENDPOINT;
}

export function clearEndpoint() {
  localStorage.removeItem(SHEETS_ENDPOINT_KEY);
}

export function isLoggedIn(): boolean {
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

export function login(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    return true;
  }
  return false;
}

export function logout() {
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
}

function getLocalData(): SiteData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      return {
        teamMembers: parsed.teamMembers ?? [],
        modules: parsed.modules ?? [],
        gallery: parsed.gallery ?? [],
        config: parsed.config ?? { tools: [], checklist: [] },
        galleryCategories: parsed.galleryCategories ?? ['All'],
        orgChart: parsed.orgChart ?? [],
      };
    } catch {
      // fall through to default
    }
  }
  return DEFAULT_DATA;
}

function saveLocalData(data: SiteData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function fetchData(): Promise<SiteData> {
  const endpoint = getEndpoint();
  if (endpoint) {
    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 15000);
      const res = await fetch(`${endpoint}?action=read`, { signal: controller.signal });
      window.clearTimeout(timeoutId);
      if (!res.ok) throw new Error('Network response not ok');
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data as Partial<SiteData>;
        const merged: SiteData = {
          teamMembers: d.teamMembers ?? [],
          modules: d.modules ?? [],
          gallery: d.gallery ?? [],
          config: d.config ?? { tools: [], checklist: [] },
          galleryCategories: d.galleryCategories ?? ['All'],
          orgChart: d.orgChart ?? [],
        };
        saveLocalData(merged);
        return merged;
      }
      throw new Error(json.error || 'Unknown error');
    } catch (err) {
      console.warn('Google Sheets fetch failed, using local data:', err);
      return getLocalData();
    }
  }
  return getLocalData();
}

export async function saveData(data: SiteData): Promise<{ success: boolean; error?: string }> {
  saveLocalData(data);
  const endpoint = getEndpoint();
  if (!endpoint) return { success: true };

  try {
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'write', data }),
      redirect: 'follow',
    });
    // no-cors gives an opaque response — we can't read it, but the write
    // still reaches the Apps Script endpoint and saves to the sheet.
    return { success: true };
  } catch {
    return { success: true, error: 'Saved locally but Google Sheets sync failed' };
  }
}

export { DEFAULT_DATA };

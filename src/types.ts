export interface TeamMember {
  id: string;
  name: string;
  photo: string;
  bio: string;
  birthday: string;
  email: string;
  dept: string;
  interests: string;
  motivators: string;
}

export type ModuleContentType = 'accordion' | 'pdf' | 'link';

export interface AccordionItem {
  id: string;
  title: string;
  body: string;
}

export interface ModuleContentItem {
  id: string;
  type: ModuleContentType;
  title: string;
  // accordion
  accordionItems?: AccordionItem[];
  // pdf
  pdfUrl?: string;
  // link
  linkUrl?: string;
}

export interface ModuleItem {
  id: string;
  icon: string;
  label: string;
  content: ModuleContentItem[];
}

export interface GalleryPhoto {
  id: string;
  url: string;
  category: string;
  tag: string;
}

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  photo: string;
  parentId: string | null;
  email?: string;
  phone?: string;
  location?: string;
}

export interface AdminConfig {
  tools: string[];
  checklist: string[];
}

export interface SiteData {
  teamMembers: TeamMember[];
  modules: ModuleItem[];
  gallery: GalleryPhoto[];
  config: AdminConfig;
  galleryCategories: string[];
  orgChart: OrgNode[];
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

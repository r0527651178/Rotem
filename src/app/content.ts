import { Injectable, signal } from '@angular/core';

export interface Capability {
  id: string;
  title: string;
  /** Latin part of the title shown next to it in a lighter style, e.g. "AI". */
  titleLatin?: string;
  subtitle: string;
  text: string;
  cover: string;
  /** Cover aspect ratio, e.g. "16 / 9". Default "9 / 10". */
  aspect?: string;
  /** Side of the text. Default: alternates right / left. */
  layout?: 'text-right' | 'text-left';
  /** Optional second, smaller image next to the cover (side) or under it (below). */
  extraImage?: string;
  extraPosition?: 'side' | 'below';
  gallery: string[];
  /** When set, the arrow opens a full gallery page (/gallery/:id) instead of the inline gallery. */
  galleryPage?: GalleryPageContent;
}

export interface GalleryPageContent {
  title: string;
  /** Category id shown when the URL has no ?tab. Default: the first category. */
  defaultCategory?: string;
  /** Latin part of the title, shown after it in a lighter style (sketch 32: "הדמיות AI"). */
  titleLatin?: string;
  /** "dark": black page (sales plans, sketches 27, 28). "beige": beige page (AI, sketches 32–34). Default: cream. */
  theme?: 'dark' | 'beige';
  categories: GalleryCategory[];
}

export interface GalleryCategory {
  id: string;
  label: string;
  /** Base folder, e.g. "images/visualization/exterior". */
  folder: string;
  /** Mosaic template set from mosaic-layouts.ts (MOSAIC_LAYOUTS key). Default: "exterior". */
  layout?: string;
  /**
   * Every view gets its own tile, and a project's views fill consecutive slots
   * (brochures, sketches 35–37: cover and spreads side by side). Clicking a page opens
   * the viewer on that page. Default: one tile per project, showing 1.jpg.
   */
  pages?: boolean;
  projects: GalleryProject[];
}

export interface GalleryProject {
  /** Shown on hover and in the viewer. Use "\n" for a line break. */
  title: string;
  /** Sub-folder name inside the category folder. Images: 1.jpg (main), 2.jpg, 3.jpg… */
  folder: string;
  /** Number of views (1.jpg … N.jpg). Default 1. */
  views?: number;
}

/** target = id of the section on the page to scroll to. */
export interface MenuItem {
  label: string;
  target: string;
}

export interface AboutContent {
  title: string;
  image: string;
  /** Draw the animated construction lines over the image. */
  lines?: boolean;
  caption: string;
  /** Brand name before the caption, in the image's corner (sketch 38: "רותם"). */
  captionBrand?: string;
  /** Handwritten signature under the text. */
  signature?: string;
  /** Each paragraph is a list of lines, kept as separate lines on wide screens. */
  paragraphs: string[][];
}

export interface SiteContent {
  logo: string;
  menuLogo: string;
  menuTagline: string;
  menu: MenuItem[];
  about: AboutContent;
  hero: { intervalMs: number; tagline: string; images: string[] };
  capabilitiesTitle: string;
  capabilities: Capability[];
  stats: StatItem[];
  contact: ContactContent;
}

export interface StatItem {
  value: number;
  label: string;
}

export interface ContactContent {
  title: string;
  /** Address the form is sent to (opens the visitor's mail app). */
  email: string;
  phone: string;
  mobile: string;
  intro: string;
  projectTypes: string[];
  submitLabel: string;
}

/**
 * Loads the site texts and image lists from public/images/content.json,
 * so images can be added or replaced without rebuilding the code.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  readonly content = signal<SiteContent | null>(null);

  constructor() {
    fetch('images/content.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: SiteContent) => this.content.set(data))
      .catch((err) => console.error('Failed to load images/content.json', err));
  }
}

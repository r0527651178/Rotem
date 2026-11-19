import {
  Component,
  HostListener,
  computed,
  effect,
  inject,
  input,
  isDevMode,
  signal,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ContentService, GalleryCategory, GalleryProject } from '../content';
import { SiteFooter } from '../site-footer/site-footer';
import {
  FALLBACK_SLOT,
  MOSAIC_LAYOUTS,
  MOSAIC_TEMPLATES,
  MOSAIC_WIDTH,
  MosaicSlot,
  MosaicTemplate,
} from './mosaic-layouts';

export interface Tile {
  project: GalleryProject;
  src: string;
  /** Which view of the project the tile shows (1 = 1.jpg). */
  view: number;
  /** Desktop position in % of the block. */
  left: number;
  top: number;
  width: number;
  height: number;
  /** Width / height of the slot – used for the stacked mobile layout. */
  ratio: number;
  wide: boolean;
  index: number;
  /** Coloured sheets behind the card. */
  sheets?: [string, string];
  /** Always-visible caption, in % of the block. */
  caption?: { left: number; top: number; width: number; align: string; over: boolean; band: boolean };
  z?: number;
  /** Fill the box even though the tile has a caption. */
  cover?: boolean;
  /** object-position of the image. */
  pos?: string;
  /** Thin outline around the tile, in % of the block. */
  frame?: { left: number; top: number; width: number; height: number };
}

export interface Block {
  aspect: number;
  tiles: Tile[];
  /** Some tile has an always-visible caption (plans, brochures). */
  captioned: boolean;
  /** Captions are bands that name a group of pages (brochures). */
  bands: boolean;
}

type Item = { project: GalleryProject; src: string; view: number };

interface ViewerState {
  project: GalleryProject;
  images: string[];
  index: number;
}

@Component({
  selector: 'app-gallery-page',
  imports: [SiteFooter],
  templateUrl: './gallery-page.html',
  styleUrl: './gallery-page.scss',
})
export class GalleryPage {
  /** Route params (withComponentInputBinding). */
  readonly id = input('');
  readonly tab = input<string | undefined>(undefined);

  protected readonly content = inject(ContentService).content;
  private readonly router = inject(Router);

  /** Placeholders for missing images are shown while developing, hidden on the live site. */
  protected readonly dev = isDevMode();
  protected readonly failed = signal<ReadonlySet<string>>(new Set());
  protected readonly viewer = signal<ViewerState | null>(null);

  protected readonly capability = computed(() =>
    this.content()?.capabilities.find((c) => c.id === this.id() && c.galleryPage),
  );
  protected readonly page = computed(() => this.capability()?.galleryPage);

  protected readonly category = computed<GalleryCategory | undefined>(() => {
    const page = this.page();
    const cats = page?.categories ?? [];
    const wanted = this.tab() ?? page?.defaultCategory;
    return cats.find((c) => c.id === wanted) ?? cats[0];
  });

  protected readonly blocks = computed<Block[]>(() => {
    const cat = this.category();
    if (!cat) return [];
    const failed = this.failed();
    const templates = MOSAIC_LAYOUTS[cat.layout ?? 'exterior'] ?? MOSAIC_TEMPLATES;
    if (cat.pages) {
      // One tile per page. A missing page keeps its slot (it is hidden on the live site),
      // so the other pages and the band stay where the sketch puts them.
      const pages = cat.projects.flatMap((project) =>
        Array.from({ length: Math.max(1, project.views ?? 1) }, (_, i) => ({
          project,
          view: i + 1,
          src: this.imagePath(cat, project, i + 1),
        })),
      );
      return this.layout(pages, templates);
    }
    const projects = cat.projects
      .map((project) => ({ project, view: 1, src: this.imagePath(cat, project, 1) }))
      .filter((p) => this.dev || !failed.has(p.src));
    return this.layout(projects, templates);
  });

  protected readonly isEmpty = computed(() => !this.blocks().length);

  constructor() {
    // The route title is generic; name the actual gallery once the content has loaded.
    const title = inject(Title);
    effect(() => {
      const name = this.fullTitle();
      if (name) title.setTitle(`${name} | ROTEM`);
    });
  }

  /** Page title with its Latin part, e.g. "הדמיות AI". */
  protected readonly fullTitle = computed(() => {
    const p = this.page();
    return p ? [p.title, p.titleLatin].filter(Boolean).join(' ') : '';
  });

  protected imagePath(cat: GalleryCategory, project: GalleryProject, view: number): string {
    return `${cat.folder}/${project.folder}/${view}.jpg`;
  }

  protected selectTab(id: string): void {
    if (id === this.category()?.id) return;
    this.router.navigate([], { queryParams: { tab: id }, replaceUrl: true });
  }

  protected markFailed(src: string): void {
    if (this.failed().has(src)) return;
    const next = new Set(this.failed());
    next.add(src);
    this.failed.set(next);
  }

  /* ---------- Viewer ---------- */

  protected open(tile: Tile): void {
    const cat = this.category();
    if (!cat) return;
    const count = Math.max(1, tile.project.views ?? 1);
    const failed = this.failed();
    // Opens on the clicked view (a brochure page); views known to be missing are left out live.
    const images = Array.from({ length: count }, (_, i) => this.imagePath(cat, tile.project, i + 1)).filter(
      (src) => this.dev || src === tile.src || !failed.has(src),
    );
    this.viewer.set({ project: tile.project, images, index: Math.max(0, images.indexOf(tile.src)) });
    document.body.style.overflow = 'hidden';
  }

  protected close(): void {
    this.viewer.set(null);
    document.body.style.overflow = '';
  }

  /** step: +1 = next view, -1 = previous view. */
  protected step(step: number): void {
    const v = this.viewer();
    if (!v || v.images.length < 2) return;
    const n = v.images.length;
    this.viewer.set({ ...v, index: (v.index + step + n) % n });
  }

  protected goToView(index: number): void {
    const v = this.viewer();
    if (v) this.viewer.set({ ...v, index });
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (!this.viewer()) return;
    if (e.key === 'Escape') this.close();
    // RTL: the left arrow moves forward.
    if (e.key === 'ArrowLeft') this.step(1);
    if (e.key === 'ArrowRight') this.step(-1);
  }

  /** Entrance animation each time a new view finishes loading. */
  protected playViewIn(e: Event): void {
    const img = e.target as HTMLImageElement;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    img.animate(
      [
        { opacity: 0, transform: 'scale(0.96)', filter: 'blur(6px)' },
        { opacity: 1, transform: 'none', filter: 'none' },
      ],
      { duration: 800, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    );
  }

  private swipeX: number | null = null;

  protected onPointerDown(e: PointerEvent): void {
    this.swipeX = e.clientX;
  }

  protected onPointerUp(e: PointerEvent): void {
    if (this.swipeX === null) return;
    const dx = e.clientX - this.swipeX;
    this.swipeX = null;
    // RTL: swiping right shows the next view.
    if (Math.abs(dx) > 50) this.step(dx > 0 ? 1 : -1);
  }

  /* ---------- Layout ---------- */

  private layout(
    items: Item[],
    templates: MosaicTemplate[],
  ): Block[] {
    const blocks: Block[] = [];
    let i = 0;
    let t = 0;
    while (i < items.length) {
      const template = templates[t % templates.length];
      const remaining = items.length - i;
      if (remaining >= template.slots.length) {
        const chunk = items.slice(i, i + template.slots.length);
        blocks.push(this.block(chunk, template.slots, template.height, i));
        i += template.slots.length;
        t++;
        continue;
      }
      // Leftovers: rows of three.
      const rows = Math.ceil(remaining / 3);
      const gap = 15;
      const height = rows * FALLBACK_SLOT.h + (rows - 1) * gap;
      const slots: MosaicSlot[] = items.slice(i).map((_, k) => ({
        x: MOSAIC_WIDTH - FALLBACK_SLOT.w - (k % 3) * (FALLBACK_SLOT.w + 21.5),
        y: Math.floor(k / 3) * (FALLBACK_SLOT.h + gap),
        w: FALLBACK_SLOT.w,
        h: FALLBACK_SLOT.h,
      }));
      blocks.push(this.block(items.slice(i), slots, height, i));
      break;
    }
    return blocks;
  }

  private block(items: Item[], slots: MosaicSlot[], height: number, offset: number): Block {
    const used = slots.slice(0, items.length);
    return {
      aspect: MOSAIC_WIDTH / height,
      captioned: used.some((s) => !!s.caption),
      bands: used.some((s) => !!s.caption?.band),
      tiles: items.map((item, k) => {
        const s = slots[k];
        const px = (v: number) => (v / MOSAIC_WIDTH) * 100;
        const py = (v: number) => (v / height) * 100;
        return {
          ...item,
          left: px(s.x),
          top: py(s.y),
          width: px(s.w),
          height: py(s.h),
          ratio: s.w / s.h,
          wide: s.w > MOSAIC_WIDTH / 2,
          index: offset + k,
          sheets: s.sheets,
          z: s.z,
          cover: s.fit === 'cover',
          pos: s.pos,
          caption: s.caption && {
            left: px(s.caption.x),
            top: py(s.caption.y),
            width: px(s.caption.w),
            align: s.caption.align ?? 'right',
            over: !!s.caption.over,
            band: !!s.caption.band,
          },
          frame: s.frame && {
            left: px(s.frame.x),
            top: py(s.frame.y),
            width: px(s.frame.w),
            height: py(s.frame.h),
          },
        };
      }),
    };
  }
}

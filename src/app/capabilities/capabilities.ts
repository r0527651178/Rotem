import { Component, HostListener, inject, input, signal } from '@angular/core';
import { Capability } from '../content';
import { RevealDirective } from '../reveal.directive';
import { SiteNav } from '../site-nav';

interface LightboxState {
  images: string[];
  index: number;
}

@Component({
  selector: 'app-capabilities',
  imports: [RevealDirective],
  templateUrl: './capabilities.html',
  styleUrl: './capabilities.scss',
})
export class Capabilities {
  readonly items = input<Capability[]>([]);

  protected readonly openId = signal<string | null>(null);
  protected readonly lightbox = signal<LightboxState | null>(null);
  protected readonly failed = signal<ReadonlySet<string>>(new Set());

  /** Arrow / image click: open the full gallery page if the section has one, else the inline gallery. */
  protected activate(cap: Capability): void {
    if (cap.galleryPage) {
      this.siteNav.go('/gallery/' + cap.id);
      return;
    }
    this.toggle(cap.id);
  }

  private readonly siteNav = inject(SiteNav);

  protected toggle(id: string): void {
    const previous = this.openId();
    if (previous === id) {
      this.openId.set(null);
      return;
    }

    this.openId.set(id);
    // Jump to the opened gallery. If another gallery is closing, wait for it to collapse
    // first (0.9s in capabilities.scss) so the target doesn't move during the scroll.
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => this.scrollToGallery(id), previous ? 950 : 80);
  }

  private scrollTimer?: ReturnType<typeof setTimeout>;

  private scrollToGallery(id: string): void {
    if (this.openId() !== id) return;
    const gallery = document.getElementById('gallery-' + id);
    if (!gallery) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    gallery.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  protected visible(images: string[]): string[] {
    const failed = this.failed();
    return images.filter((src) => !failed.has(src));
  }

  protected markFailed(src: string): void {
    const next = new Set(this.failed());
    next.add(src);
    this.failed.set(next);
  }

  protected openLightbox(images: string[], index: number): void {
    this.lightbox.set({ images, index });
    document.body.style.overflow = 'hidden';
  }

  protected closeLightbox(): void {
    this.lightbox.set(null);
    document.body.style.overflow = '';
  }

  /** step: +1 = next image, -1 = previous image. */
  protected step(step: number): void {
    const lb = this.lightbox();
    if (!lb) return;
    const n = lb.images.length;
    this.lightbox.set({ ...lb, index: (lb.index + step + n) % n });
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (!this.lightbox()) return;
    if (e.key === 'Escape') this.closeLightbox();
    // RTL: the left arrow moves forward.
    if (e.key === 'ArrowLeft') this.step(1);
    if (e.key === 'ArrowRight') this.step(-1);
  }
}

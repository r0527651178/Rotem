import { Component, ElementRef, computed, inject, signal } from '@angular/core';
import { ContentService } from '../content';
import { SiteNav } from '../site-nav';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrl: './about.scss',
  host: {
    '(pointermove)': 'onPointerMove($event)',
    '(pointerleave)': 'resetParallax()',
  },
})
export class About {
  protected readonly content = inject(ContentService).content;
  protected readonly siteNav = inject(SiteNav);
  protected readonly imageFailed = signal(false);

  protected readonly titleLetters = computed(() => Array.from(this.content()?.about.title ?? ''));

  /** Paragraph lines with a running index, so every line on the page enters in turn. */
  protected readonly paragraphs = computed(() => {
    let i = 0;
    return (this.content()?.about.paragraphs ?? []).map((lines) =>
      lines.map((text) => ({ text, i: i++ })),
    );
  });

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly reduceMotion =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Subtle depth effect: the image and its lines follow the mouse together. */
  protected onPointerMove(e: PointerEvent): void {
    if (this.reduceMotion || e.pointerType !== 'mouse') return;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    const style = this.host.nativeElement.style;
    style.setProperty('--mx', x.toFixed(3));
    style.setProperty('--my', y.toFixed(3));
  }

  protected resetParallax(): void {
    const style = this.host.nativeElement.style;
    style.setProperty('--mx', '0');
    style.setProperty('--my', '0');
  }
}

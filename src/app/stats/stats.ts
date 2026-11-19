import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import { StatItem } from '../content';

const DURATION_MS = 2200;
const numberFormat = new Intl.NumberFormat('en-US');

/** Sketch 11: counters that run from zero to their value when scrolled into view. */
@Component({
  selector: 'app-stats',
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats {
  readonly items = input<StatItem[]>([]);

  protected readonly progress = signal(0);
  protected readonly started = signal(false);

  private readonly host = inject(ElementRef<HTMLElement>);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || !('IntersectionObserver' in window)) {
        this.started.set(true);
        this.progress.set(1);
        return;
      }

      let frame = 0;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          this.started.set(true);
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / DURATION_MS);
            this.progress.set(1 - Math.pow(1 - t, 4)); // easeOutQuart
            if (t < 1) frame = requestAnimationFrame(tick);
          };
          frame = requestAnimationFrame(tick);
        },
        { threshold: 0.4 },
      );
      observer.observe(this.host.nativeElement);

      destroyRef.onDestroy(() => {
        observer.disconnect();
        cancelAnimationFrame(frame);
      });
    });
  }

  protected display(value: number): string {
    return numberFormat.format(Math.round(value * this.progress()));
  }

  /** Final text, used to reserve the width so the layout doesn't jump while counting. */
  protected final(value: number): string {
    return numberFormat.format(value);
  }
}

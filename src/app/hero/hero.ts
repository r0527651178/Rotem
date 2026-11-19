import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';

/** Duration of the wipe transition between slides (keep in sync with hero.scss). */
const TRANSITION_MS = 1400;

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  host: { '[style.--interval.ms]': 'intervalMs()', '[style.--transition.ms]': 'transitionMs' },
})
export class Hero {
  readonly images = input<string[]>([]);
  readonly intervalMs = input(6000);
  readonly tagline = input('');

  protected readonly transitionMs = TRANSITION_MS;
  protected readonly index = signal(-1);
  protected readonly prev = signal(-1);
  protected readonly failed = signal<ReadonlySet<string>>(new Set());
  protected readonly words = computed(() => this.tagline().split(/\s+/).filter(Boolean));
  protected readonly visibleImages = computed(() =>
    this.images().filter((src) => !this.failed().has(src)),
  );

  private timer?: ReturnType<typeof setInterval>;
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const count = this.visibleImages().length;
      const ms = this.intervalMs();
      untracked(() => {
        if (this.index() >= count) this.index.set(count ? 0 : -1);
        this.restart(count, ms);
      });
    });

    afterNextRender(() => {
      // Start the first wipe on the next frame so its transition runs.
      requestAnimationFrame(() => this.index() < 0 && this.visibleImages().length && this.index.set(0));

      const onScroll = () => {
        const y = Math.min(window.scrollY, window.innerHeight);
        this.host.nativeElement.style.setProperty('--scroll', String(y));
      };
      const onVisibility = () =>
        document.hidden ? this.stop() : this.restart(this.visibleImages().length, this.intervalMs());

      window.addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('visibilitychange', onVisibility);
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        document.removeEventListener('visibilitychange', onVisibility);
        this.stop();
      });
    });
  }

  protected goTo(i: number): void {
    if (i === this.index()) return;
    this.prev.set(this.index());
    this.index.set(i);
    this.restart(this.visibleImages().length, this.intervalMs());
  }

  protected onImageError(src: string): void {
    const next = new Set(this.failed());
    next.add(src);
    this.failed.set(next);
  }

  protected scrollDown(): void {
    document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' });
  }

  private next(): void {
    const count = this.visibleImages().length;
    if (count < 2) return;
    this.prev.set(this.index());
    this.index.set((this.index() + 1) % count);
  }

  private restart(count: number, ms: number): void {
    this.stop();
    if (count > 1) this.timer = setInterval(() => this.next(), ms);
  }

  private stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }
}

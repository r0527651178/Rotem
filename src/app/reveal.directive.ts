import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';

export type RevealFrom = 'up' | 'left' | 'right' | 'fade';

/**
 * Adds a scroll-triggered entrance animation.
 * The element gets the `is-visible` class once it enters the viewport.
 * Styles live in styles.scss (.reveal / .reveal--*).
 */
@Directive({
  selector: '[appReveal]',
  host: {
    class: 'reveal',
    '[class.reveal--up]': "appReveal() === 'up'",
    '[class.reveal--left]': "appReveal() === 'left'",
    '[class.reveal--right]': "appReveal() === 'right'",
    '[class.reveal--fade]': "appReveal() === 'fade'",
    '[style.--reveal-delay.ms]': 'revealDelay()',
  },
})
export class RevealDirective implements OnDestroy {
  readonly appReveal = input<RevealFrom>('up');
  readonly revealDelay = input(0);

  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement;
      if (!('IntersectionObserver' in window)) {
        node.classList.add('is-visible');
        return;
      }
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              node.classList.add('is-visible');
              this.observer?.disconnect();
            }
          }
        },
        { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
      );
      this.observer.observe(node);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

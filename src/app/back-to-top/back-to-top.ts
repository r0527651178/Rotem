import { Component, HostListener, signal } from '@angular/core';

/** Floating button (sketch 9) that returns to the top of the page. */
@Component({
  selector: 'app-back-to-top',
  template: `
    <button
      type="button"
      class="top"
      [class.top--visible]="visible()"
      [attr.tabindex]="visible() ? 0 : -1"
      [attr.aria-hidden]="!visible()"
      aria-label="חזרה לראש העמוד"
      (click)="goTop()"
    >
      <svg viewBox="0 0 24 40" aria-hidden="true">
        <path d="M12 38V8M3 15l9-11 9 11" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  `,
  styleUrl: './back-to-top.scss',
})
export class BackToTop {
  protected readonly visible = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    // The footer has its own "back to top" button (sketch 11), so hide this one there.
    const footer = document.getElementById('contact');
    const footerInView = !!footer && footer.getBoundingClientRect().top < window.innerHeight * 0.85;
    this.visible.set(window.scrollY > window.innerHeight * 0.9 && !footerInView);
  }

  protected goTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

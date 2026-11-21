import { Component, computed, inject, input } from '@angular/core';
import { MenuItem } from '../content';
import { SiteNav } from '../site-nav';

/**
 * A row of the main menu items floating at the bottom of every page, on large screens only
 * (hidden below 1280 px in floating-nav.scss). "ראשי" is left out: the logo already goes there.
 */
@Component({
  selector: 'app-floating-nav',
  template: `
    <nav class="fnav" aria-label="ניווט מהיר">
      <ul class="fnav__list">
        @for (item of items(); track item.target) {
          <li class="fnav__item">
            <a
              href="#"
              [attr.aria-current]="siteNav.isActive(item.target) ? 'page' : null"
              (click)="$event.preventDefault(); siteNav.go(item.target)"
              >{{ item.label }}</a
            >
          </li>
        }
      </ul>
    </nav>
  `,
  styleUrl: './floating-nav.scss',
})
export class FloatingNav {
  readonly nav = input<MenuItem[]>([]);

  protected readonly siteNav = inject(SiteNav);
  protected readonly items = computed(() => this.nav().filter((i) => i.target !== 'top'));
}

import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter, map } from 'rxjs';
import { ContentService } from './content';
import { Header } from './header/header';
import { BackToTop } from './back-to-top/back-to-top';
import { FloatingNav } from './floating-nav/floating-nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, BackToTop, FloatingNav],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly content = inject(ContentService).content;

  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** The About page has no black header bar (sketch 7). */
  protected readonly transparentHeader = computed(() => this.url().startsWith('/about'));

  constructor() {
    // Keep anchor targets clear of the fixed header.
    inject(ViewportScroller).setOffset(() => [0, 90]);
  }
}

import { Component, HostListener, inject, input, signal } from '@angular/core';
import { MenuItem } from '../content';
import { SiteNav } from '../site-nav';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly logo = input('');
  readonly menuLogo = input('');
  readonly menuTagline = input('');
  readonly nav = input<MenuItem[]>([]);
  /** No black bar until the page is scrolled (used on the About page). */
  readonly transparent = input(false);

  protected readonly siteNav = inject(SiteNav);

  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly logoFailed = signal(false);
  protected readonly menuLogoFailed = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 40);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.setMenu(false);
  }

  toggleMenu(): void {
    this.setMenu(!this.menuOpen());
  }

  go(target: string): void {
    this.setMenu(false);
    this.siteNav.go(target);
  }

  private setMenu(open: boolean): void {
    this.menuOpen.set(open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
}

import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Menu targets:
 *  - starting with "/"  → a page route, e.g. "/about"
 *  - "top"              → top of the home page
 *  - anything else      → id of a section on the home page, e.g. "ai"
 */
@Injectable({ providedIn: 'root' })
export class SiteNav {
  private readonly router = inject(Router);

  go(target: string): void {
    if (target.startsWith('/')) {
      this.router.navigateByUrl(target);
      return;
    }

    const onHome = this.router.url.split(/[?#]/)[0] === '/';
    if (!onHome) {
      this.router.navigate(['/'], target === 'top' ? {} : { fragment: target }).then(() => {
        // Images above the target can shift the layout after the first jump; settle on the section.
        if (target !== 'top') setTimeout(() => this.scrollTo(target), 450);
      });
      return;
    }

    this.scrollTo(target);
  }

  private scrollTo(target: string): void {
    const el = document.getElementById(target);
    if (target === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`Menu target "#${target}" does not exist on the page yet.`);
    }
  }

  isActive(target: string): boolean {
    return target.startsWith('/') && this.router.url.split(/[?#]/)[0] === target;
  }
}

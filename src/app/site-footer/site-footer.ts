import { Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactContent, MenuItem } from '../content';
import { RevealDirective } from '../reveal.directive';
import { SiteNav } from '../site-nav';

/** Israeli phone: 9–10 digits, dashes/spaces allowed, optional +972. */
const PHONE_PATTERN = /^(\+972[-\s]?|0)\d{1,2}[-\s]?\d{3}[-\s]?\d{4}$/;

@Component({
  selector: 'app-site-footer',
  imports: [ReactiveFormsModule, RevealDirective],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  readonly contact = input.required<ContactContent>();
  readonly tagline = input('');
  readonly nav = input<MenuItem[]>([]);
  readonly logo = input('');

  protected readonly siteNav = inject(SiteNav);
  protected readonly logoFailed = signal(false);
  protected readonly status = signal<'idle' | 'invalid' | 'sent'>('idle');

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    phone: ['', [Validators.pattern(PHONE_PATTERN)]],
    email: ['', [Validators.email, Validators.maxLength(120)]],
    type: [''],
  });

  protected readonly telHref = computed(() => 'tel:' + this.contact().phone.replace(/[^\d+]/g, ''));
  protected readonly mobileHref = computed(
    () => 'tel:' + this.contact().mobile.replace(/[^\d+]/g, ''),
  );

  protected showError(name: 'name' | 'phone' | 'email'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || this.status() === 'invalid');
  }

  /** At least one way to get back to the visitor. */
  protected missingReach(): boolean {
    const { phone, email } = this.form.getRawValue();
    return this.status() === 'invalid' && !phone.trim() && !email.trim();
  }

  protected selectType(type: string): void {
    const c = this.form.controls.type;
    c.setValue(c.value === type ? '' : type);
  }

  /**
   * There is no server yet, so the form opens Gmail compose with a ready message.
   * Replace this with a call to a form service / API when one is available.
   */
  protected submit(): void {
    const v = this.form.getRawValue();
    if (this.form.invalid || (!v.phone.trim() && !v.email.trim())) {
      this.form.markAllAsTouched();
      this.status.set('invalid');
      return;
    }

    const body = [
      `שם מלא: ${v.name.trim()}`,
      `טלפון: ${v.phone.trim() || '-'}`,
      `אימייל: ${v.email.trim() || '-'}`,
      `סוג פרויקט: ${v.type || '-'}`,
    ].join('\n');
    const subject = `פנייה מהאתר – ${v.name.trim()}`;
    // Opens a pre-filled Gmail compose window in a new tab (works without a desktop mail app).
    const href =
      'https://mail.google.com/mail/?view=cm&fs=1' +
      `&to=${encodeURIComponent(this.contact().email)}` +
      `&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(href, '_blank', 'noopener');
    this.status.set('sent');
    this.form.reset();
  }

  protected goTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

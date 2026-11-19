import { Component, inject } from '@angular/core';
import { ContentService } from '../content';
import { Hero } from '../hero/hero';
import { Capabilities } from '../capabilities/capabilities';
import { Stats } from '../stats/stats';
import { SiteFooter } from '../site-footer/site-footer';

@Component({
  selector: 'app-home',
  imports: [Hero, Capabilities, Stats, SiteFooter],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly content = inject(ContentService).content;
}

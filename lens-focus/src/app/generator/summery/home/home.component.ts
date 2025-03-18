import { Component } from '@angular/core';
import { GeneratorService } from '../../generator.service';
import { CookieService } from 'ngx-cookie-service';
import { FixedService } from '../../../core/utils/fixed.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(
    public fixed: FixedService,
    private generatorSer: GeneratorService,
    public cookieSer: CookieService
  ) {
    this.fixed.youtubeCookies = this.cookieSer.get('refresh_token');
  }

  youtubeConnection() {
    this.generatorSer.youtubeAuth();
  }
  youtubeDesConnection() {
    
  }
}

import { Component, OnInit } from '@angular/core';
import { GeneratorService } from '../../generator.service';
import { CookieService } from 'ngx-cookie-service';
import { FixedService } from '../../../core/utils/fixed.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieEnum } from '../../../core/enums/cookie.enum';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit{
  constructor(
    public fixed: FixedService,
    private generatorSer: GeneratorService,
    public cookieSer: CookieService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    console.log(this.fixed.youtubeCookies);
    console.log(this.cookieSer.get(CookieEnum.youtubeToken));

  }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params['token'] != null) {
        console.log(params['token'] );
            this.cookieSer.set(CookieEnum.youtubeToken,params['token'],1,'/');
            this.fixed.youtubeCookies = params['token'];
        }
        return this.router.navigate(['/generator/home']);
    });
  }


  youtubeConnection() {
    this.generatorSer.youtubeAuth();
  }

  youtubeDesConnection() {
    this.cookieSer.delete(CookieEnum.youtubeToken);
    this.fixed.youtubeCookies = null;
  }
}

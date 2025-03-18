import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { CookieEnum } from '../core/enums/cookie.enum';
import { FixedService } from '../core/utils/fixed.service';

@Injectable()
export class GeneratorService {
  http = inject(HttpClient);
  cookieSer = inject(CookieService);
  fixed = inject(FixedService);

  youtubeAuth() {
    this.http
      .get<{ authUrl: string }>('/api/auth/googleLogin')
      .subscribe((res) => {
        window.location.href = String(res);
      });
  }

  getContent(): Observable<any> {
    return this.http.get('/api/content/fetchContent',
      {headers:{ Authorization: `Bearer ${this.cookieSer.get(CookieEnum.LensFocusToken)}`,
      Cookies: `${this.cookieSer.get(CookieEnum.youtubeToken)}`} ,withCredentials: true});
  }
  // "1%2F%2F09LEklLB_VWzhCgYIARAAGAkSNwF-L9Ir7evLyEAbitUT0Cjuj_g8xyECi76eNdheQOqXt4ocJQ5uKx_xRF3g_82hToseRD1To8c"
  removeYoutubeConnection(){
    this.cookieSer.delete('refresh_token');
  }
}

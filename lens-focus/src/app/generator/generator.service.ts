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
      .get<{ authUrl: string }>('/api/auth/googleLogin', {
        headers: {
          Authorization: `Bearer ${this.cookieSer.get(
            CookieEnum.LensFocusToken
          )}`,
        },
      })
      .subscribe((res) => {
        window.location.href = String(res);
      });
  }

  getContent(): Observable<any> {
    return this.http.get('/api/content/fetchContent', {
      headers: {
        Authorization: `Bearer ${this.cookieSer.get(
          CookieEnum.LensFocusToken
        )}`,
        googletoken: `${this.cookieSer.get(CookieEnum.youtubeToken)}`,
      },
    });
  }
  removeYoutubeConnection() {
    this.cookieSer.delete('refresh_token');
  }
  getSummery(contentId): Observable<any> {
    return this.http.post('/api/summery/' + contentId,contentId);
  }
}

import { Injectable } from '@angular/core';
import { FixedService } from '../core/utils/fixed.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { CookieEnum } from '../core/enums/cookie.enum';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(public fixed: FixedService, private storage: StorageMap, private http: HttpClient, private cookieSer: CookieService, private router: Router) {}

  obtainAccessToken(loginData): Observable<any> {
    return this.http.post('token', loginData);
  }

  saveToken(data) {
    this.cookieSer.deleteAll();
    this.cookieSer.set(CookieEnum.LensFocusToken, data.token, new Date(data.expiration), '/');
    this.cookieSer.set(CookieEnum.LensFocusRefresh, data.refresh.token, new Date(data.refresh.expiresUtc), '/');
    this.storage.set(CookieEnum.LensFocusUserProfile, data.profile).subscribe(() => {});
  }

  refreshToken(data) {
    this.cookieSer.deleteAll();
    this.cookieSer.set(CookieEnum.LensFocusToken, data.token, new Date(data.expiration), '/');
    this.cookieSer.set(CookieEnum.LensFocusRefresh, data.refresh.token, new Date(data.refresh.expiresUtc), '/');
  }

  logout() {
    if (window.location.pathname.indexOf('login') < 0) {
      this.storage.clear().subscribe(() => {
        this.http
          .post('Token/Logout', {
            refreshToken: this.cookieSer.get(CookieEnum.LensFocusRefresh),
          })
          .subscribe(() => {});
        this.fixed = new FixedService();
        this.cookieSer.deleteAll('/');
        window.location.href =
          window.location.pathname.indexOf('login') > 0 && window.location.pathname.indexOf('returnUrl') > 0
            ? this.router.url
            : '/login?returnUrl=' + this.router.url;
      });
    }
  }

  obtainRefreshToken() {
    return this.http.post('Token/Refresh', {
      refreshToken: this.cookieSer.get(CookieEnum.LensFocusRefresh),
    });
  }

  isAuthenticated() {
    return !this.cookieSer.check(CookieEnum.LensFocusRefresh) && !this.cookieSer.check(CookieEnum.LensFocusToken) ? false : true;
  }

}

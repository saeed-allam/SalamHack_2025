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
  constructor(public fixed: FixedService, private storage: StorageMap, private http: HttpClient, private cookieSer: CookieService, private router: Router) { }

  obtainAccessToken(loginData): Observable<any> {
    return this.http.post('/api/auth/login', loginData);
  }
  registerUser(userData): Observable<any> {
    return this.http.post('/api/auth/register', userData);
  }
  googleLogin(){
    return this.http.get('/api/auth/googleLogin');
  }
  
  saveToken(data) {
    console.log(data)
    this.cookieSer.deleteAll();
    this.cookieSer.set(CookieEnum.LensFocusToken, data.user.token, null, '/');
    this.storage.set(CookieEnum.LensFocusUserProfile, data.user).subscribe(() => { });
    console.log(this.storage.get(CookieEnum.LensFocusUserProfile));

  }

  logout() {
    if (window.location.pathname.indexOf('login') < 0) {
      this.storage.clear().subscribe(() => {
        this.cookieSer.deleteAll('/');
        this.router.navigate(['/account/login']);
      });
    }
  }



  isAuthenticated() {
    return !this.cookieSer.check(CookieEnum.LensFocusToken) ? false : true;
  }

}

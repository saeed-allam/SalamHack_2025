import { Injectable } from '@angular/core';
import { FixedService } from '../core/utils/fixed.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { CookieEnum } from '../core/enums/cookie.enum';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(
    private afAuth: AngularFireAuth,
    public fixed: FixedService,
    private storage: StorageMap,
    private http: HttpClient,
    private cookieSer: CookieService,
    private router: Router
  ) {
    if (!initializeApp.length) {
      initializeApp(environment['firebase']);
    }
  }

  obtainAccessToken(loginData): Observable<any> {
    return this.http.post('/api/auth/login', loginData);
  }
  registerUser(userData): Observable<any> {
    return this.http.post('/api/auth/register', userData);
  }

  async loginWithGoogle() {
    // try {
    //   const result = await this.afAuth.signInWithPopup(
    //     new firebase.auth.GoogleAuthProvider()
    //   );
    //   console.log(result);

    //   this.cookieSer.set(CookieEnum.LensFocusToken, result.user.multiFactor['user'].accessToken, null, '/');
    //   this.cookieSer.set(CookieEnum.LensFocusRefresh, result.user.multiFactor['user'].stsTokenManager['refreshToken'], null, '/');
    //   this.storage.set(CookieEnum.LensFocusUserProfile, {"email":result.user.multiFactor['user'].email,"name":result.user.multiFactor['user'].displayName})
    //   .subscribe(() => {});
    //   return result.user;
    // } catch (error) {
    //   console.error('Login Failed:', error);
    //   return null;
    // }
    try {
      this.http
        .get<{ authUrl: string }>('/api/auth/googleLogin')
        .subscribe((res) => {
          window.location.href = String(res); // Redirect to Google Login
        });
    } catch (error) {
        console.error('Login Failed:', error);
        return null;
    }
  }

  saveToken(data) {
    this.cookieSer.deleteAll();
    this.cookieSer.set(CookieEnum.LensFocusToken, data.user.token, null, '/');
    this.storage
      .set(CookieEnum.LensFocusUserProfile, data.user)
      .subscribe(() => {});
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

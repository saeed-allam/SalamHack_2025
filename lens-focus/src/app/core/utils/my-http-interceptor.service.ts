import { HttpInterceptorFn } from '@angular/common/http';
import { CookieEnum } from '../enums/cookie.enum';
import { inject } from '@angular/core';
import { FixedService } from './fixed.service';
import { CookieService } from 'ngx-cookie-service';

export const MyHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const fixed = inject(FixedService);
  const cookieSer = inject(CookieService);

  const authToken = cookieSer.get(CookieEnum.LensFocusToken);
  const cookieToken = cookieSer.get(CookieEnum.youtubeToken);

  if (req.url.startsWith('/api')) {

    req = req.clone({
      url: `http://localhost:3000${req.url}`, // Prepend server URL
      // setHeaders:
      //    { Authorization: `Bearer ${authToken}`,Ycookie:cookieToken }

    });
  }

  return next(req);
};

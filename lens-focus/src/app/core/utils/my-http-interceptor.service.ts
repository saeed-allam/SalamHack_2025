import { HttpInterceptorFn } from '@angular/common/http';
import { CookieEnum } from '../enums/cookie.enum';
import { inject } from '@angular/core';
import { FixedService } from './fixed.service';

export const MyHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const fixed = inject(FixedService);
  console.log(fixed.sysConfig.serverUrl);

  const authToken = localStorage.getItem(CookieEnum.LensFocusToken);
  //   if (req.url.startsWith('/api')) {
  //   const authReq =  req.clone({
  //     url: `http://localhost:3000/${req.url}`,
  //     setHeaders: {
  //       Authorization: `Bearer ${authToken}`,
  //       seaad:"dddddddddd"
  //     }
  //   }) ;
  // }

  if (req.url.startsWith('/api')) {
    console.log("/api");

    req = req.clone({
      url: `http://localhost:3000${req.url}`, // Prepend server URL
      setHeaders: authToken
        ? { Authorization: `Bearer ${authToken}`, saeed: 'saeed-allam' }
        : {},
    });
  }

  return next(req);
  // return next(authReq);
};

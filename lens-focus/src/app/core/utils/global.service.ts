import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { FixedService } from './fixed.service';
import { CookieEnum } from '../enums/cookie.enum';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class GlobalService {
  toastrOptions: any;
  appLangChanged: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  mainDataLoaded: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
  formatDate: any;

  constructor(
    public fixed: FixedService,
  ) {
  }

  activeMode(themeColor) {
    const body = document.getElementsByTagName('body')[0] as HTMLBodyElement;
    if (themeColor == 'dark') {
      this.fixed.activeMode = 'dark';
      body.classList.add('active-light-mode');
      body.classList.remove('active-dark-mode');
    } else {
      this.fixed.activeMode = 'light';
      body.classList.add('active-dark-mode');
      body.classList.remove('active-light-mode');

    }
  }
}

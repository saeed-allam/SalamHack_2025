import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FixedService } from '../core/utils/fixed.service';
import { GlobalService } from '../core/utils/global.service';
import { AccountService } from './account.service';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  activeRoute:string;
  private router = inject(Router);
constructor(public fixed:FixedService,public global:GlobalService, private accountSer:AccountService){}
  ngAfterContentChecked(){
    this.activeRoute = this.router.url;
  }
  loginGoogle() {
    this.accountSer.loginWithGoogle()
    .then(user => {
      // if (user) {
        this.router.navigate(['/generator/home']);
        // console.log('User logged in:', user);
        // console.log(user.multiFactor['user'].accessToken);
        // console.log(user.multiFactor['user'].email);
        // console.log(user.multiFactor['user'].displayName);
        // console.log(user.multiFactor['user'].photoURL);
        // console.log(user.multiFactor['user'].stsTokenManager);
        // console.log(user.multiFactor['user'].stsTokenManager['accessToken']);
        // console.log(user.multiFactor['user'].stsTokenManager['refreshToken']);

      // }
    });
  }
}

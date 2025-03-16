import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FixedService } from '../core/utils/fixed.service';
import { GlobalService } from '../core/utils/global.service';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  activeRoute:string;
  private router = inject(Router);
constructor(public fixed:FixedService,public global:GlobalService){}
  ngAfterContentChecked(){
    this.activeRoute = this.router.url;
  }

}

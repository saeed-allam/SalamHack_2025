import { Component } from '@angular/core';
import $ from 'jquery';
import { FixedService } from '../core/utils/fixed.service';
import { GlobalService } from '../core/utils/global.service';
@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  preloader: boolean = true;
  mobileMenu:boolean = false;
  constructor(public fixed:FixedService, public global:GlobalService) {
    setTimeout(()=>this.preloader = false, 1000);
  }

}

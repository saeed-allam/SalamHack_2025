import { Component } from '@angular/core';
import { FixedService } from '../../core/utils/fixed.service';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-summery',
  standalone: false,
  templateUrl: './summery.component.html',
  styleUrl: './summery.component.scss',
})
export class SummeryComponent {
  preloader: boolean = true;
  mobileMenu: boolean = false;
  constructor(public fixed: FixedService, public accountSer: AccountService) {
    setTimeout(() => (this.preloader = false), 1000);
  }
}

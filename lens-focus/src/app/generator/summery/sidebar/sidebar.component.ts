import { Component } from '@angular/core';
import { FixedService } from '../../../core/utils/fixed.service';
import { GlobalService } from '../../../core/utils/global.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(public fixed:FixedService, public global:GlobalService){}

}

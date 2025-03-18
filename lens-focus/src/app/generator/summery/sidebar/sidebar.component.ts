import { Component } from '@angular/core';
import { FixedService } from '../../../core/utils/fixed.service';
import { GlobalService } from '../../../core/utils/global.service';
import { GeneratorService } from '../../generator.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(public fixed:FixedService, public global:GlobalService,public generatorSer:GeneratorService){}

  youtubeContent(){
    this.generatorSer.getContent().subscribe({
      next: (res)=>{
        console.log(res);

      }
    })
  }
}

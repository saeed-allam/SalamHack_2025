import { Component, OnInit } from '@angular/core';
import { FixedService } from '../../../core/utils/fixed.service';
import { GlobalService } from '../../../core/utils/global.service';
import { GeneratorService } from '../../generator.service';

@Component({
  selector: 'app-channel',
  standalone: false,
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
})
export class ChannelComponent implements OnInit {
  constructor(
    public fixed: FixedService,
    public global: GlobalService,
    public generatorSer: GeneratorService
  ) {
  }
ngOnInit(){
    this.youtubeContent();}
    
  youtubeContent() {
    this.generatorSer.getContent().subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }
}

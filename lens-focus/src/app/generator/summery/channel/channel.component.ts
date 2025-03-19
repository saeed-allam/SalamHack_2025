import { Component, OnInit } from '@angular/core';
import { FixedService } from '../../../core/utils/fixed.service';
import { GlobalService } from '../../../core/utils/global.service';
import { GeneratorService } from '../../generator.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-channel',
  standalone: false,
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
})
export class ChannelComponent implements OnInit {
  youtubeRes: any;
  ChannelType:string;
  constructor(
    public fixed: FixedService,
    public global: GlobalService,
    public generatorSer: GeneratorService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['type'] != null) {
        this.ChannelType = params['type'];
      }
    });
    this.youtubeContent();
  }

  youtubeContent() {
    this.generatorSer.getContent().subscribe({
      next: (res) => {
        this.youtubeRes = res;
      },
      error: (err) => {
        if (err.status == 401) this.router.navigateByUrl('/generator/home');
      },
    });
  }
}

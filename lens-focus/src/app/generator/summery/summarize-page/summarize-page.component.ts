import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FixedService } from '../../../core/utils/fixed.service';
import { GlobalService } from '../../../core/utils/global.service';
import { GeneratorService } from '../../generator.service';

@Component({
  selector: 'app-summarize-page',
  standalone: false,
  templateUrl: './summarize-page.component.html',
  styleUrl: './summarize-page.component.scss',
})
export class SummarizePageComponent implements OnInit {
  constructor(
    public fixed: FixedService,
    public global: GlobalService,
    public generatorSer: GeneratorService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id'] != null) {
        this.getSummariez(params['id']);
      }
    });
  }

  getSummariez(id: string) {
    this.generatorSer
      .getSummery(id)
      .subscribe({ next: (req) => {
        console.log(req);

      }, error: (err) => {} });
  }
}

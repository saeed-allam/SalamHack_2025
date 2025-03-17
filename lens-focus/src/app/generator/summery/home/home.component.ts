import { Component } from '@angular/core';
import { GeneratorService } from '../../generator.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private generatorSer: GeneratorService) {}

  youtubeConnection() {
    this.generatorSer
      .youtubeAuth()
      .subscribe({ next: (req) => {
        console.log(req);
      }, error: (err) => {
        console.log(err);

      } });
  }
}

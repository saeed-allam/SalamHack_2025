import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { CoreModule } from '../core/core.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    CoreModule.forRoot(),
    RouterModule.forChild([{ path: '', component: LandingPageComponent }]),
  ],
})
export class LandingPageModule {}

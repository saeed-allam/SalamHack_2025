import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SummeryComponent } from './summery/summery.component';
import { SidebarComponent } from './summery/sidebar/sidebar.component';
import { HomeComponent } from './summery/home/home.component';
import { SummarizePageComponent } from './summery/summarize-page/summarize-page.component';
import { RouterModule } from '@angular/router';
import { ChannelComponent } from './summery/channel/channel.component';
import { GlobalService } from '../core/utils/global.service';
import { GeneratorService } from './generator.service';
import { AccountService } from '../account/account.service';

@NgModule({
  declarations: [
    SummeryComponent,
    SidebarComponent,
    HomeComponent,
    SummarizePageComponent,
    ChannelComponent,
  ],
  imports: [
    CommonModule,
    CoreModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: SummeryComponent,
        children: [
          { path: '', redirectTo: 'home', pathMatch: 'full' },
          { path: 'home', component: HomeComponent },
          { path: 'home/:token', component: HomeComponent },
          { path: 'channel/:type', component: ChannelComponent },
          { path: 'summarize/:id', component: SummarizePageComponent },
        ],
      },
    ]),
  ],
  providers:[GlobalService,GeneratorService,AccountService]
})
export class GeneratorModule {}

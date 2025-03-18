import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SystemConfigService } from './core/utils/system-config.service';

export function loadConfigurations(configService: SystemConfigService) {
  return () => configService.load();
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule.forRoot(),
  ],
  providers: [
    SystemConfigService,

    // @ts-ignore
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigurations,
      deps: [SystemConfigService], // dependancy
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SystemConfigService } from './core/utils/system-config.service';
import { environment } from '../environments/environment';

export function loadConfigurations(configService: SystemConfigService) {
  return () => configService.load();
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule.forRoot(),
     AngularFireModule.initializeApp(environment['firebase']),
     AngularFireAuthModule
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

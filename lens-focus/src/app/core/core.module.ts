import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleLayoutComponent } from './theme/simple-layout/simple-layout.component';
import { FullLayoutComponent } from './theme/full-layout/full-layout.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FixedService } from './utils/fixed.service';
import { TranslateModule } from '@ngx-translate/core';
import { MobileMenuComponent } from './component/mobile-menu/mobile-menu.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { MyHttpInterceptor } from './utils/my-http-interceptor.service';
import { TruncateWordsPipe } from './pipe/truncate-words.pipe';

const fixed = new FixedService();

@NgModule({
  declarations: [SimpleLayoutComponent, FullLayoutComponent, MobileMenuComponent, TruncateWordsPipe],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MobileMenuComponent,
    TruncateWordsPipe
  ],
  providers: [
    { provide: FixedService, useValue: fixed },
    provideHttpClient(withInterceptors([MyHttpInterceptor])),
  ],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
    };
  }
}

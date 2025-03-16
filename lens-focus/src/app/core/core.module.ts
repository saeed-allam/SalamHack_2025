import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleLayoutComponent } from './theme/simple-layout/simple-layout.component';
import { FullLayoutComponent } from './theme/full-layout/full-layout.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FixedService } from './utils/fixed.service';
import { TranslateModule } from '@ngx-translate/core';
import { MobileMenuComponent } from './component/mobile-menu/mobile-menu.component';
// import { ValidatorService } from './utils/validator.service';
// import { AuthGuard } from './utils/auth.guard';

const fixed = new FixedService();

@NgModule({
  declarations: [SimpleLayoutComponent, FullLayoutComponent, MobileMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MobileMenuComponent
  ],
  providers: [
    { provide: FixedService, useValue: fixed },
  ],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
    };
  }
}

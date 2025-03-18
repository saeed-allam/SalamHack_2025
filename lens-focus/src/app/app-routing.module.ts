import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimpleLayoutComponent } from './core/theme/simple-layout/simple-layout.component';
import { FullLayoutComponent } from './core/theme/full-layout/full-layout.component';

const routes: Routes = [

  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  {
    path: 'account',
    component: SimpleLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./account/account.module').then((m) => m.AccountModule),
      },
    ],
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'home',
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./landing-page/landing-page.module').then(
            (m) => m.LandingPageModule
          ),
      },
      {
        path: 'generator',
        loadChildren: () =>
          import('./generator/generator.module').then((m) => m.GeneratorModule),
      },
    ],
  },
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "**", redirectTo: "/dashboard" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

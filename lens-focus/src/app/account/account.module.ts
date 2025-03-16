import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountService } from './account.service';
import { CoreModule } from '../core/core.module';
import { AccountComponent } from './account.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, AccountComponent],
  imports: [
    CommonModule,
    CoreModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: AccountComponent,
        children: [
          {path:'', redirectTo:'login',pathMatch:'full'},
          { path: 'login', component: LoginComponent },
          { path: 'register', component: RegisterComponent },
        ],
      },
    ]),
  ],
  providers: [AccountService],
})
export class AccountModule {}

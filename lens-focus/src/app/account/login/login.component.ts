import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FixedService } from '../../core/utils/fixed.service';
import { GlobalService } from '../../core/utils/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loading: boolean;
  showMassage: boolean = false;

  constructor(
    public fixed: FixedService,
    public global: GlobalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private accountService: AccountService
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      pw: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onLoginSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;

    this.accountService.obtainAccessToken(this.loginForm.value).subscribe({
      next: response => {
        this.loading = false;
        if (response.menu == 0) return (this.showMassage = true);
       this.router.navigate(['/']);
       return this.accountService.saveToken(response);
      },
      error: () => {
        // this.loading = false;
      },
    });
  }

}

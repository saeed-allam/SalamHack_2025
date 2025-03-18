import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FixedService } from '../../core/utils/fixed.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/utils/global.service';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  RegisterForm: FormGroup;
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
    this.loginBefore();
  }

  ngOnInit() {
    this.RegisterForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      pw: ['', [Validators.required, Validators.minLength(6)]],
      confirmPW: ['', [Validators.required, Validators.minLength(6)]],
    },{
      validator: [this.mustMatch('pw', 'confirmPW')],
  },);
  }

  get f() {
    return this.RegisterForm.controls;
  }

  onRegistSubmit() {
    this.submitted = true;
    if (this.RegisterForm.invalid) {
      return;
    }
    let payload = { ...this.RegisterForm.value }; // Clone the object

  delete payload.confirmPW;

    console.log(this.RegisterForm.value);
    console.log(payload);
    this.accountService.registerUser(payload).subscribe({
      next: response => {
        console.log(response);
       return this.accountService.saveToken(response);
        // this.redirect();
      },
      error: () => {
        // this.loading = false;
      },
    });
  }

  loginBefore() {
    if (this.accountService.isAuthenticated()) {
      // this.redirect();
      console.log('redirect');

    }
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}
}


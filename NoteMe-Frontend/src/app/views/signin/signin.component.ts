import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService, toastTypes } from 'src/app/services/toast.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  userForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastService:ToastService
  ) {
    // Create a reactive form for login with validations
    this.userForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  signIn() {
    // Perform the login using the authentication service
    this.authService.signIn(this.userForm.value).subscribe(
      (res) => {
        // Store the access token in local storage
        localStorage.setItem('token', res.token);
        // Redirect to the 'note' component
        this.router.navigate(['/note']);
      },
      (err) => {
        console.log(err);
        this.toastService.initiate({
          title:'Error',
          content:err.error
        })
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user.interface';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  userForm: FormGroup;

  ngOnInit() {}

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    // Create a reactive form for user registration with validations
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  signUp() {
    // Construct a User object with the form's values
    const user: User = {
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
    };

    // Call the signUp method of the authentication service to register the user
    this.authService.signUp(user).subscribe(
      (res) => {
        this.router.navigate(['/signin']);
      },
      (err) => {
        console.log(err);
        this.toastService.initiate({
          title: 'Error',
          content: err.error.errors[0].msg,
        });
      }
    );
  }
}

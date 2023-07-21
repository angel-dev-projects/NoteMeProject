import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  decodedToken: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    // Initialize the password change form
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Get the current user of the authentication service
    this.decodedToken = this.authService.getUser();
  }

  changePassword() {
    // Make a request to change the current user's password
    this.userService
      .changePassword(this.decodedToken._id, this.passwordForm.value)
      .subscribe(
        (res) => {
          // The password was changed successfully, show a success message and redirect the user to the main page
          this.toastService.initiate({
            title: 'Password updated',
            content: `Your password has been changed successfully`,
          });
          this.router.navigate(['/profile']);
        },
        (err) => {
          // There was an error changing the password, display an error message and set the custom error message
          this.toastService.initiate({
            title: 'Error',
            content: err.error.errors[0].msg,
          });
        }
      );
  }

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    // Custom validator to check if passwords match
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      // If the passwords do not match, an object with the key 'passwordMismatch' is returned to indicate the error
      return { passwordMismatch: true };
    }

    // If the passwords match, null is returned to indicate that there are no errors
    return null;
  };
}

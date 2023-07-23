import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit{
  userForm: FormGroup;
  decodedToken: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    // Initialize the profile edit form
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Get the current user of the authentication service
    this.decodedToken = this.authService.getUser();

    // Get the user data and set the values in the form
    this.userService.getUser(this.decodedToken._id).subscribe((data) => {
      this.userForm.setValue({
        username: data.username,
        email: data.email,
        password: '',
      });
    });
  }

  updateProfile() {
    // Create an user object with the form data
    const usuario: User = {
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
    };

    // Make a request to update the user's profile
    this.userService.updateUser(usuario, this.decodedToken._id).subscribe(
      (res) => {
        this.toastService.initiate({
          title: 'Profile updated',
          content: `User updated successfully`,
        });
        this.router.navigate(['/profile']);
      },
      (err) => {
        this.toastService.initiate({
          title: 'Error',
          content: err.error.errors[0].msg,
        });
      }
    );
  }
}

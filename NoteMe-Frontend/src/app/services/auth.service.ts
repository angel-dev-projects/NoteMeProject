import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { environment } from '../environments/environment';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URL = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(user: User) {
    // Makes an HTTP POST request to the server to register a new user
    return this.http.post<any>(this.URL + 'users/signup', user);
  }

  signIn(user: User) {
    // Makes an HTTP POST request to the server to log in with the user's credentials
    return this.http.post<any>(this.URL + 'users/signin', user);
  }

  loggedIn() {
    // Checks if the token is present in local storage and returns a boolean value
    return !!localStorage.getItem('token');
  }

  getToken() {
    // Get token from local storage
    return localStorage.getItem('token');
  }

  logOut() {
    // Remove token from local storage and redirect user to login page
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }

  getUser(): any {
    // Gets the JWT token from local storage
    const token = this.getToken();

    // Check if token is null or empty
    if (!token) {
      // If the token does not exist, return null
      return null;
    }

    // Decode JWT token to get user information
    const decodedToken: any = jwt_decode(token);

    // Returns the user if it is available in the token
    return decodedToken || null;
  }
}

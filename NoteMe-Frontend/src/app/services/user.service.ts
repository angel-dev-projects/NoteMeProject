import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUser(id: string): Observable<any> {
    // Make an HTTP GET request to the server to get the details of a user with the provided ID
    return this.http.get(`${this.apiUrl}users/${id}`);
  }

  updateUser(user: User, id: string) {
    // Make an HTTP PUT request to the server to update a user's details
    return this.http.put(`${this.apiUrl}users/${id}`, user);
  }

  changePassword(id: string, passwords: Object) {
    return this.http.put(
      `${this.apiUrl}users/change-password/${id}`,
      passwords
    );
  }
}

import { Component, AfterViewInit } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Declare the "bootstrap" variable to use the Bootstrap library
declare var bootstrap: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements AfterViewInit {
  filteredUsers$!: Observable<string[]>;
  searchedUser: string = '';

  constructor(
    public authService: AuthService,
    private userService: UserService
  ) {}

  ngAfterViewInit() {
    // Get all elements with "data-bs-toggle='tooltip'"
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );

    // Initialize Bootstrap tooltips for each tooltip element found
    tooltipTriggerList.map((tooltipTriggerEl: HTMLElement) => {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // Function to search for users based on the input value
  searchUser(value: any) {
    // Call the userService's searchUser method and store the returned observable
    this.filteredUsers$ = this.userService.searchUser(value).pipe(
      // Map the usernames from the observable to return them
      map((usernames: string[]) => {
        return usernames;
      })
    );
  }
}

import { Component, AfterViewInit } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map((tooltipTriggerEl: HTMLElement) => {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  searchUser(value: any) {
    this.filteredUsers$ = this.userService.searchUser(value).pipe(
      map((usernames: string[]) => {
        return usernames;
      })
    );
  }
}

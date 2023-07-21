import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  isLoading$ = new Subject<boolean>();

  show(): void {
    // Emits a "true" value via Subject "isLoading$"
    this.isLoading$.next(true);
  }

  hide(): void {
    // Emits a "false" value via Subject "isLoading$"
    this.isLoading$.next(false);
  }
}

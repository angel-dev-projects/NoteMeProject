import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from '../services/spinner.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private spinnerService: SpinnerService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Display the spinner or loading indicator using the "SpinnerService" service
    this.spinnerService.show();

    // Intercept the HTTP request and pass to the next interceptor in the chain of interceptors
    // Returns the observable response of the HTTP request
    return next.handle(req).pipe(
      // When the request is complete, the "finalize" function of the "pipe" operator is executed
      // Hide the spinner or loading indicator using the "SpinnerService" service
      finalize(() => this.spinnerService.hide())
    );
  }
}

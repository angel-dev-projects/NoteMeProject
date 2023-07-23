import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './helpers/auth.guard';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
import { SpinnerModule } from './shared/spinner/spinner.module';
import { SignupComponent } from './views/signup/signup.component';
import { SigninComponent } from './views/signin/signin.component';
import { NoteComponent } from './views/note/note.component';
import { ToastComponent } from './components/toast/toast.component';
import { ProfileComponent } from './views/profile/profile.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignupComponent,
    SigninComponent,
    NoteComponent,
    ToastComponent,
    ProfileComponent,
    ChangePasswordComponent,
    SidenavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SpinnerModule,
    MatSidenavModule,
    MatButtonModule,
    NgIf,
    ColorPickerModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './views/signup/signup.component';
import { SigninComponent } from './views/signin/signin.component';
import { NoteComponent } from './views/note/note.component';
import { AuthGuard } from './helpers/auth.guard';
import { ProfileComponent } from './views/profile/profile.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/note',
    pathMatch: 'full',
  },
  {
    path: 'note/:id',
    component: NoteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'note',
    component: NoteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path:'change-password',
    component:ChangePasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

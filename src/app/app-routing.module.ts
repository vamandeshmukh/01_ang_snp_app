import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './components/user/register/register.component';
import { LoginComponent } from './components/user/login/login.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { ResetPasswordComponent } from './components/user/reset-password/reset-password.component';
import { CreatePasswordComponent } from './components/user/create-password/create-password.component';
import { SettingsComponent } from './components/settings/settings.component';
import { FriendsComponent } from './components/friend/friends/friends.component';
import { NetworkComponent } from './components/friend/network/network.component';
import { AuthGuard } from './core/auth.guard';
import { UsersComponent } from './components/user/users/users.component';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'create-password',
    component: CreatePasswordComponent
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    component: SettingsComponent
  },
  {
    path: 'friends',
    canActivate: [AuthGuard],
    component: FriendsComponent
  },
  {
    path: 'network',
    canActivate: [AuthGuard],
    component: NetworkComponent
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    component: UsersComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }

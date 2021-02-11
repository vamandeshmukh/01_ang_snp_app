import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';

// Modules/Configurations
import { AppRoutingModule } from './app-routing.module';
import { AppBootstrapModule } from './bootstrap.module';
import { AppConfig } from './config/app.config';
import { JwtInterceptor } from './core/jwt.interceptor';
import { AuthGuard } from './core/auth.guard';

// Components
import { AppComponent } from './app.component';
import { NavigationBarComponent } from './components/shared/navigation-bar/navigation-bar.component';
import { RegisterComponent } from './components/user/register/register.component';
import { LoginComponent } from './components/user/login/login.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { PostComponent } from './components/home/post/post.component';
import { ProfileComponent } from './components/home/profile/profile.component';
import { ResetPasswordComponent } from './components/user/reset-password/reset-password.component';
import { CreatePasswordComponent } from './components/user/create-password/create-password.component';
import { SettingsComponent } from './components/settings/settings.component';
import { FriendsComponent } from './components/friend/friends/friends.component';
import { NetworkComponent } from './components/friend/network/network.component';

// Global Services
import { GlobalErrorHandlerService } from './services/global-error-handler.service';
import { AuthenticationService } from './services/authentication.service';
import { UsersComponent } from './components/user/users/users.component';
import { BaseComponent } from './components/base/base.component';

// custom directive import 
import { MyDirective } from './components/home/post/post.mydirective';
import {MyCmp} from './components/home/post/post.my-cmp';

export function initConfig(config: AppConfig) {
  return () => config.load();
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    PostComponent,
    ProfileComponent,
    ResetPasswordComponent,
    CreatePasswordComponent,
    SettingsComponent,
    FriendsComponent,
    NetworkComponent,
    UsersComponent,
    BaseComponent, 
    MyDirective, 
    MyCmp
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppBootstrapModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfig],
      multi: true
    },
    GlobalErrorHandlerService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

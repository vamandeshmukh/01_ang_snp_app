import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {
  isUserLoggedIn: Observable<boolean>;
  isAdmin: Observable<boolean>;
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);

  constructor(private breakpointObserver: BreakpointObserver, public authService: AuthenticationService) {
    this.isAdmin = authService.isAdmin();
    this.isUserLoggedIn = authService.isUserLoggedIn();
  }

  onLogout() {
    this.authService.logout();
  }
}

import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'underscore';

import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { UtilityService } from '../../../services/utility.service';
import { BaseComponent } from '../../base/base.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent extends BaseComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  noUsers: Boolean = false;

  constructor(private userService: UserService, private utility: UtilityService, private toastService: ToastrService) {
    super();
  }

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.userService.getUsers().pipe(takeUntil(this.unsubscribe)).subscribe(users => {
      users = _.filter(users, function (user) { return user.isAdmin !== true });
      this.isLoading = false;
      this.noUsers = users.length <= 0 ? true : false;
      users.forEach(element => {
        element.dob = this.utility.convertDateFormat(element.dob);
      });
      this.users = users;
    }, err => {
      this.toastService.error('Data Loading Error: ' + err.status + ' - ' + err.statusText);
      throw err;
    });
  }

  onDisableUserClick(userSelected: User) {
    let detailsToUpdate = {
      id: userSelected.id,
      isActive: false
    };

    this.userService.updateUser(detailsToUpdate).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }

  onEnableUserClick(userSelected: User) {
    let detailsToUpdate = {
      id: userSelected.id,
      isActive: true
    };
    this.userService.updateUser(detailsToUpdate).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { UserService } from '../../../services/user.service';
import { FriendHelperService } from '../../../utilities/friend-helper.service';
import { User } from '../../../models/user.model';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent extends BaseComponent implements OnInit {
  networkUsers: User[] = [];
  activeUserObject: any;
  noUsers: Boolean;
  isLoading: Boolean = true;

  constructor(private userService: UserService, private friendHelper: FriendHelperService) {
    super();
    this.activeUserObject = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadNetworkUsers();
  }

  loadNetworkUsers() {
    this.userService.getUsers().pipe(takeUntil(this.unsubscribe)).subscribe(allUsers => {
      if (allUsers.length <= 1) {
        this.isLoading = false;
        this.noUsers = true;
        return;
      }

      this.friendHelper.createNetworkUserList(this.activeUserObject._id, allUsers)
        .pipe(takeUntil(this.unsubscribe)).subscribe(networkUsers => {
          this.isLoading = false;
          this.noUsers = networkUsers.length <= 0 ? true : false;
          this.networkUsers = networkUsers;
        });
    });
  }

  onRequestButtonClick(frinedClicked) {
    let friendRequestObject = {
      id: '',
      userId: this.activeUserObject._id,
      friendId: frinedClicked.id,
      status: 'Request Pending'
    }

    this.friendHelper.createNewFriendRequest(friendRequestObject).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }
}

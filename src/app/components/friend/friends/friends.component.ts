import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { FriendHelperService } from '../../../utilities/friend-helper.service';
import { User } from '../../../models/user.model';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent extends BaseComponent implements OnInit {
  requestingFriends: User[] = [];
  activeUserObject: any;
  noFriends: Boolean;
  isLoading: Boolean = true;

  constructor(private friendHelper: FriendHelperService) {
    super();
    this.activeUserObject = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadRequestingFriends();
  }

  loadRequestingFriends() {
    this.friendHelper.loadRequestingFriends(this.activeUserObject._id)
      .pipe(takeUntil(this.unsubscribe)).subscribe(finalRequesters => {
        this.isLoading = false;
        this.noFriends = finalRequesters.length <= 0 ? true : false;
        this.requestingFriends = finalRequesters;
      });
  }

  onAcceptButtonClick(frinedClicked) {
    let friendRequestObject = {
      id: frinedClicked.id,
      status: 'You are friend'
    }

    this.friendHelper.updateFriendRequest(friendRequestObject).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }

  onRejectButtonClick(frinedClicked) {
    let friendRequestObject = {
      id: frinedClicked.id,
      status: 'Request Rejected'
    }

    this.friendHelper.updateFriendRequest(friendRequestObject).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }
}


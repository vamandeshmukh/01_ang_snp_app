import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'underscore';

import { UtilityService } from '../services/utility.service';
import { PostService } from '../services/post.service';
import { FileUploadService } from '../services/fileupload.service';
import { FriendService } from '../services/friend.service';
import { Post } from '../models/post.model';
import { Like } from '../models/like.model';

@Injectable({
  providedIn: 'root'
})
export class PostHelperService {

  constructor(private utility: UtilityService,
    private postService: PostService,
    private fileService: FileUploadService,
    private friendService: FriendService) { }

  calculatePostTimers(filteredPosts: any): Post[] {
    filteredPosts.forEach(element => {
      element.postTimer = this.utility.dateDifference(element.createdDate);
    });

    return filteredPosts.reverse();
  }

  assignLikesToPost(userId: String, filteredPosts: any, likeArray: Like[]): Post[] {
    filteredPosts.forEach(postElement => {
      postElement.isMyPost = postElement.userId === userId ? true : false;
      let matchFound = _.find(likeArray, function (like) {
        return like.postId === postElement._id && like.userId === userId
      });

      if (matchFound && matchFound.isLiked) {
        postElement.isLiked = matchFound.isLiked;
      } else {
        postElement.isLiked = false;
      }
    });

    return filteredPosts;
  }

  private createImageFromBlob(image: Blob): Observable<any> {
    return new Observable(observer => {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        let imageToShow = reader.result;
        observer.next(imageToShow);
      }, false);

      if (image) {
        reader.readAsDataURL(image);
      }
    })
  }

  private loadPostedUserIcons(filteredPosts: any): Observable<any> {
    return new Observable(observer => {
      filteredPosts.forEach(postElement => {
        this.fileService.getPhotoById(postElement.userPhotoId).subscribe(res => {
          this.createImageFromBlob(res).subscribe(response => {
            postElement.userIcon = response;
            observer.next(filteredPosts);
          })
        }, err => {
          throw err;
        });
      });
    });
  }

  private loadPostImages(mappedPosts: any): Observable<any> {
    return new Observable(observer => {
      mappedPosts.forEach(postElement => {
        if (postElement.postImageId) {
          postElement.isPostImage = true;
          this.fileService.getPhotoById(postElement.postImageId).subscribe(res => {
            this.createImageFromBlob(res).subscribe(response => {
              postElement.postImage = response;
              observer.next(mappedPosts);
            });
          });
        } else {
          postElement.isPostImage = false;
          observer.next(mappedPosts);
        }
      });
    });
  }

  loadOnlyMyFriendsPost(userId, posts): Observable<any> {
    let filteredPosts = [];
    return new Observable(observer => {
      this.friendService.getAllFriendRequests().subscribe(friendList => {
        friendList = _.filter(friendList, function (item) {
          return ((item.userId === userId || item.friendId === userId) && item.status === 'You are friend');
        });

        posts.forEach(postElement => {
          if (postElement.userId === userId || postElement.isAdmin) {
            filteredPosts.push(postElement);
            return;
          }

          let isMyFriend = _.find(friendList, function (item) {
            return item.userId === postElement.userId || item.friendId === postElement.userId;
          });

          if (isMyFriend) {
            filteredPosts.push(postElement);
          }
        });
        observer.next(filteredPosts);
      });
    });
  }

  loadPosts(userId, isAdmin, likes): Observable<any> {
    
    return new Observable(observer => {
      this.postService.getAllPosts().subscribe(posts => {
        if (posts.length === 0) {
          observer.next(posts);
        }

        let activePosts = _.filter(posts, function (post) { return post.isActive === true; });
        if (isAdmin) {
          let postsForAdmin = this.calculatePostTimers(activePosts);
          postsForAdmin = this.assignLikesToPost(userId, activePosts, likes);
          this.loadPostedUserIcons(postsForAdmin).subscribe(mappedPosts => {
            this.loadPostImages(mappedPosts).subscribe(finalPosts => {
              observer.next(finalPosts);
            });
          });
          return;
        }

        this.loadOnlyMyFriendsPost(userId, activePosts).subscribe(filteredPosts => {
          if (filteredPosts.length === 0) {
            observer.next(filteredPosts);
          }
          filteredPosts = this.calculatePostTimers(filteredPosts);
          filteredPosts = this.assignLikesToPost(userId, filteredPosts, likes);
          this.loadPostedUserIcons(filteredPosts).subscribe(mappedPosts => {
            this.loadPostImages(mappedPosts).subscribe(finalPosts => {
              observer.next(finalPosts);
            });
          });
        });
      });
    });
  }

  createImagePost(formObject: Post, uploadId: string): Observable<any> {
    return new Observable(observer => {
      const postObject = {
        id: formObject.id,
        post: '',
        userId: formObject.userId,
        userName: formObject.userName,
        userPhotoId: formObject.userPhotoId,
        postImageId: uploadId,
        likes: formObject.likes,
        isActive: true,
        isAdmin: formObject.isAdmin,
        profession: formObject.profession
      };

      this.postService.createPost(postObject).subscribe(() => {
        observer.next();
      });
    });
  }

  performImageUploading(imageEvent): Observable<any> {
    return new Observable(observer => {
      if (imageEvent.target.files.length > 0) {
        const file = imageEvent.target.files[0];
        const formData = new FormData();
        formData.append('picture', file);
        this.fileService.uploadImage(formData).subscribe(uploadResult => {
          observer.next(uploadResult);
        });
      }
    });
  }

  uploadPostImage(formObject, imageEvent): Observable<any> {
    return new Observable(observer => {
      this.performImageUploading(imageEvent).subscribe(uploadResult => {
        this.createImagePost(formObject, uploadResult.uploadId).subscribe(() => {
          observer.next(uploadResult);
        });
      });
    });
  }
}

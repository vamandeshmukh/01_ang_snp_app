import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';

import { Post } from '../../../models/post.model';
import { Like } from '../../../models/like.model';
import { PostService } from '../../../services/post.service';
import { LikeService } from '../../../services/like.service';
import { PostHelperService } from '../../../utilities/post-helper.service';
import { ProfileHelperService } from '../../../utilities/profile-helper.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent extends BaseComponent implements OnInit {
  posts: Post[] = [];
  likes: Like[] = [];
  activeUserObject: any;
  existingPhotoId: String;
  form: FormGroup;
  isLoading: Boolean = true;
  noPosts: Boolean;

  constructor(private formBuilder: FormBuilder, private postService: PostService, private likeService: LikeService,
    private toastService: ToastrService, private postHelper: PostHelperService, private profileHelper: ProfileHelperService) {
    super();
    this.activeUserObject = JSON.parse(localStorage.getItem('currentUser'));
    this.profileHelper.currentMessage.subscribe(isReloadPage => {
      if (isReloadPage) {
        this.ngOnInit()
      }
    });
  }

  ngOnInit() {
    this.existingPhotoId = localStorage.getItem('currentUserPhotoId');
    this.createForm();
    this.loadPosts();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      id: [''],
      post: ['', Validators.required],
      userId: [this.activeUserObject._id],
      userPhotoId: [this.existingPhotoId],
      userName: [this.activeUserObject.firstName + ' ' + this.activeUserObject.lastName],
      isAdmin: [this.activeUserObject.isAdmin],
      profession: [this.activeUserObject.profession],
      likes: [0]
    });
  }

  private loadPosts() {
    this.likeService.getAllLikes().pipe(takeUntil(this.unsubscribe)).subscribe(likes => {
      this.likes = likes;
      this.postHelper.loadPosts(this.activeUserObject._id, this.activeUserObject.isAdmin, likes)
        .pipe(takeUntil(this.unsubscribe)).subscribe(finalPosts => {
          this.noPosts = finalPosts.length <= 0 ? true : false;
          this.isLoading = false;
          this.posts = finalPosts;
        });
    });
  }

  onSubmit() {
    this.postService.createPost(this.form.value).subscribe(() => {
      this.createForm();
      this.loadPosts();
    },
      err => {
        this.toastService.error("Invalid Post");
        throw err;
      });
  }

  onLikeClick(postLiked: any) {
    postLiked.likes = postLiked.likes + 1;
    this.postService.updatePost(postLiked).subscribe(() => {
      let likeObject = {
        id: '',
        postId: postLiked._id,
        userId: this.activeUserObject._id,
        isLiked: true
      };

      this.likeService.createLike(likeObject).subscribe(() => {
        this.loadPosts();
      },
        err => {
          this.toastService.error("Invalid LIke");
          throw err;
        });
    })
  }

  onHideClick(postToHide: Post) {
    postToHide.isActive = false;
    this.postService.updatePost(postToHide).subscribe(() => {
      this.loadPosts();
    });
  }

  onPostImageUpload(event) {
    let formObject = {
      id: '',
      userId: this.activeUserObject._id,
      userPhotoId: this.existingPhotoId,
      userName: this.activeUserObject.firstName + ' ' + this.activeUserObject.lastName,
      isAdmin: this.activeUserObject.isAdmin,
      profession: this.activeUserObject.profession,
      likes: 0
    };

    this.postHelper.uploadPostImage(formObject, event).subscribe(() => {
      this.ngOnInit();
    })
  }
}

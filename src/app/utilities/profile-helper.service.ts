import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { FileUploadService } from '../services/fileupload.service';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileHelperService {
  private messageSource = new BehaviorSubject(false);
  currentMessage = this.messageSource.asObservable();

  constructor(private fileService: FileUploadService, private postService: PostService, private userService: UserService) { }

  updatePostPhotoId(userId, photoId): Observable<any> {
    return this.postService.updateBulkPosts({ userId: userId, photoId: photoId });
  }

  updateUserPhotoId(userId, photoId): Observable<any> {
    return this.userService.updateUserPhoto({ id: userId, photoId: photoId });
  }

  performPhotoUpdate(event): Observable<any> {
    return new Observable(observer => {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('picture', file);
        this.fileService.uploadImage(formData).subscribe(uploadResult => {
          observer.next(uploadResult);
        });
      }
    });
  }

  changeActiveUserPhoto(userId, event): Observable<any> {
    return new Observable(observer => {
      this.performPhotoUpdate(event).subscribe(uploadResult => {
        this.updateUserPhotoId(userId, uploadResult.uploadId).subscribe(() => {
          this.updatePostPhotoId(userId, uploadResult.uploadId).subscribe(() => {
            observer.next(uploadResult.uploadId);
            this.messageSource.next(true);
          });
        });
      });
    });
  }
}

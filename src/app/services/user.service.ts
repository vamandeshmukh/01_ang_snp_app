import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { User } from '../models/user.model';
import { HeaderService } from './header.service';
import { AppConfig } from '../config/app.config';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    apiBaseURL = AppConfig.settings.apiServer.baseURL;

    constructor(private http: HttpClient, private header: HeaderService, private toastService: ToastrService) { }

    register(newUser: User): any {
        return this.http.post<User>(this.apiBaseURL + 'users/register', newUser, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    }

    getUsers() {
        return this.http.get<User[]>(this.apiBaseURL + 'users/').pipe(res => {
            return res;
        });
    }

    getUserById(userId): any {
        return this.http.get(this.apiBaseURL + 'users/' + userId).pipe(res => {
            return res;
        });
    };

    getUserByEmail(email): any {
        return this.http.post(this.apiBaseURL + 'users/finduserbyemail', { email: email }, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    };

    updateUserPhoto(updatedUser) {
        return this.http.post(this.apiBaseURL + 'users/updateuserphotoId', updatedUser, this.header.requestHeaders()).pipe(res => {
            this.toastService.success('Image Uploaded Successfully');
            return res;
        });
    };

    updateUser(updatedUser: any) {
        return this.http.put(this.apiBaseURL + 'users/' + updatedUser.id, updatedUser).pipe(res => {
            return res;
        });
    };

    deleteUser(deleteUser: User) {
        return this.http.delete(this.apiBaseURL + 'users/' + deleteUser.id)
            .subscribe(res => {
                this.toastService.success('User Deleted Successfully');
                return res;
            }, error => {
                this.toastService.error(JSON.stringify(error.error.message));
                throw error;
            });
    };
}

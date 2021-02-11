import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Like } from '../models/like.model';
import { HeaderService } from './header.service';
import { AppConfig } from '../config/app.config';

@Injectable({
    providedIn: 'root'
})
export class LikeService {

    apiBaseURL = AppConfig.settings.apiServer.baseURL;

    constructor(private http: HttpClient, private header: HeaderService) { }

    createLike(newLike: Like) {
        return this.http.post<Like>(this.apiBaseURL + 'likes/createlike', newLike, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    }

    getAllLikes(): any {
        return this.http.get(this.apiBaseURL + 'likes/');
    }

    getLikeById(likeId): any {
        return this.http.get(this.apiBaseURL + 'likes/' + likeId).pipe(res => {
            return res;
        });
    };
}

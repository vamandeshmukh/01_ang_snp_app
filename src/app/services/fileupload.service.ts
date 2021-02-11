import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfig } from '../config/app.config';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {
    apiBaseURL = AppConfig.settings.apiServer.baseURL;

    constructor(private http: HttpClient) { }

    uploadImage(formData: FormData) {
        return this.http.post<any>(this.apiBaseURL + 'files/uploadfile', formData).pipe(res => {
            return res;
        });
    }

    getPhotoById(photoId) {
        return this.http.get(this.apiBaseURL + 'files/' + photoId, { responseType: "blob" }).pipe(res => {
            return res;
        });
    }
}

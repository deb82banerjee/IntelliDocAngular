import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UploadService {
    baseUrl = '';
    constructor(private http: HttpClient) {
        this.http.get('/assets/endpoint.json').toPromise().then((resp: any) => {
            // base endpoint for upload
            this.baseUrl = resp.endpoint;
        });
    }
    test() {
        return this.http.get('/assets/endpoint.json').toPromise()
    }
    upload(file: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();
        let queryStr = new HttpParams();
        queryStr = queryStr.append('userId', 'testUser1');
        formData.append('file', file);
        const req = new HttpRequest('POST', `${this.baseUrl}/idp/upload`, formData, {
            reportProgress: true,
            responseType: 'json',
            params: queryStr
        });
        return this.http.request(req);
    }
    process(): Promise<any> {
        let queryStr = new HttpParams();
        queryStr = queryStr.append('userId', 'testUser1');
        const req = new HttpRequest('GET', `${this.baseUrl}/idp/processFiles`, {
            responseType: 'json',
            params: queryStr
        });
        return this.http.request(req).toPromise();
    }
}
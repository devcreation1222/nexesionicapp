import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environments } from '../app/app.config';

@Injectable()
export class ProfileService {
    baseUrl = environments.apiUrl + '/v1';

    constructor(private http: Http) {}

    getData(userId: string, authToken: string) {    
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Auth-Token', authToken);
        headers.append('X-User-Id', userId);
    
        return this.http.get(this.baseUrl + '/me', {headers: headers}).map(response => response.json());
    }

    getLocations(userId, authToken) {  
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Auth-Token', authToken);
        headers.append('X-User-Id', userId);

        return this.http.get(this.baseUrl + '/locations', {headers: headers}).map(response => response.json());
    }
}
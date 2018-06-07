import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environments } from '../app/app.config';

@Injectable()
export class ClassService {
    baseUrl = environments.apiUrl + '/v1/classes';

    constructor (private http: Http) {}

    getPending(userId, authToken) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Auth-Token', authToken);
        headers.append('X-User-Id', userId);

        return this.http.get(this.baseUrl + '/pending', {headers: headers}).map(response => response.json());
    }

    getAll(userId, authToken, from, to) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Auth-Token', authToken);
        headers.append('X-User-Id', userId);

        return this.http.get(this.baseUrl + '?from=' + from + '&until=' + to, {headers: headers}).map(response => response.json());
    }

    getMySchedule(userId, authToken, from, to) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Auth-Token', authToken);
        headers.append('X-User-Id', userId);

        return this.http.get(this.baseUrl + '/scheduled?from=' + from + '&until=' + to, {headers: headers}).map(response => response.json());
    }

    getDetailSchedule(userId, authToken, id, selectedDate) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Auth-Token', authToken);
        headers.append('X-User-Id', userId);

        return this.http.get(this.baseUrl + '/' + id + '?date=' + selectedDate, {headers: headers}).map(response => response.json());
    }

    cancelSchedule(userId, authToken, id, date) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Auth-Token', authToken);
        headers.append('X-User-Id', userId);

        let body = {"date": date};

        return this.http.post(this.baseUrl + '/' + id + '/cancel', body, {headers: headers}).map(response => response.json());
    }

    scheduleClass(userId, authToken, id, date) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Auth-Token', authToken);
        headers.append('X-User-Id', userId);

        let body = {"date": date};

        return this.http.post(this.baseUrl + '/' + id + '/schedule', body, {headers: headers}).map(response => response);
    }
}

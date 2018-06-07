import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs';
import 'rxjs/add/operator/catch';
import { environments } from '../app/app.config';

export class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

@Injectable()
export class AuthService {
  baseUrl = environments.apiUrl + '/v1/login';
  currentUser: User;

  constructor(private http: Http) { }

  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.append('user', credentials.email);
      urlSearchParams.append('password', credentials.password);
      let body = urlSearchParams.toString();

      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

      return this.http.post(this.baseUrl, body, {headers: headers}).timeout(3000).delay(10).map(response => response.json());
    }
  }

  public reset(email) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let body = {"email": email};

    return this.http.post(environments.apiUrl  + '/v1/forgot-password', body, {headers: headers}).map(response => response);
  }

  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }
}

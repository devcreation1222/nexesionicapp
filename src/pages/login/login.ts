import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, MenuController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { TranslateService } from "ng2-translate";

import { SchedulePage } from '../../pages/schedule/schedule';
import { ResetPage } from '../../pages/reset/reset';

const EMAIL_STORAGE_KEY = 'storage.email';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  registerCredentials = { email: '', password: '' };
  waitMessageText = 'Please wait...';
  OkButtonText =  'OK';
  failTitleText = 'Fail';
  failedLoginText = '';
  operationErrorMessage = '';
  operationFailedMessage = '';

  constructor(private nav: NavController,
              private auth: AuthService,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private menuCtrl: MenuController,
              private events: Events,
              private storage: Storage,
              private translate: TranslateService
            )
  {
    storage.get(EMAIL_STORAGE_KEY).then((value) => {
      if (value) {
        this.registerCredentials.email = value;
      }
    });

    this.translate.get(['PLEASE_WAIT',
      'OK',
      'LOGIN_FAILED_TITLE',
      'LOGIN_FAILED_MESSAGE',
      'GENERIC_OPERATION_ERROR_MESSAGE',
      'GENERIC_OPERATION_FAILED_MESSAGE'])
      .toPromise().then(value => {
      if (value) {
        this.waitMessageText = value.PLEASE_WAIT;
        this.OkButtonText = value.OK;
        this.failTitleText = value.LOGIN_FAILED_TITLE;
        this.failedLoginText = value.LOGIN_FAILED_MESSAGE;
        this.operationErrorMessage = value.GENERIC_OPERATION_ERROR_MESSAGE;
        this.operationFailedMessage = value.GENERIC_OPERATION_FAILED_MESSAGE;
      }
    });

  }

  public resetPassword() {
    this.nav.push(ResetPage);
  }

  public login(credentials: any) {
    this.showLoading();
    this.auth.login(credentials)
      .subscribe((response) => {
          if (response) {
            localStorage.setItem('authToken', response.data.authToken);
            localStorage.setItem('userId', response.data.userId);
            this.nav.setRoot(SchedulePage);
            console.log(response.data.authToken);
            console.log(response.data.userId);
            this.events.publish('menu:created');
            if (credentials.email) {
              this.storage.set(EMAIL_STORAGE_KEY, credentials.email);
            }

          }
        },
        (error) => {
          const genericErrorMsg = this.operationErrorMessage;
          const operationFailedMsg = this.operationFailedMessage;
          if (error.status === 0 || error.status === 500) {
            console.error(error);
            this.showError(genericErrorMsg);
            //this.showError("It was not possible to connect to the server");
          }
          else if (error.status >= 400) {
            console.log(error);
            this.showError(operationFailedMsg);
          }
          else  {
            console.log(error);
            this.showError(operationFailedMsg);
          }

        });
    }

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: this.waitMessageText,
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: this.failTitleText,
      subTitle: this.failedLoginText,
      buttons: [this.OkButtonText]
    });
    alert.present();
  }
}

import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, MenuController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { Injector } from '@angular/core';

import { TranslateService } from "ng2-translate";
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-reset',
  templateUrl: 'reset.html',
})

export class ResetPage {

  loading: Loading;

  credentials = { email: ''};
  waitMessageText = 'Please wait...';
  OkButtonText =  'OK';
  failTitleText = 'Fail';
  failedLoginText = '';
  operationErrorMessage = '';
  operationFailedMessage = '';
  resetSuccessText = '';
  //loginPage: LoginPage;

  constructor(private nav: NavController,
              private auth: AuthService,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private menuCtrl: MenuController,
              private events: Events,
              private storage: Storage,
              private translate: TranslateService,
              private injector: Injector
            )
  {
    //this.loginPage = this.injector.get(LoginPage);


    this.translate.get(['PLEASE_WAIT',
      'OK',
      'GENERIC_OPERATION_ERROR_MESSAGE',
      'GENERIC_OPERATION_FAILED_MESSAGE',
      'RESET_SUCCESS'])
      .toPromise().then(value => {
      if (value) {
        this.waitMessageText = value.PLEASE_WAIT;
        this.OkButtonText = value.OK;
        this.operationErrorMessage = value.GENERIC_OPERATION_ERROR_MESSAGE;
        this.operationFailedMessage = value.GENERIC_OPERATION_FAILED_MESSAGE;
        this.resetSuccessText = value.RESET_SUCCESS;
      }
    });

  }

  public back() {
    this.nav.setRoot(LoginPage);
  }

  public reset(credentials: any) {
    this.showLoading();
    this.auth.reset(credentials)
    .subscribe((response) => {
        if (response) {
          this.loading.dismiss();

          let alert = this.alertCtrl.create({
            title: '',
            subTitle: this.resetSuccessText,
            buttons: [this.OkButtonText]
          });
          alert.present();
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
          this.showError(genericErrorMsg);
        }
        else  {
          console.log(error);
          this.showError(genericErrorMsg);
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

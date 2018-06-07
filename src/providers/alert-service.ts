import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';

@Injectable()
export class AlertService {

  yes = '';
  no = '';
  fail = '';
  ok = '';

    constructor(public alertCtrl: AlertController,
      private translate: TranslateService,
    ) {
      this.translate.get(['YES',
      'NO',
      'FAIL',
      'OK'])
      .toPromise().then(value => {
        this.yes = value.YES;
        this.no = value.NO;
        this.fail = value.FAIL;
        this.ok = value.OK;
      });

    }

    promptAlert(message: string) {
        let alert = this.alertCtrl.create({
            title: message,
            buttons: [
                {
                    text: this.yes,
                    handler: () => {
                        alert.dismiss(true);
                        return false;
                    }
                }, {
                    text: this.no,
                    handler: () => {
                        alert.dismiss(false);
                        return false;
                    }
                }
            ]
        });

        return alert;
    }

    showSuccess(message: string) {
        let alert = this.alertCtrl.create({
            title: message,
            buttons: [this.ok]
        });

        return alert;
    }

    showError(message) {
        let alert = this.alertCtrl.create({
          title: this.fail,
          subTitle: message,
          buttons: [this.ok]
        });

        return alert;
      }
}

import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { ConferenceData } from '../../providers/conference-data';
import { NetworkService } from '../../providers/network-service';
import { SpeakerDetailPage } from '../../pages/speaker-detail/speaker-detail';
import { ClassService } from '../../providers/class-service';
import { AlertService } from '../../providers/alert-service';
import { SchedulePage } from '../schedule/schedule';
import * as moment from 'moment/moment';
import {TranslateService} from "ng2-translate";

@Component({
  selector: 'page-session',
  templateUrl: 'session.html'
})
//Session: Show details of a specific session
export class SessionPage {

  session: any = {};
  date: string;
  speakerDetailPage: any;
  favorities: false;
  mySchedule: any = {};
  online: boolean;
  userId = localStorage.getItem('userId');
  authToken = localStorage.getItem('authToken');
  pending = 0;
  areYouSureMessage = '';
  cancelSuccessMessage = '';
  operationErrorMessage = '';
  operationFailedMessage = '';
  bookedMessage = '';
  waitingListMessage = '';
  cancel_class = '';
  book_class = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public conferenceService: ConferenceData,
    public networkService: NetworkService,
    public classService: ClassService,
    public alertService: AlertService,
    private translate: TranslateService,
    private events: Events)
  {

    this.speakerDetailPage = SpeakerDetailPage;

    //get the parameters
    this.session = this.navParams.get('session');
    this.date = this.navParams.get('date');
    this.translate.get(['ARE_YOU_SURE_QUESTION',
      'CLASS_CANCELATION_SUCCESS_MESSAGE',
      'GENERIC_OPERATION_ERROR_MESSAGE',
      'GENERIC_OPERATION_FAILED_MESSAGE',
      'BOOKED_MESSAGE',
      'WAITING_LIST_MESSAGE',
      'CANCEL_CLASS',
      'BOOK_CLASS'])
      .toPromise().then(value => {
        this.areYouSureMessage = value.ARE_YOU_SURE_QUESTION;
        this.cancelSuccessMessage = value.CLASS_CANCELATION_SUCCESS_MESSAGE;
        this.operationErrorMessage = value.GENERIC_OPERATION_ERROR_MESSAGE;
        this.operationFailedMessage = value.GENERIC_OPERATION_FAILED_MESSAGE;
        this.bookedMessage = value.BOOKED_MESSAGE;
        this.waitingListMessage = value.WAITING_LIST_MESSAGE;
        this.cancel_class = value.CANCEL_CLASS;
        this.book_class = value.BOOK_CLASS;
      });
      this.pending = parseInt(localStorage.getItem('pending'));
  }
  //add session to my schedule
  toggleMySchedule(event, session) {
    let date = moment(this.date).format('YYYY-MM-DD');
    if (session.isScheduled) {
      let alert = this.alertService.promptAlert(this.areYouSureMessage);
      alert.present();
      alert.onDidDismiss((data) => {
        if (data) {
          this.classService.cancelSchedule(this.userId, this.authToken, session._id, date)
              .subscribe((response) => {
                if (response) {
                  //if (response.statusCode === 200) {
                    this.events.publish('menu:opened', '');

                    let success = this.alertService.showSuccess(this.cancelSuccessMessage);
                    success.present();
                  //}
                }
              }, (error) => {
                const genericErrorMsg = this.operationErrorMessage;
                const operationFailedMsg = this.operationFailedMessage;

                if (error.status === 500) {

                  console.error(error);
                  let fail = this.alertService.showError(genericErrorMsg);
                  fail.present();
                }
                else if (error.status >= 400) {
                  console.log(error);
                  let fail = this.alertService.showError(operationFailedMsg);
                  fail.present();
                }
                else {
                  console.log(error);
                  let fail = this.alertService.showError(operationFailedMsg);
                  fail.present();
                }

              });
        }
      })
    } else {
      this.classService.scheduleClass(this.userId, this.authToken, session._id, date)
          .subscribe((response) => {
            if (response) {
              if (response.status === 200) {
                let data = response.json().data;
                let msg = this.bookedMessage;
                if (data.waiting){
                  msg = this.waitingListMessage;
                }
                this.events.publish('menu:opened', '');

                let success = this.alertService.showSuccess(msg);
                success.present();
              } else if (response.status === 409) {
                let fail = this.alertService.showError("No pending days");
                fail.present();
              }
            }
          }, (error) => {
            if (error.status === 500) {
              let fail = this.alertService.showError(error.statusText);
              fail.present();
            } else if (error.status === 400) {
              let fail = this.alertService.showError(error.statusText);
              fail.present();
            } else if (error.status === 401) {
              let fail = this.alertService.showError(error.statusText);
              fail.present();
            } else if (error.status === 409) {
              let fail = this.alertService.showError(error.statusText);
              fail.present();
            } else if (error.status === 406) {
              let fail = this.alertService.showError(error.statusText);
              fail.present();
            } else if (error.status === 404) {
              let fail = this.alertService.showError(error.statusText);
              fail.present();
            }
          })
    }
    event.stopPropagation();
  }

  //just before entering the view, check if the device is online
  //and don't show images if offline
  ionViewWillEnter() {
    this.online = this.networkService.isOnline();
  }

}

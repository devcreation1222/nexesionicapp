import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConferenceData } from '../../providers/conference-data';
import { NetworkService } from '../../providers/network-service';
import { ProfileService } from '../../providers/profile-service';
import { AlertService } from '../../providers/alert-service';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
//ProfileDetail: Show details of a specific user
export class ProfilePage {

  profile: any = {};
  sessionList: any = [];
  sessions: any = [];
  mySchedule: any = {};
  favorities: false;
  online: boolean;
  userId = localStorage.getItem('userId');
  authToken = localStorage.getItem('authToken');

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public conferenceService: ConferenceData,
    public networkService: NetworkService,
    public profileService: ProfileService,
    public alertService: AlertService
  ) {
    // get profile data
    this.profileService.getData(this.userId, this.authToken)
        .subscribe((response) => {
          if (response) {
            //if (response.statusCode == 200) {
              this.profile = response.data;
           //}
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

  //add session to my schedule
  toggleMySchedule(event, session) {
    this.conferenceService.toggleSession(session.id).then((schedule) => {
      this.mySchedule = schedule ? schedule : {};
    });
    event.stopPropagation();
  }

  //just before entering the view, check if the device is online
  //and don't show images if offline
  ionViewWillEnter() {
    this.online = this.networkService.isOnline();
  }
}

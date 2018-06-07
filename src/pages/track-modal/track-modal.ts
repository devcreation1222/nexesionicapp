import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ConferenceData } from '../../providers/conference-data';
import { ProfileService } from '../../providers/profile-service';
import { AlertService } from '../../providers/alert-service';

@Component({
  selector: 'page-track-modal',
  templateUrl: 'track-modal.html'
})
//Track: Display the list of tracks and
//filter the schedule based on the tracks choosen
export class TrackModalPage {

  tracks = [];
  userId = localStorage.getItem('userId');
  authToken = localStorage.getItem('authToken');

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public conferenceService: ConferenceData,
    public profileService: ProfileService,
    public alertService: AlertService
  ) {
      this.profileService.getLocations(this.userId, this.authToken)
          .subscribe(response => {
            if (response) {
                this.tracks = response.data;
                this.tracks.forEach((track: any) => {
                  track.show = track.selected;
                });
            }
          }, error => {
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

  closeModal() {
    this.viewCtrl.dismiss();
  }

  ionViewWillEnter() {
    // this.tracks = this.conferenceService.getTracks();
  }

  //filter the conference schedule based on the track
  filter() {
    // this.conferenceService.setTracks(this.tracks);
    this.viewCtrl.dismiss(this.tracks);
  }

}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConferenceData } from '../../providers/conference-data';
import { NetworkService } from '../../providers/network-service';
import { ProfileService } from '../../providers/profile-service';
import { AlertService } from '../../providers/alert-service';
declare var google: any;

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})

//About: Shows the location in google maps,
//along with the location
export class AboutPage {

  conference: any = { date: {} };
  locations: any = {};
  activeLocation: any = {};
  online: boolean;
  hide: boolean = false;
  authToken = localStorage.getItem('authToken');
  userId = localStorage.getItem('userId');

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public conferenceService: ConferenceData,
    public networkService: NetworkService,
    public profileService: ProfileService,
    public alertService: AlertService
  ) {
    this.profileService.getLocations(this.userId, this.authToken)
        .subscribe((response) => {
          //if (response.statusCode == 200) {
            if (response.data) {
              this.locations = response.data;
              console.log(this.locations);
              this.activeLocation = this.locations[0];
              this.loadMap(this.activeLocation);
            } else {
              this.hide = true;
            }
          //}
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
        });
  }

  ionViewDidLoad() {

  }

  buttonLeftClick() {
    if (this.locations) {
      this.locations.forEach((location, i) => {
        if (location._id === this.activeLocation._id) {
          if (i === 0) {
            this.activeLocation = this.locations[this.locations.length - 1];
            this.loadMap(this.activeLocation);
          } else {
            this.activeLocation = this.locations[i-1];
            this.loadMap(this.activeLocation);
          }
        }
      });
    }
  }

  buttonRightClick() {
    if (this.locations) {
      let k = 0;
      this.locations.forEach((location, i) => {
        if (location._id === this.activeLocation._id) {
          if (i === (this.locations.length - 1)) {
            k = 0;
          } else {
            k = i + 1;
          }
        }
      });
      this.activeLocation = this.locations[k];
      this.loadMap(this.activeLocation);
    }
  }

  //initialize google maps at element #map
  //and center at the given location
  loadMap(location) {
    this.online = this.networkService.isOnline();
    if (this.online) {
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: location,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      var marker = new google.maps.Marker({
        position: location,
        map: map
      });

      marker.setMap(map);

    }
  }
}

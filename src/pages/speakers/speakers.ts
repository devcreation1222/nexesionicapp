import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConferenceData } from '../../providers/conference-data';
import { NetworkService } from '../../providers/network-service';
import { SpeakerDetailPage } from '../../pages/speaker-detail/speaker-detail';

@Component({
  selector: 'page-speakers',
  templateUrl: 'speakers.html'
})
//Speaker: Display the list of speakers
export class SpeakersPage {

  speakers: any;
  speakerDetailPage: any;
  online: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public conferenceService: ConferenceData,
    public networkService: NetworkService) {

    this.speakerDetailPage = SpeakerDetailPage;

    //get speakers
    this.conferenceService.getConferenceData().then(data => {
      if (data) {
        this.speakers = data.speakers;
      }
    });

  }
  
  //just before entering the view, check if the device is online
  //and don't show images if offline
  ionViewWillEnter() {
    this.online = this.networkService.isOnline();
  }
}

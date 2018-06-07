import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConferenceData } from '../../providers/conference-data';
import { NetworkService } from '../../providers/network-service';

@Component({
  selector: 'page-speaker-detail',
  templateUrl: 'speaker-detail.html'
})
//SpeakerDetail: Show details of a specific speaker
export class SpeakerDetailPage {

  speaker: any = {};
  sessionList: any = [];
  sessions: any = [];
  mySchedule: any = {};
  favorities: false;
  online: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public conferenceService: ConferenceData,
    public networkService: NetworkService) {

    //get the parameters
    this.speaker = this.navParams.get('speaker');
    this.conferenceService.getFavorites().then((schedule) => {
      this.mySchedule = schedule ? schedule : {};
    });
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

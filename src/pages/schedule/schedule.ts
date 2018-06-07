import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, AlertController } from 'ionic-angular';
import { ConferenceData } from '../../providers/conference-data';
import { SessionPage } from '../../pages/session/session';
import { TrackModalPage } from '../../pages/track-modal/track-modal';
import { ProfileService } from '../../providers/profile-service';

import * as moment from 'moment/moment';
import "moment/locale/es";
import "moment/locale/ca";

import 'moment-timezone';

import { GlobalProvider } from '../../providers/global';
import { ClassService } from '../../providers/class-service';
import {TranslateService} from "ng2-translate";

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})

//Schedule: Displays the complete schedule.
//The talks are grouped by date. Talks can be added to My Schedule.
export class SchedulePage {

  tracks = [];
  conference: any;
  orSlots: any = [];
  slots: any = [];
  days: any = [];
  date: string;
  month: string;
  sessionPage: any;
  selectedDay: any = 0;
  favorites: any = {};
  showMySchedule: false;
  title: string = "Programar";
  loading: any;
  noSessions: boolean;
  selectedMonth: string;
  selectedYear: string;

  private keyday;
  private curDate;
  private Days;
  public from;
  public to;
  authToken = localStorage.getItem('authToken');
  userId = localStorage.getItem('userId');

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loadingController: LoadingController,
    public conferenceService: ConferenceData,
    public global: GlobalProvider,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public classService: ClassService,
    public profileService: ProfileService,
    public translate : TranslateService
  ){
    this.sessionPage = SessionPage;
    this.curDate = new Date();
    this.Days = [
      {name:"Monday",date : new Date()},
      {name:"Tuesday",date : new Date()},
      {name:"Wednesday",date : new Date()},
      {name:"Thursday",date : new Date()},
      {name:"Friday",date : new Date()},
      {name:"Saturday",date : new Date()},
      {name:"Sunday",date : new Date()},
    ];
    let tplDays = this.global.getDaysCurrentOfWeed(new Date());

    this.from = moment(tplDays[0]).format('YYYY-MM-DD');
    this.to = moment(tplDays[tplDays.length - 1]).format('YYYY-MM-DD');

    for(let i = 0; i< tplDays.length; ++i){
      this.Days[i].date = tplDays[i];
    }

    this.curDate = new Date();

    this.Days.forEach((day, i) => {
      if (moment(day.date).format('YYYY-MM-DD') === moment(this.curDate).format('YYYY-MM-DD')) {
        this.selectedDay = i;
      }
    });

    this.keyday = this.global.getNameDayOfWeek(this.curDate);

    this.days = [];

    moment.locale(this.translate.currentLang);

    let newMoment = moment(new Date());

    this.selectedMonth = newMoment.format('MMM');
    this.selectedYear = newMoment.format('YYYY');

    this.getTracks();

  }

  ionViewWillEnter() {
    //get the parameters
    this.showMySchedule = this.navParams.get('favorites');
    this.loadSchedule();
  }


  private LoadDays(){
    for(let i = 0; i< this.Days.length; ++i){
      this.days[i] = this.Days[i].date.getDate();
      if(this.curDate.getDate() == this.days[i] )  {
        this.selectedDay = i;
      }
    }
  }

  loadSchedule() {

    this.loading = this.loadingCtrl.create({
      content: 'loading...'
    });

    this.loading.present();

    //Show the user's schedule if the parameter 'favorites' is set to true
    //Otherwise, it displays the complete schedule
    if (this.showMySchedule) {
      //user's schedule
      this.translate.get('MY_SCHEDULE').toPromise().then(value => { this.title = value });
      //this.title = "MI HORARIO";
      this.curDate = this.Days[this.selectedDay].date;
      let scheduleDate = moment(this.curDate).format('YYYY-MM-DD');
      this.classService.getMySchedule(this.userId, this.authToken,  this.from, this.to)
          .subscribe((response) => {
            if (response) {
              //if (response.statusCode == 200) {
                if (response.data){
                  this.slots = response.data;
                  this.orSlots= response.data;
                }
                this.showSchedule(response.data);

              //}
            }

          }, (error) => {
            if (error.status === 500) {
              this.showError(error.statusText);
            } else if (error.status === 400) {
              this.showError(error.statusText);
            } else if (error.status === 401) {
              this.showError(error.statusText);
            } else if (error.status === 409) {
              this.showError(error.statusText);
            } else if (error.status === 406) {
              this.showError(error.statusText);
            }
          });
    } else {
      //full schedule
      this.title = "Todas las clases";

      this.classService.getAll(this.userId, this.authToken, this.from, this.to)
          .subscribe((response) => {
            if (response) {
                            if (response.data){
                  this.slots = response.data;
                  this.orSlots= response.data;
                }
              this.showSchedule(response.data);
            }
          }, (error) => {
            if (error.status === 500) {
              this.showError(error.statusText);
            } else if (error.status === 400) {
              this.showError(error.statusText);
            } else if (error.status === 401) {
              this.showError(error.statusText);
            } else if (error.status === 409) {
              this.showError(error.statusText);
            } else if (error.status === 406) {
              this.showError(error.statusText);
            } else if (error.status === 404) {
              this.showError(error.statusText);
            }
          });
    }

    //get all of the user's favorites
    this.conferenceService.getFavorites().then((schedule) => {
      this.favorites = schedule ? schedule : {};
    });

  }

  //set the conference details and show the first day's schedule
  showSchedule(schedule) {
    this.conference = schedule;
    //get the first day's schedule

    //this.days = schedule.days;
    this.LoadDays();

    this.selectDay(this.selectedDay);
    this.loading.dismiss();
  }
  //show events from selected day
  selectDay(day) {
    this.selectedDay = day;

    this.curDate = this.Days[this.selectedDay].date;
    let selectedDate = moment(this.curDate).format('YYYY-MM-DD');

    let classes = [];
    let i = 0;
    if (this.conference) {
      this.conference.forEach(schedule => {
        let scheduleDate = moment(schedule.date).format('YYYY-MM-DD');
        if (selectedDate == scheduleDate) {
          classes[i] = schedule;
          i++;
        }
      });
    }
    this.slots = classes;
    this.orSlots = classes;
    if (this.tracks){
      this.filterScheduled(this.tracks);
    }
  }

  getTime(date: Date) {
    let time = moment(date).format('HH:mm');
    return time;
  }

  //add session to my schedule
  toggleMySchedule(event, session) {
    this.conferenceService.toggleSession(session._id).then((schedule) => {
      this.favorites = schedule ? schedule : {};
      if (this.showMySchedule) {
        this.conferenceService.getMySchedule().then((schedule) => {
          this.conference = schedule;
        });
      }

    });
    event.stopPropagation();
  }

  //get the latest information about conference from the server
  // refresh(refresher) {
  //   this.conferenceService.load('', 'event').then((data) => {
  //     this.loadSchedule();
  //     refresher.complete();
  //   });
  // }


  getTracks(){
    this.profileService.getLocations(this.userId, this.authToken)
    .subscribe(response => {
      if (response) {
          this.tracks = response.data;
          this.tracks.forEach((track: any) => {
            track.show = track.selected;
          });
          if (this.slots){
            this.filterScheduled(this.tracks);
          }
      }
    }, error => {
      if (error.status === 500) {
        this.showError(error.statusText);
      } else if (error.status === 400) {
        this.showError(error.statusText);
      } else if (error.status === 401) {
        this.showError(error.statusText);
      } else if (error.status === 409) {
        this.showError(error.statusText);
      } else if (error.status === 406) {
        this.showError(error.statusText);
      } else if (error.status === 404) {
        this.showError(error.statusText);
      }
    })
  }

  //open the modal to filter the schedule by tracks
  openTrackModal() {
    let trackModal = this.modalCtrl.create(TrackModalPage);
    this.loadSchedule();
    trackModal.onDidDismiss(filter => this.filterScheduled(filter));
    trackModal.present();
  }

  filterScheduled(filter=[]){
    if (this.showMySchedule) return;

    let i = 0;
    let trackedSchedule = [];
    this.orSlots.forEach((slot) => {
    filter.forEach((track: any) => {
      if (track.show && slot.location.name == track.name) {
            trackedSchedule[i] = slot;
            i++;
        }
      });
    });
    this.slots = trackedSchedule;
    this.tracks = filter;
  }

  buttonLeftClick(button){
    this.refreshCalendar(-7);
  }

  buttonRightClick(button){
    this.refreshCalendar(7);
  }

  refreshCalendar(offset){
    let l = this.curDate;
    l.setDate(l.getDate() + offset);

    let tplDays = this.global.getDaysCurrentOfWeed(new Date(l));
    for(let i = 0; i< tplDays.length; ++i){
      this.Days[i].date = tplDays[i];
    }
    this.curDate = tplDays[0];
    this.keyday = this.global.getNameDayOfWeek(this.curDate);
    //this.LoadDays();
    //this.selectDay(this.selectedDay);

    this.from = moment(tplDays[0]).format('YYYY-MM-DD');
    this.to = moment(tplDays[tplDays.length - 1]).format('YYYY-MM-DD');

    let newMoment = moment(l);
    newMoment.locale(false);

    this.selectedMonth = newMoment.format('MMM');
    this.selectedYear = newMoment.format('YYYY');

    this.loadSchedule();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
}

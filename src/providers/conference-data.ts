import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs';
import { Storage } from '@ionic/storage';
import { NetworkService } from '../providers/network-service';

@Injectable()
export class ConferenceData {

    //change the baseUrl to your own rest end point
    private baseUrl = "assets/data/sample.json";
    event: any;
    speakerMap: any = {};
    trackMap: any = {};
    sessionMap: any = {};
    mySchedule: any = {};
    trackFilter: any = {};


    constructor(public http: Http, private storage: Storage, public networkService: NetworkService) {

    }

    //get details of the conference
    getConferenceData(): Promise<any> {
        if (this.event) {
            //if the data is already loaded
            this.filter(this.event.schedule, null);
            return Promise.resolve(this.event);
        } else {
            //check in local storage
            // TODO: Change this to get the data from the server using the different endpoints
            return this.storage.get("event").then((event) => {
               /* if (event) {
                    //get data from local storage
                    this.event = this.process(event);
                    //this.filter(this.event.schedule, null);
                    return Promise.resolve(this.event);
                } else {*/
                    //get data from server
                    return this.load("", 'event');
                //}
            });
        }
    }

   getUserData(): Promise<any> {
        // Load user data from endpoint
        return this.load('', 'profile');

    }

    //get data from the server if connected
    load(endpoint: string, fireEvent: string): Promise<any> {
        console.log("Loading");
        if (this.networkService.isOnline()) {
            return new Promise(resolve => {
                this.http.get(this.baseUrl + endpoint)
                    .map(res => res.json())
                    .subscribe(data => {
                        this.event = this.process(data);
                        //store it locally
                        this.storage.set(fireEvent, this.event);
                        resolve(this.event);
                    });
            });
        } else {
            //show alert if not online
            this.networkService.showNetworkAlert();
            return Promise.resolve(undefined);
        }
    }

    //process the data so that's easy to access information easily
    process(event: any) {

        var sessionMap = {};
        var speakerMap = {};
        var trackMap = {};
        var date, time, slots, sessions, speakers;

        //get the days of the event
        event.days = this.getDays(event.date);

        //map speakers to ids
        event.speakers.forEach((speaker: any) => {
            speaker.sessions = [];
            speakerMap[speaker.id] = speaker;
        });
        this.speakerMap = speakerMap;

        //set talks to speakers and speakers to sessions
        event.schedule.forEach((day: any) => {
            date = day.date;
            slots = day.slots;
            slots.forEach((slot: any) => {
                time = slot.time;
                sessions = slot.sessions;
                sessions.forEach((session: any) => {
                    speakers = session.speakers;
                    session.date = date;
                    session.speakerNames = [];
                    sessionMap[session.id] = session;
                    speakers.forEach((speaker: any) => {
                        session.speakerNames.push(speakerMap[speaker].name);
                        speakerMap[speaker].sessions.push(session);
                    });
                });
            });
        });
        this.sessionMap = sessionMap;

        //map tracks to ids
        event.tracks.forEach((track: any) => {
            track.show = true;
            trackMap[track.id] = track;
        });
        this.trackMap = trackMap;

        return event;

    }

    //return an array of days given the start and end dates of the conference
    getDays(date) {
        var days = new Array();
        var currentDate = new Date(date.start);
        var toDate = new Date(date.end);
        while (currentDate <= toDate) {
            days.push(currentDate.getDate());
            currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        }
        return days;
    }

    //get the speakers with keys as their ids
    getSpeakers() {
        return this.speakerMap;
    }

    //get the sessions with keys as their ids
    getSessions() {
        return this.sessionMap;
    }

    //get tracks
    getTracks() {
        return this.event.tracks;
    }

    //set the tracks choosen by the user
    setTracks(tracks: any) {
        var trackMap = {};
        this.event.tracks = tracks;
        //map tracks to ids
        tracks.forEach((track: any) => {
            trackMap[track.id] = track;
        });
        this.trackMap = trackMap;

    }

    //add or remove a session from the user's schedule
    toggleSession(sessionId) {
        return this.getFavorites().then((mySchedule) => {
            mySchedule = mySchedule ? mySchedule : {};
            mySchedule[sessionId] = mySchedule[sessionId] ? false : true;
            this.storage.set('favorites', mySchedule);
            return mySchedule;
        })

    }

    //get a list of all of the sessions that the user chose
    getFavorites() {
        return this.storage.get('favorites');
    }

    //get the user's schedule
    getMySchedule() {
        var event = this.event;
        var schedule;
        schedule = event.schedule;
        return this.getFavorites().then((favorities) => {
            this.filter(schedule, favorities ? favorities : {});
            return event;
        });
    }

    //filter the schedule by tracks and favorites
    filter(schedule, favorities) {
        var schedule, slots, slot, sessions, session;
        var trackMap = this.trackMap;

        for (var day = 0; day < schedule.length; day++) {
            slots = schedule[day].slots;
            schedule[day].hide = true;
            for (var j = 0; j < slots.length; j++) {
                slot = slots[j];
                sessions = slot.sessions;
                slot.hide = true;
                for (var i = 0; i < sessions.length; i++) {
                    session = sessions[i];
                    session.hide = true;
                    //filter by tracks and favorities
                    session.tracks.forEach((trackId: any) => {
                        if (trackMap[trackId].show) {
                            if (favorities) {
                                if (favorities[session.id]) {
                                    this.show(session, slot, schedule, day);
                                }
                            } else {
                                this.show(session, slot, schedule, day);
                            }
                        }
                    });



                }
            }
        }

    }

    show(session, slot, schedule, day) {
        session.hide = false;
        slot.hide = false;
        schedule[day].hide = false;
    }

}

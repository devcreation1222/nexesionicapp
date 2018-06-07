import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GlobalProvider {
    daysNameOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    constructor (public http: Http) {
        //console.log('Hello GlobalProvider Provider');
    }

    public formatAMPM(date) {
        date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >=12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    public getNameDayOfWeek(objDate) {
        return this.daysNameOfWeek[objDate.getDay()-1];
    }

    public getDaysCurrentOfWeed(current) {
        let date = new Date(current);
        var week = [];
        // Starting Monday not Sunday
        date.setDate((date.getDate() - date.getDay() + 1));
        for (var i = 0; i < 7; i++) {
            week[i] = new Date(date);
            date.setDate(date.getDate() + 1);
        }
        return week;
    }

    public getMondayOfCurrentWeek(d) {
        var day = d.getDay();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0 ? -6 : 1) - day);
    }

    public getSundayOfCurrentWeek(d) {
        var day = d.getDay();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0 ? 0 : 7) - day);
    }

    public getFirstDayOfCurrentMonth(d) {
        return new Date(d.getFullYear(), d.getMonth(), 1);
    }

    public getLastDayOfCurrentMonth(d) {
        return new Date(d.getFullYear(), d.getMonth() + 1, 0);
    }

    public getCurrentDate() {
        var curr = new Date();
        return curr;
    }

    public ddmmyy(dataObj) {
        var month = (dataObj.getMonth() + 1);
        var monthStr = month < 10 ? ('0' + month) : month;
        var dateStr = dataObj.getDate() < 10 ? ('0' + dataObj.getDate()) : dataObj.getDate();
        return [dateStr, monthStr, dataObj.getFullYear()]
    }
}

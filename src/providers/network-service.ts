import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Network } from '@ionic-native/network';
import { AlertController, Platform } from 'ionic-angular';

declare var Connection;

@Injectable()
export class NetworkService {

  onDevice: boolean;

  constructor(public platform: Platform,
    private alert: AlertController, public network: Network) {
    this.onDevice = this.platform.is('cordova');
  }

  //check if the device is online
  isOnline(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  //check if the device is offline
  isOffline(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type === Connection.NONE;
    } else {
      return !navigator.onLine;
    }
  }

  //show an alert that the device is not connected
  showNetworkAlert() {
    let networkAlert = this.alert.create({
      title: 'No Internet Connection',
      subTitle: 'Please check your internet connection.',
      buttons: ['Dismiss']
    });
    networkAlert.present();
  }

}

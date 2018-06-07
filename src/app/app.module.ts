import { NgModule, ErrorHandler } from '@angular/core';
import { Http } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { ResetPage } from '../pages/reset/reset';
import { AboutPage } from '../pages/about/about';
import { SchedulePage } from '../pages/schedule/schedule';
import { SessionPage } from '../pages/session/session';
import { SpeakersPage } from '../pages/speakers/speakers';
import { SpeakerDetailPage } from '../pages/speaker-detail/speaker-detail';
import { ProfilePage } from '../pages/profile/profile';
import { TrackModalPage } from '../pages/track-modal/track-modal';
import { ConferenceData } from '../providers/conference-data';
import { NetworkService } from '../providers/network-service';
import { AuthService } from '../providers/auth-service';
import { ClassService } from '../providers/class-service';
import { GlobalProvider } from '../providers/global';
import { ProfileService } from '../providers/profile-service';
import { AlertService } from '../providers/alert-service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { MomentModule } from 'ngx-moment';



@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    SchedulePage,
    SessionPage,
    SpeakersPage,
    SpeakerDetailPage,
    ProfilePage,
    TrackModalPage,
    LoginPage,
    ResetPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    SchedulePage,
    SessionPage,
    SpeakersPage,
    SpeakerDetailPage,
    ProfilePage,
    TrackModalPage,
    LoginPage,
    ResetPage
  ],
  providers: [
    AuthService,
    StatusBar,
    SplashScreen,
    Network,
    ClassService,
    GlobalProvider,
    ProfileService,
    AlertService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }, ConferenceData, IonicStorageModule, NetworkService]
})
export class AppModule { }

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

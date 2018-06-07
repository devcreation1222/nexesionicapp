import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { SchedulePage } from '../pages/schedule/schedule';
//import { SpeakersPage } from '../pages/speakers/speakers';
import { ProfilePage } from '../pages/profile/profile';
import { AboutPage } from '../pages/about/about';

import { TranslateService } from 'ng2-translate/ng2-translate';
import { ClassService } from '../providers/class-service';
import { AlertService } from '../providers/alert-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage = LoginPage;
  pages: Array<{ title: string, icon: string, params: any, component: any }>;

  language: string = "es"; //set default language to spanish
  pendingTitle = "CLASES PENDIENTES";
  pendingClasses: Number;
  userId = localStorage.getItem('userId');
  authToken = localStorage.getItem('authToken');

  constructor(
    public translate: TranslateService,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private classService: ClassService,
    public alertService: AlertService,
    public events: Events
  ) {
    //this.rootPage = SchedulePage;
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang(this.language);
    this.useLanguage(this.language);

    this.initializeApp();

    events.subscribe('menu:created', () => {
      this.checkPending();
    });

    events.subscribe('menu:opened', () => {
      this.checkPending();
    });

    let aboutText, myProfileText, allClassesText, miScheduleText;

    translate.get(['ABOUT', 'MY_SCHEDULE', 'MY_PROFILE', 'ALL_CLASSES'], {}).subscribe((res) => {
      miScheduleText = res.MY_SCHEDULE;
      aboutText = res.ABOUT;
      myProfileText = res.MY_PROFILE;
      allClassesText = res.ALL_CLASSES;

      //pages to show in the side menu
      this.pages = [
        // { title: 'Iniciar sesión', icon: 'person', component: LoginPage, params: {} },
        { title: miScheduleText, icon: 'calendar', component: SchedulePage, params: { favorites: true } },
        { title: allClassesText, icon: 'disc', component: SchedulePage, params: { } },
        { title: myProfileText, icon: 'person', component: ProfilePage, params: {} },
        { title: aboutText, icon: 'information-circle', component: AboutPage, params: {} }
      ];

    });


  }

  initializeApp() {
    this.platform.ready().then(() => {
      //the platform is ready and our plugins are available.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    this.nav.setRoot(page.component, page.params);
  }

//set the language
  useLanguage(language) {
    this.language = language;
    this.translate.use(language)
  }

  logOut() {
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    this.nav.push(LoginPage);
  }

  menuClosed() {
    this.events.publish('menu:closed', '');
  }

  menuOpened() {
    this.events.publish('menu:opened', '');
  }

  checkPending(){
    this.userId = localStorage.getItem('userId');
    this.authToken = localStorage.getItem('authToken');

    if (this.userId && this.authToken) {
      this.classService.getPending(this.userId, this.authToken)
          .subscribe((response) => {
            if (response) {
              this.pendingClasses = response.pending;
              localStorage.setItem('pending', response.pending);
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
          });
    }
  }

}

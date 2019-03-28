import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Login',
      url: '/login',
      icon: 'list'
    },
    {
      title: 'Detalle Conductora',
      url: '/detalle-conductora',
      icon: 'contact'
    }, {
      title: 'Lista Conductoras',
      url: '/lista-conductoras',
      icon: 'person'
    },
    {
      title: 'Detalle Contrato',
      url: '/detalle-contrato',
      icon: 'person'
    },
    {
      title: 'Mapa',
      url: '/mapa',
      icon: 'person'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#c2185b');
      this.splashScreen.hide();
    });
  }
}

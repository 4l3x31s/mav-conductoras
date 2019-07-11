import { TokenNotifService } from './services/token-notif.service';
import { AuthService } from './services/firebase/auth.service';
import { MdlGeoLocalizacion } from './modelo/mdlGeoLocalizacion';
import { GeolocalizacionService } from './services/db/geolocalizacion.service';
import { Component } from '@angular/core';

import { Platform, NavController, Events, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SesionService } from './services/sesion.service';
import { ConductoraService } from './services/db/conductora.service';
import { MdlConductora } from './modelo/mldConductora';
import { NavParamService } from './services/nav-param.service';
import { LoadingService } from './services/util/loading.service';
import { AlertService } from './services/util/alert.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFireStorage } from '@angular/fire/storage';

import { FCM } from '@ionic-native/fcm/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  conductora: MdlConductora;
  public appPages = [
    {
      title: 'Inicio',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Carreras',
      url: '/detalle-carreras',
      icon: 'car'
    },
    {
      title: 'Ganancias',
      url: '/detalle-ganancias',
      icon: 'cash'
    }
  ];

  public appPagesAdmin = [
    {
      title: 'Inicio',
      url: '/home-admin',
      icon: 'home'
    },
    {
      title: 'Lista Conductoras',
      url: '/lista-conductoras',
      icon: 'people'
    },
    {
      title: 'Lista Feriados',
      url: '/lista-feriados',
      icon: 'calendar'
    },
    {
      title: 'Lista Clientes',
      url: '/lista-clientes',
      icon: 'people'
    },
    {
      title: 'Lista Parametros',
      url: '/lista-parametros',
      icon: 'analytics'
    },
    {
      title: 'Ubicación Conductoras',
      url: '/geo-conductoras',
      icon: 'map'
    }
  ];
  urlFoto: string;

  public watchID: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public sesionService: SesionService,
    public conductoraService: ConductoraService,
    public navController: NavController,
    public navParam: NavParamService,
    public events: Events,
    public alertController: AlertController,
    public loadingService: LoadingService,
    public alertService: AlertService,
    private geolocation: Geolocation,
    public geolocalizacionService: GeolocalizacionService,
    private storage: AngularFireStorage,
    public authService: AuthService,
    private fcm: FCM,
    private router: Router,
    private tokenService: TokenNotifService,
  ) {
    this.initializeApp();
    events.subscribe('user:login', () => {
      this.loggedIn();
    });
    events.subscribe('user:logout', () => {
      this.loggedOut();
    });
  }

  loggedIn() {
    console.log("logged in");
    this.sesionService.getSesion()
      .subscribe(conductora=>{
        this.conductoraService.getConductora(conductora.id)
          .subscribe( conductora => {
            this.conductora = conductora;
            this.storage.ref('mav/conductora/'+conductora.id+'-foto').getDownloadURL()
              .subscribe(ruta => {
                this.urlFoto = ruta;
              }, error => {
                this.urlFoto = undefined;
                //console.error(error);
              });
          });
      });
  }
  loggedOut() {
    this.authService.doLogout()
    .then( () => {
      console.log("logged out");
      this.conductora = undefined;
    }, err => {
      console.log("logged out");
      this.conductora = undefined;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#c2185b');
      this.splashScreen.hide();
      this.fcm.subscribeToTopic('people');
      this.fcm.getToken().then(token => {
        console.log(token);
        this.tokenService.set(token);
      });
      this.fcm.onNotification().subscribe(data => {
        console.log(data);
        if (data.wasTapped) {
          console.log('Received in background');
          this.router.navigate([data.landing_page, data.price]);
        } else {
          console.log('Received in foreground');
          this.router.navigate([data.landing_page, data.price]);
        }
      });

      this.fcm.onTokenRefresh().subscribe(token => {
        console.log(token);
      });


      this.sesionService.getSesion()
        .subscribe(conductora => {
          if (conductora) {
            this.conductoraService.getConductora(conductora.id)
            .subscribe( conductora => {
              this.conductora = conductora;
              this.initGeolocation(); // inicia geolocalizacion
            });
          }
      });
    });
  }
  initGeolocation() {

    this.watchID = navigator.geolocation.watchPosition((data) => {
      let mdlGeoLocalizacion: MdlGeoLocalizacion = new MdlGeoLocalizacion(this.conductora.id, data.coords.latitude, data.coords.longitude);
      this.geolocalizacionService.crearGeolocalizacion(mdlGeoLocalizacion);
    }, error => {
      console.log(error);
    });
  }

  irPagina(pagina:any){
    this.navParam.set({conductora: this.conductora });
    this.navController.navigateRoot(pagina.url);
  }

  irDetalleConductora(){
    this.navParam.set({conductora:this.conductora})
    this.navController.navigateRoot('/detalle-conductora');
  }

  async irCerrarSesion(){
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Esta segur@ de cerrar su sesión?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          cssClass: 'primary',
          handler: () => {
            this.loadingService.present()
              .then(() => {
                this.sesionService.cerrarSesion()
                  .then(()=>{
                    this.events.publish('user:logout');
                    this.loadingService.dismiss();
                    this.navController.navigateRoot('/login');
                  })
                  .catch(e=>{
                    console.log(e);
                    this.alertService.present('Error','Error al cerrar la sesion');
                    this.loadingService.dismiss();
                  })
              });
          }
        }
      ]
    });

    await alert.present();
  }
}

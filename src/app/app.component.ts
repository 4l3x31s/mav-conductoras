import { Component } from '@angular/core';

import { Platform, NavController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SesionService } from './services/sesion.service';
import { ConductoraService } from './services/db/conductora.service';
import { MdlConductora } from './modelo/mldConductora';
import { NavParamService } from './services/nav-param.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  
  conductora: MdlConductora;

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Detalle Conductora',
      url: '/detalle-conductora',
      icon: 'contact'
    },
    {
      title: 'Lista Conductoras',
      url: '/lista-conductoras',
      icon: 'person'
    },
    {
      title: 'Registro Feriados',
      url: '/reg-feriados',
      icon: 'person'
    },
    {
      title: 'Lista Clientes',
      url: '/lista-clientes',
      icon: 'person'
    },
    {
      title: 'Lista Parametros',
      url: '/lista-parametros',
      icon: 'person'
    },
    {
      title: 'Carreras',
      url: '/detalle-carreras',
      icon: 'calendar'
    },
    {
      title: 'Login',
      url: '/login',
      icon: 'list'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public sesionService: SesionService,
    public conductoraService: ConductoraService,
    public navController: NavController,
    public navParam: NavParamService,
    public events: Events
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
      .then(conductora=>{
        this.conductoraService.getConductora(conductora.id)
          .subscribe( conductora => {
            this.conductora = conductora;
          });
      });
  }
  loggedOut() {
    console.log("logged out");
    this.conductora = undefined;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#c2185b');
      this.splashScreen.hide();
      this.sesionService.getSesion()
        .then(conductora => {
          if (conductora) {
            this.conductoraService.getConductora(conductora.id)
            .subscribe( conductora => {
              this.conductora = conductora;
            });
          }
      });
    });
  }

  irPagina(pagina:any){
    this.navParam.set({conductora:this.conductora})
    this.navController.navigateRoot(pagina.url);
  }
}

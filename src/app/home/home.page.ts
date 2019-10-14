import { Component, OnInit } from '@angular/core';
import { SesionService } from '../services/sesion.service';
import { MdlConductora } from '../modelo/mldConductora';
import { NavController, AlertController, Events, ModalController, Platform } from '@ionic/angular';
import { LoadingService } from '../services/util/loading.service';
import { AlertService } from '../services/util/alert.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { MdlCarrera } from '../modelo/mdlCarrera';
import { CarreraService } from '../services/db/carrera.service';
import { DetalleCarreraPage } from '../comun/detalle-carrera/detalle-carrera.page';
import { MdlGeoLocalizacion } from '../modelo/mdlGeoLocalizacion';
import { GeolocalizacionService } from '../services/db/geolocalizacion.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  conductora: MdlConductora;
  pendientes: MdlCarrera[];
  watchID: any;
  subscription: any;
  constructor(
    public sesionService: SesionService,
    public navController: NavController,
    public alertController: AlertController,
    public loadingService: LoadingService,
    public alertService: AlertService,
    public events: Events,
    public iab: InAppBrowser,
    public carreraService: CarreraService,
    public modalController: ModalController,
    public geolocalizacionService: GeolocalizacionService,
    public platform: Platform,
  ) { }

  ngOnInit() {
    this.sesionService.crearSesionBase()
      .then(() => {
        this.sesionService.getSesion()
          .subscribe((conductora) => {
            if (conductora) {
              this.conductora = conductora;
              this.verLocalizacion();
              this.carreraService.getCarrerasPendientes()
                .subscribe(carreras=>{
                  this.pendientes = carreras;
                  this.pendientes = carreras.filter(
                    carrera => !carrera.idConductora && !carrera.idContrato
                  );
                  this.pendientes.sort(function (a, b) {
                    return b.id - a.id;
                  });
                });
            } else {
              this.navController.navigateRoot('/login');
            }
          });
      })
      .catch(e=>{
        alert('error crearSesionBase:'+JSON.stringify(e));
      });
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
                    this.alertService.present('Error','Error al cerrar la sesion 2:'+JSON.stringify(e));
                    this.loadingService.dismiss();
                  })
              });
          }
        }
      ]
    });

    await alert.present();
  }
  abrirWhatsapp() {
    this.iab.create(`https://api.whatsapp.com/send?phone=59177232781&text=Un%20Movil%20porfavor`, '_system', 'location=yes');
  }
  async irDetalleCarrera(carrera) {
    const modal = await this.modalController.create({
      component: DetalleCarreraPage,
      componentProps: { 
        carrera: carrera
      }
    });
    return await modal.present();
  }
  tomarCarrera(carrera:MdlCarrera){
    this.carreraService.tomarCarrera(this.conductora, carrera)
      .then(() => {
        this.alertService.present('Información', 'Se asignó correctamente.')
          .then(()=>{
            this.navController.navigateForward('/detalle-carreras');
          });
      });
  }
  verLocalizacion() {
    this.watchID = navigator.geolocation.watchPosition((data) => {
      let mdlGeoLocalizacion: MdlGeoLocalizacion = new MdlGeoLocalizacion(this.conductora.id, data.coords.latitude, data.coords.longitude);
      this.geolocalizacionService.crearGeolocalizacion(mdlGeoLocalizacion);
    }, error => {
    });
  }
  ionViewDidEnter(){
      this.subscription = this.platform.backButton.subscribe(()=>{
          navigator['app'].exitApp();
      });
  }
  
  ionViewWillLeave(){
      this.subscription.unsubscribe();
  }
}

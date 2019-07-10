/// <reference types='@types/googlemaps' />
import { NavParamService } from './../../services/nav-param.service';
import { Observable } from 'rxjs';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MdlCarrera } from 'src/app/modelo/mdlCarrera';
import { ModalController, NavController, ActionSheetController } from '@ionic/angular';
import { ClienteService } from 'src/app/services/db/cliente.service';
import { AlertService } from 'src/app/services/util/alert.service';
import { MdlCliente } from 'src/app/modelo/mdlCliente';
import { LoadingService } from 'src/app/services/util/loading.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CarreraService } from 'src/app/services/db/carrera.service';
import { SesionService } from 'src/app/services/sesion.service';
import { MdlConductora } from 'src/app/modelo/mldConductora';
import { TerminarCarreraPage } from '../terminar-carrera/terminar-carrera.page';
import { ClientePage } from '../cliente/cliente.page';

declare var google: any;

@Component({
  selector: 'app-detalle-carrera',
  templateUrl: './detalle-carrera.page.html',
  styleUrls: ['./detalle-carrera.page.scss'],
})
export class DetalleCarreraPage implements OnInit {

  @Input()
  carrera: MdlCarrera;
  
  cliente: MdlCliente;
  
  @ViewChild('map')
  mapElement: ElementRef;
  conductora: MdlConductora;

  constructor(
    private modalCtrl:ModalController,
    public clienteService:ClienteService,
    public alertService: AlertService,
    public navController: NavController,
    public loadingService: LoadingService,
    public iab: InAppBrowser,
    public actionSheetController: ActionSheetController,
    public carreraService:CarreraService,
    public sesionService:SesionService,
    public modalController: ModalController,
    public navParams: NavParamService
  ) { }

  ngOnInit() {
    this.loadingService.present()
      .then(()=>{
        this.clienteService.getCliente(this.carrera.idUsuario)
          .subscribe(cliente=>{
            this.cliente = cliente;
            this.sesionService.getSesion()
            .then(conductora=>{
              this.conductora=conductora;
              this.initAutocomplete();
              this.loadingService.dismiss();
            });
            
          },error=>{
            console.error(error);
            this.loadingService.dismiss();
            this.alertService.present('Error', 'Error al el cliente en la carrera.');
            this.navController.navigateRoot('/login');
          })
      })
    
  }

  initAutocomplete() {
    const myLatlngIni = { lat: parseFloat(this.carrera.latInicio), lng: parseFloat(this.carrera.longInicio)};
    const myLatlngFin = { lat: parseFloat(this.carrera.latFin), lng: parseFloat(this.carrera.longFin)};
    /*const mapOptions = {
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: true,
      fullScreenControl: false,
      center: myLatlngFin
    };*/

    const mapOptions = {
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullScreenControl: false,
      zoomControl: false,
      scaleControl: false,
      rotateControl: false,
      fullscreenControl: false,
      center: myLatlngFin
    };
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#EE4088'
      }
    });
    var map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    directionsDisplay.setMap(map);
    let respuesta = this.calculateAndDisplayRoute(directionsService, directionsDisplay, myLatlngIni, myLatlngFin);
    respuesta.subscribe(data => {
      console.log(data);
    });
    let markers = [];
    markers.push(new google.maps.Marker
      ({
        position: myLatlngFin,
        map: map,
        icon: 'assets/image/pin-check.png'
      }));
    markers.push(new google.maps.Marker
      ({
        position: myLatlngIni,
        map: map,
        icon: 'assets/image/pin-flag.png'
      }));
  }
  calculateAndDisplayRoute(directionsService, directionsDisplay, myLatlngIni, myLatlngFin): Observable<any> {
      return Observable.create((observer) => {
        directionsService.route({
          origin: myLatlngIni,
          destination: myLatlngFin,
          travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
          observer.next(response);
          observer.complete();
        });
      });
  }
  /*respuestaRoute(response, status): Observable<any> {
    return Observable.create((observer) => {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
      observer.next(response);
      observer.complete();
    });
  }*/
  cerrar() {
    this.modalCtrl.dismiss();
  }

  irWhatsApp() {
    this.iab.create('https://api.whatsapp.com/send?phone=591' + this.cliente.cel + '&text=Hola', '_system', 'location=yes');
  }

  async showOpcionesCarrera() {
    let opciones:any[] = [];
    opciones.push({
      text: 'Cancelar',
      icon: 'close',
      role: 'cancel',
      handler: () => {

      }
    });
    if(this.carrera.estado == 2
        && this.carrera.idConductora == this.conductora.id){
      opciones.push({
        text: 'Terminar Carrera',
        icon: 'skip-forward',
        handler: () => {
          this.irTerminarCarrera();
        }
      });
      opciones.push({
        text: 'Avisar en Camino',
        icon: 'send',
        handler: () => {
          this.marcarEnCamino();
        }
      });
      opciones.push({
        text: 'Empezar Carrera',
        icon: 'compass',
        handler: () => {
          this.marcarEmpezarCarrera();
        }
      });
    }
    if (this.conductora.admin) {
      opciones.push({
        text: 'Modificar Carrera',
        icon: 'compass',
        handler: () => {
          this.modificarCarrera();
        }
      });
    }
    if(this.carrera.estado == 2
        && this.carrera.idConductora == this.conductora.id
        && !this.carrera.idContrato){
      opciones.push({
        text: 'Dejar Carrera',
        icon: 'trash',
        handler: () => {
          this.dejarCarrera();
        }
      });
    }
    if(this.carrera.estado == 1
        && !this.carrera.idConductora
        && !this.carrera.idContrato){
      opciones.push({
        text: 'Tomar Carrera',
        icon: 'car',
        handler: () => {
          this.tomarCarrera();
        }
      });
    }
    
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones Carrera',
      buttons: opciones
    });
    await actionSheet.present();
  }

  tomarCarrera() {
    this.carreraService.tomarCarrera(this.conductora,this.carrera)
      .then(()=>{
        this.alertService.present('Información','Se asignó correctamente.')
          .then(()=>{
            this.navController.navigateForward('/detalle-carreras')
            .then(()=>{
              this.cerrar();
            });
          });
      });
  }
  dejarCarrera() {
    this.carreraService.dejarCarrera(this.carrera)
      .then(() => {
        this.alertService.present('Información','Dejaste la carrera :(.')
          .then(() => {
            this.cerrar();
          });
      });
  }
  marcarEnCamino() {
    this.carreraService.enCaminoCarrera(this.carrera)
    .then(() => {

      navigator.geolocation.getCurrentPosition((resp) => {
        const myLatlng = { lat: resp.coords.latitude, lng: resp.coords.longitude};
        let respuesta = 'http://www.google.com/maps/dir/'
          + myLatlng.lat
          + ','
          + myLatlng.lng
          + '/'
          + this.carrera.latInicio
          + ','
          + this.carrera.longInicio
          + '/@'
          + myLatlng.lat
          + ','
          + myLatlng.lng
          + ',12z/data=!4m2!4m1!3e0';
        this.iab.create(respuesta, '_system', 'location=yes');
       });
      
      this.alertService.present('Información','Avisaste que vas en camino. :D')
        .then(() => {
          this.cerrar();
        });
    });
  }
  marcarEmpezarCarrera() {
    navigator.geolocation.getCurrentPosition((resp) => {
      const myLatlng = { lat: resp.coords.latitude, lng: resp.coords.longitude};
      let respuesta = 'http://www.google.com/maps/dir/'
        + myLatlng.lat
        + ','
        + myLatlng.lng
        + '/'
        + this.carrera.latFin
        + ','
        + this.carrera.longFin
        + '/@'
        + myLatlng.lat
        + ','
        + myLatlng.lng
        + ',12z/data=!4m2!4m1!3e0';
        this.iab.create(respuesta, '_system', 'location=yes');
     });
  }

  async irTerminarCarrera() {
    const modal = await this.modalController.create({
      component: TerminarCarreraPage,
      componentProps: {
        carrera: this.carrera
      }
    });
    modal.onDidDismiss().then(()=>{
      this.carreraService.getCarreraPorId(this.carrera.id)
        .subscribe(carrera=>{
          this.carrera = carrera;
        })
    });
    return await modal.present();
  }

  async irCliente(){
    const modal = await this.modalController.create({
      component: ClientePage,
      componentProps: { 
        cliente: this.cliente
      }
    });
    return await modal.present();
  }
  public modificarCarrera() {
    this.navParams.set(this.carrera);
    this.navController.navigateForward('/mod-carrera');
    this.cerrar();
  }
}

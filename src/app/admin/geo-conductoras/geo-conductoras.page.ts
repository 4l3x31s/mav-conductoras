import { MdlConductora } from './../../modelo/mldConductora';
import { GeolocalizacionService } from './../../services/db/geolocalizacion.service';
import { AlertService } from './../../services/util/alert.service';
import { ToastService } from './../../services/util/toast.service';
import { NavController, ModalController, Platform } from '@ionic/angular';
import { NavParamService } from './../../services/nav-param.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SesionService } from 'src/app/services/sesion.service';

declare var google;

@Component({
  selector: 'app-geo-conductoras',
  templateUrl: './geo-conductoras.page.html',
  styleUrls: ['./geo-conductoras.page.scss'],
})
export class GeoConductorasPage implements OnInit {
  conductora: MdlConductora;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];
  constructor(
    public sesionService: SesionService,
    public navParam: NavParamService,
    public navController: NavController,
    public toastCtrl: ToastService,
    public modalController: ModalController,
    public alertController: AlertService,
    public platform: Platform,
    private geolocation: Geolocation,
    public geolocalizacionService: GeolocalizacionService
    ) {
      this.sesionService.crearSesionBase()
      .then(() => {
        this.sesionService.getSesion()
          .then((conductora) => {
            if (conductora) {
              this.conductora = conductora;
            } else {
              this.navController.navigateRoot('/login');
            }
          });
      });
      platform.ready().then(() => {
        this.initMap();
      });
      this.geolocalizacionService.listarCambios().subscribe( data => {
        console.log(data);
      })
    }


  ngOnInit() {

  }
  initMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let mylocation = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 15,
        center: mylocation
      });
    });
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.deleteMarkers();
      //this.updateGeolocation(this.device.uuid, data.coords.latitude,data.coords.longitude);
      let updatelocation = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      let image = 'assets/imgs/blue-bike.png';
      //this.addMarker(updatelocation,image);
      this.setMapOnAll(this.map);
    });
  }
  addMarker(location, image) {
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image
    });
    this.markers.push(marker);
  }

  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  clearMarkers() {
    this.setMapOnAll(null);
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }
}

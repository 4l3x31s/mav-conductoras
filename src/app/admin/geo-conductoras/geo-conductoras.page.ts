import { MdlGeoLocalizacion } from './../../modelo/mdlGeoLocalizacion';
import { MdlConductora } from './../../modelo/mldConductora';
import { GeolocalizacionService } from './../../services/db/geolocalizacion.service';
import { AlertService } from './../../services/util/alert.service';
import { ToastService } from './../../services/util/toast.service';
import { NavController, ModalController, Platform } from '@ionic/angular';
import { NavParamService } from './../../services/nav-param.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SesionService } from 'src/app/services/sesion.service';

declare var google;

@Component({
  selector: 'app-geo-conductoras',
  templateUrl: './geo-conductoras.page.html',
  styleUrls: ['./geo-conductoras.page.scss'],
})
export class GeoConductorasPage implements OnInit, OnDestroy {
  
  @ViewChild('mapge') mapElement: ElementRef;
  map: any;
  markers = [];
  watchID: any;
  listaGeoPosicionamiento: MdlGeoLocalizacion[] = [];
  pais: string;
  ciudad: string;
  constructor(public navCtrl: NavController,
    public geolocation: Geolocation,
    public geolocalizacionService: GeolocalizacionService) {}
  ngOnInit() {
    this.initMap();
    this.geolocalizacionService.listarCambios().subscribe( data => {
      this.deleteMarkers();
      this.listaGeoPosicionamiento = Object.assign(data);
      for (let geoObj of this.listaGeoPosicionamiento) {
        let image = 'assets/image/pin-mav.png';
          let updatelocation = new google.maps.LatLng(geoObj.latitude, geoObj.longitude);
          this.addMarker(updatelocation,image);
          this.setMapOnAll(this.map);
      }
    });
  }

  initMap() {
      navigator.geolocation.getCurrentPosition((resp) => {
        let mylocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
          zoom: 15,
          center: mylocation,
          mapTypeControl: false,
          streetViewControl: false,
          fullScreenControl: false,
          zoomControl: false,
          scaleControl: false,
          rotateControl: false,
          fullscreenControl: false
        });
        let geoResults = [];
        let geoResults1 = [];
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'location': mylocation}, function(results, status){
          if (status === 'OK') {
            geoResults  = results[0];
            geoResults1 = geoResults['address_components'];
            for(var i=0; i < geoResults1.length; i++){
              if(geoResults1[i].types[0]=='locality'){
                this.ciudad=geoResults1[i].short_name;
              }
              if(geoResults1[i].types[0]=='country'){
                this.pais=geoResults1[i].long_name;
              }
            }
            geoResults = [];
            geoResults1 = [];
          }
        })

      }, (error) => {
      }, { enableHighAccuracy: true });

      //navigator.geolocation.clearWatch(watchID);
      /*this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
        let mylocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
          zoom: 15,
          center: mylocation,
          mapTypeControl: false,
          streetViewControl: false,
          fullScreenControl: false,
          zoomControl: false,
          scaleControl: false,
          rotateControl: false,
          fullscreenControl: false
        });
      }, err => {
      });*/

        this.watchID = navigator.geolocation.watchPosition((data) => {
        this.deleteMarkers();
        if(this.listaGeoPosicionamiento.length > 0) {
          for (let geoObj of this.listaGeoPosicionamiento) {
            let image = 'assets/image/pin-mav.png';
              let updatelocation = new google.maps.LatLng(geoObj.latitude, geoObj.longitude);
              this.addMarker(updatelocation,image);
              this.setMapOnAll(this.map);
          }
        }
        let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
        let image = 'assets/image/car-pin.png';
        this.addMarker(updatelocation,image);
        this.setMapOnAll(this.map);
      }, error => {
      });
      /*let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        this.deleteMarkers();
        let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
        let image = 'assets/image/blue-bike.png';
        this.addMarker(updatelocation,image);
        this.setMapOnAll(this.map);
      }, err => {
      });*/
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
    for (let i = 0; i < this.markers.length; i++) {
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
  updateGeolocation(geoposicionamineto: MdlGeoLocalizacion) {
    this.geolocalizacionService.crearGeolocalizacion(geoposicionamineto);
  }
  ngOnDestroy(): void {
    navigator.geolocation.clearWatch(this.watchID);
  }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare var google;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  latitud: string;
  longitud: string;
  constructor() { }

  ngOnInit() {
    this.cargarMapa();
  }
  cargarMapa() {
    const myLatlng = { lat: -16.4978888, lng: -68.1314424};
    const mapOptions = {
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: true,
      fullScreenControl: false,
      center: myLatlng
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    let marker = new google.maps.Marker
    ({
      position: myLatlng,
      map: this.map,
      draggable: true,
      title: 'Mueveme'
    });
    marker.addListener('dragend', () => {
      console.log(JSON.stringify(marker.getPosition()));
      const objStr: string = JSON.stringify(marker.getPosition());
      const obj = JSON.parse(objStr);
      // window.alert(JSON.stringify(marker.getPosition()));
      this.latitud = obj.lat;
      this.longitud = obj.lng;
    });
    // {"lat":-16.498217987944532,"lng":-68.13232216455685}
  }
  guardarLatLong() {
    console.log(this.latitud);
    console.log(this.longitud);
  }
}

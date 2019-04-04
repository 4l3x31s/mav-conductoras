import { Injectable } from '@angular/core';
declare var google;
@Injectable({
  providedIn: 'root'
})
export class CalcularDistanciaTiempoService {
  constructor() { }

  async determinarDistanciaTiempo(latOrigen: number, lngOrigen: number, latDestino: number, lngDestino: number) {
    let distance = new google.maps.DistanceMatrixService();
    return distance.getDistanceMatrix({
      origins:
      [{
        lat: latOrigen,
        lng: lngOrigen
      }],
      destinations:
      [{
        lat: latDestino,
        lng: lngDestino
      }],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC,
      durationInTraffic: false,
      avoidHighways: false,
      avoidTolls: false
    }, (response, status) => {
      if (status === 'OK') {
        let origins = response.originAddresses;
        let destinations = response.destinationAddresses;
        for (let i = 0; i < origins.length; i++) {
          let results = response.rows[i].elements;
          for (let j = 0; j < results.length; j++) {
            let element = results[j];
            let distance = element.distance.text;
            let time = element.duration.text;
            console.log(distance, time);
          }
          return results;
        }
      }
    }
    );
  }
}

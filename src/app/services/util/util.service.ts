import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  serializar(objeto: any): any {
    for(let propiedad in objeto){
      objeto[propiedad] = objeto[propiedad] ? objeto[propiedad] : null;
    }
  }
}

import { MdlCarrera } from './../../modelo/mdlCarrera';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {
  
  rootRef: firebase.database.Reference;
  constructor(public afDB: AngularFireDatabase) {
    this.rootRef = this.afDB.database.ref();
  }
  insertarCarrera(carrera: MdlCarrera): Promise<any> {
    if (!carrera.id) {
      carrera.id = Date.now();
    }
    return this.afDB.database.ref('carrera/' + carrera.id).set(carrera);
  }
  /*insertarLista(listaCarrera: any) {
    return this.afDB.database.ref('carrera/' + carrera.id).set(carrera);
  }*/

  getCarrerasPorConductora(idConductora: number): Observable<MdlCarrera[]> {
    /*return this.afDB.list<MdlCarrera>('carrera', 
      ref => ref.orderByChild('idConductora').equalTo(idConductora)).valueChanges();*/
    return this.afDB.list<MdlCarrera>('carrera').valueChanges();
  }

}

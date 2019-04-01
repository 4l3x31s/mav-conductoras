import { MdlCarrera } from './../../modelo/mdlCarrera';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  rootRef: firebase.database.Reference;
  constructor(public afDB: AngularFireDatabase) {
    this.rootRef = this.afDB.database.ref();
  }
  insertarFeriado(carrera: MdlCarrera): Promise<any> {
    if (!carrera.id) {
      carrera.id = Date.now();
    }
    return this.afDB.database.ref('carrera/' + carrera.id).set(carrera);
  }

}

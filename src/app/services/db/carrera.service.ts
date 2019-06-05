import { MdlCarrera } from './../../modelo/mdlCarrera';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Moment } from 'moment';

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
    carrera.enCamino = false;
    return this.afDB.database.ref('carrera/' + carrera.id).set(carrera);
  }
  /*insertarLista(listaCarrera: any) {
    return this.afDB.database.ref('carrera/' + carrera.id).set(carrera);
  }*/

  getCarrerasPorConductora(idConductora: number): Observable<MdlCarrera[]> {
    return this.afDB.list<MdlCarrera>('carrera', 
      ref => ref.orderByChild('idConductora').equalTo(idConductora)).valueChanges();
  }

  getCarrerasPendientes() : Observable<MdlCarrera[]>{
    return this.afDB.list<MdlCarrera>('carrera', 
      ref => ref.orderByChild('estado').equalTo(1)).valueChanges();
  }

  tomarCarrera(idConductora: number, carrera: MdlCarrera): Promise<any> {
    carrera.estado = 2;
    carrera.idConductora = idConductora;
    return this.afDB.database.ref('carrera/' + carrera.id).set(carrera);
  }

  terminarCarrera(carrera: MdlCarrera): Promise<any> {
    carrera.fechaFin = (new Date()).toString();
    carrera.estado = 3;
    return this.afDB.database.ref('carrera/' + carrera.id).set(carrera);
  }
  enCaminoCarrera(carrera: MdlCarrera): Promise<any> {
    carrera.fechaFin = (new Date()).toString();
    carrera.enCamino = true;
    return this.afDB.database.ref('carrera/' + carrera.id).set(carrera);
  }
  getCarreraPorId(idCarrera: number): Observable<MdlCarrera> {
    return this.afDB.object<MdlCarrera>('carrera/' + idCarrera).valueChanges();
  }

  dejarCarrera(carrera: MdlCarrera): Promise<any> {
    carrera.estado = 1;
    carrera.idConductora = null;
    return this.afDB.database.ref('carrera/' + carrera.id).set(carrera);
  }

  getCarrerasPorConductoraLimite(idConductora: number, limite: number): Observable<MdlCarrera[]> {
    return this.afDB.list<MdlCarrera>('carrera',
      ref => ref.orderByChild('idConductora').equalTo(idConductora).limitToLast(limite)).valueChanges();
  }
  listCarreras() {
    return this.afDB.list<MdlCarrera>('carrera').valueChanges();
  }
}

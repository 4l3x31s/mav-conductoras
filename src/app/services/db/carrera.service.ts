import { MdlCarrera } from './../../modelo/mdlCarrera';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { MdlConductora } from 'src/app/modelo/mldConductora';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {
  
  rootRef: firebase.database.Reference;
  constructor(public afDB: AngularFireDatabase) {
    this.rootRef = this.afDB.database.ref();
  }
  crearCarrera(mdlCarrera: MdlCarrera): Promise<any> {
    if(!mdlCarrera.id){
      mdlCarrera.id = Date.now();
    }
   return this.afDB.database.ref('carrera/' + mdlCarrera.id).set(mdlCarrera);
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

  tomarCarrera(conductora: MdlConductora, carrera: MdlCarrera): Promise<any> {
    carrera.estado = 2;
    carrera.idConductora = conductora.id;
    carrera.nombreConductora = conductora.nombre+' '+conductora.paterno+' '+conductora.materno;
    return this.afDB.database.ref('carrera/' + carrera.id).set(carrera);
  }

  terminarCarrera(carrera: MdlCarrera): Promise<any> {
    carrera.fechaFin = moment().format();
    carrera.estado = 3;
    return this.afDB.database.ref('carrera/' + carrera.id).set(carrera);
  }
  enCaminoCarrera(carrera: MdlCarrera): Promise<any> {
    carrera.fechaFin = moment().format();
    carrera.enCamino = true;
    return this.afDB.database.ref('carrera/' + carrera.id).set(carrera);
  }
  getCarreraPorId(idCarrera: number): Observable<MdlCarrera> {
    return this.afDB.object<MdlCarrera>('carrera/' + idCarrera).valueChanges();
  }

  dejarCarrera(carrera: MdlCarrera): Promise<any> {
    carrera.estado = 1;
    carrera.idConductora = null;
    carrera.nombreConductora = null;
    return this.afDB.database.ref('carrera/' + carrera.id).set(carrera);
  }

  getCarrerasPorConductoraLimite(idConductora: number, limite: number): Observable<MdlCarrera[]> {
    return this.afDB.list<MdlCarrera>('carrera',
      ref => ref.orderByChild('idConductora').equalTo(idConductora).limitToLast(limite)).valueChanges();
  }
  listCarreras() {
    return this.afDB.list<MdlCarrera>('carrera').valueChanges();
  }

  getCarreraSesion(): MdlCarrera {
    return new MdlCarrera(
      null, null, null, null, null,
      null, null, null, null, null,
      null, null, null, null, null,
      null, null, null, null, null,
      null, null, null,null, null, null);
    }
}

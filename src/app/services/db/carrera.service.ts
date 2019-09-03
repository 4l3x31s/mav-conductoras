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
  async crearCarreraAsync(mdlCarrera: MdlCarrera): Promise<any> {
    if (!mdlCarrera.id) {
      mdlCarrera.id = Date.now();
    }
   return await this.afDB.database.ref('carrera/' + mdlCarrera.id).set(mdlCarrera);
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

  getCarrerasPorCliente(idUsuario: number): Observable<MdlCarrera[]> {
    return this.afDB.list<MdlCarrera>('carrera',
      ref => ref.orderByChild('idUsuario').equalTo(idUsuario)).valueChanges();
  }
  getCarrerasPorContrato(idContrato: number) {

    return this.rootRef.child('carrera').orderByChild('idContrato').equalTo(idContrato).once('value').then<MdlCarrera[]>(datos => {
      
      return datos.val();
    });
    // this.afDB.database.ref('carrera').orderByChild('idContrato').equalTo(idContrato);
    // return this.afDB.list<MdlCarrera>('carrera',
    //  ref => ref.orderByChild('idContrato').equalTo(idContrato));
  }
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
  eliminarCarrera(idCarrera: number) {
    this.afDB.database.ref('carrera/' + idCarrera).remove();
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

import { MdlContrato } from './../../modelo/mdlContrato';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { UtilService } from '../util/util.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  
  rootRef: firebase.database.Reference;
  constructor(
    public afDB: AngularFireDatabase,
    public utilService: UtilService
    ) {
    this.rootRef = this.afDB.database.ref();
  }
  insertarContrato(contrato: MdlContrato): Promise<any> {
    if (!contrato.id) {
      contrato.id = Date.now();
    }
    contrato.codigoContrato = contrato.codigoContrato + '-' + contrato.id;
    return this.afDB.database.ref('contrato/' + contrato.id).set(this.utilService.serializar(contrato));
  }
  listaContratosPorUsuario(idUsuario: number) {
    return this.afDB.list('contrato', ref =>
      ref.orderByChild('idUsuario').equalTo(idUsuario)).valueChanges();
  }

  getContratosPorConductora(idConductora: number):Observable<MdlContrato[]> {
    return this.afDB.list<MdlContrato>('contrato', ref =>
      ref.orderByChild('idConductora').equalTo(idConductora)).valueChanges();
  }
  listaContratosPorEstado() {
    return this.afDB.list('contrato', ref =>
      ref.orderByChild('estado').equalTo(0)).valueChanges();
  }
  listarContratos() {
    return this.afDB.list('contrato').valueChanges();
  }

  eliminarContrato(idContrato: number) {
    this.afDB.database.ref('contrato/' + idContrato).remove();
  }

}

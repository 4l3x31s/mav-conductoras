import { MdlContrato } from './../../modelo/mdlContrato';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { UtilService } from '../util/util.service';

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
  insertarFeriado(contrato: MdlContrato): Promise<any> {
    if (!contrato.id) {
      contrato.id = Date.now();
    }
    return this.afDB.database.ref('feriado/' + contrato.id).set(this.utilService.serializar(contrato));
  }
}

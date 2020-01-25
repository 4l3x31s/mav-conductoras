import { MdlAbonos } from './../../modelo/mdlAbonos';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { UtilService } from '../util/util.service';

@Injectable({
  providedIn: 'root'
})
export class AbonoService {

  rootRef: firebase.database.Reference;
  constructor(
    public afDB: AngularFireDatabase,
    public utilService: UtilService) {
    this.rootRef = this.afDB.database.ref();
   }
   insertarDeposito(abono: MdlAbonos) {
     if (!abono.id) {
      abono.id = Date.now();
     }
     return this.afDB.database.ref('abonos/' + abono.id).set(this.utilService.serializar(abono));
   }
   listaDepositos() {
     return this.afDB.list('abonos').valueChanges();
   }
   listaDepositosPorCliente(idConductora) {
     return this.afDB.list('abonos', ref => ref.orderByChild('idConductora').equalTo(idConductora)).valueChanges();
   }
}

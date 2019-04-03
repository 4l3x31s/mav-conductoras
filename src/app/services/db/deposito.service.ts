import { MdlDepositos } from './../../modelo/mdlDepositos';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { UtilService } from '../util/util.service';

@Injectable({
  providedIn: 'root'
})
export class DepositoService {
  rootRef: firebase.database.Reference;
  constructor(
    public afDB: AngularFireDatabase,
    public utilService: UtilService) {
    this.rootRef = this.afDB.database.ref();
   }
   insertarDeposito(deposito: MdlDepositos) {
     if (!deposito.id) {
       deposito.id = Date.now();
     }
     return this.afDB.database.ref('deposito/' + deposito.id).set(this.utilService.serializar(deposito));
   }
   listaDepositos() {
     return this.afDB.list('deposito').valueChanges();
   }
   listaDepositosPorCliente(idClient) {
     return this.afDB.list('deposito', ref => ref.orderByChild('idCliente').equalTo(idClient)).valueChanges();
   }
}

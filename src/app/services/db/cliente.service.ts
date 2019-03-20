import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { MdlCliente } from 'src/app/modelo/mdlCliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(
    public afDB: AngularFireDatabase
  ) { }
  crearCliente(mdlCliente: MdlCliente) {
    this.afDB.database.ref('/cliente' + mdlCliente.id).set(mdlCliente);
  }
  buscarClientePorUsuario(usuario: string, pass: string) {
    const db = this.afDB.database.ref();
    db.child('cliente').orderByChild('user').equalTo(usuario);
  }
}

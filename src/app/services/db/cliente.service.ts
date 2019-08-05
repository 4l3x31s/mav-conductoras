import { MdlCarrera } from 'src/app/modelo/mdlCarrera';
import { UtilService } from './../util/util.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { MdlCliente } from 'src/app/modelo/mdlCliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  
  rootRef: firebase.database.Reference;
  constructor(
    public afDB: AngularFireDatabase,
    public utilService: UtilService
  ) {
    this.rootRef = this.afDB.database.ref();
   }
   crearCliente(mdlCliente: MdlCliente): Promise<any> {
    if (!mdlCliente.id) {
     mdlCliente.id = Date.now();
    }
    if (!mdlCliente.estado) {
      mdlCliente.estado = true;
    }
   return this.afDB.database.ref('cliente/' + mdlCliente.id).set(this.utilService.serializar(mdlCliente));
 }
  buscarClientePorUsuario(usuario: string, pass: string) {
    const db = this.afDB.database.ref();
    db.child('cliente').orderByChild('user').equalTo(usuario);
  }

  listaClientes() {
    return this.afDB.list('cliente').valueChanges();
  }
  getCliente(id: number): Observable<MdlCliente> {
    return this.afDB.object<MdlCliente>('cliente/' + id).valueChanges();
  }

  getColorPorCliente(carrera: MdlCarrera): string {
    let color = localStorage.getItem('colorCliente-' + carrera.idUsuario);
    if(!color){
      color = 'black';
    }
    if(carrera.idContrato) {
      color = 'blue';
    }else{
      color = 'green';
    }
    return color;
  }
  getColorPorClienteGeneral(idCliente: number): string {
    let color = localStorage.getItem('colorCliente-' + idCliente);
    if(!color){
      color = 'black';
    }
    return color;
  }
  setColorCliente(idCliente: number, color:string){
    localStorage.setItem('colorCliente-'+idCliente, color);
  }
}

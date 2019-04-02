import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { MdlVehiculo } from 'src/app/modelo/mdlVehiculo';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { UtilService } from '../util/util.service';


@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  
  rootRef: firebase.database.Reference;
  constructor(
    public afDB: AngularFireDatabase,
    private storage: AngularFireStorage,
    public utilService: UtilService
  ) {
    this.rootRef = this.afDB.database.ref();
  }

  getVehiculoPorConductora(idConductora: number): Observable<MdlVehiculo[]> {
    return this.afDB.list<MdlVehiculo>('vehiculo/',
      ref => ref.orderByChild('idConductora').equalTo(idConductora)).valueChanges();
  }

  getUrlImgVehiculoPorConductora(idConductora: number): Observable<string> {
    return this.storage.ref('mav/vehiculo/' + idConductora+'-vehiculo').getDownloadURL();
  }

  getUrlImgRuatPorConductora(idConductora: number): Observable<string> {
    return this.storage.ref('mav/vehiculo/' + idConductora+'-ruat').getDownloadURL();
  }

  /**
   * Para revisar datos:
   * https://mav-db.firebaseio.com/vehiculo.json
   */
  actualizarVehiculo(vehiculo: MdlVehiculo): Promise<any> {
    if (!vehiculo.id) {
      vehiculo.id = Date.now();
    }
    return this.afDB.database.ref('vehiculo/' + vehiculo.id)
      .set(this.utilService.serializar(vehiculo));
  }

  uploadImgVehiculo(file: any, idConductora: number): AngularFireUploadTask {
    return this.storage.upload('mav/vehiculo/'+idConductora+'-vehiculo', file);
  }

  uploadImgRuat(file: any, idConductora: number): AngularFireUploadTask {
    return this.storage.upload('mav/vehiculo/'+idConductora+'-ruat', file);
  }

}

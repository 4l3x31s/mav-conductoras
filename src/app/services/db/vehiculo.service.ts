import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from 'angularfire2/storage';


@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  rootRef: firebase.database.Reference;
  constructor(
    public afDB: AngularFireDatabase,
    private storage: AngularFireStorage
  ) { 
    this.rootRef = this.afDB.database.ref();
  }

  upload(event) {
    //this.afDB.list('imagen_vehiculo').push(event.target.files[0]);
    const file = event.target.files[0];
    const filePath = 'imagen-vehiculo/'+Date.now();
    this.storage.upload(filePath, file);
  }
}

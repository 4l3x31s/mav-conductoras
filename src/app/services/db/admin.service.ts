import { MdlConductora } from './../../modelo/mldConductora';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { defineBase } from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  rootRef: firebase.database.Reference;
  constructor(public afDB: AngularFireDatabase) {
    this.rootRef = this.afDB.database.ref();
   }

  conductoraPorNombre(nombreConductora: string) {
    return this.rootRef.child('conductora').orderByChild('nombre').equalTo(nombreConductora);
  }
}

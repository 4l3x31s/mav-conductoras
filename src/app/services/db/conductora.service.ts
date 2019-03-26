import { Injectable } from '@angular/core';
import { MdlConductora } from 'src/app/modelo/mldConductora';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { MdlCliente } from 'src/app/modelo/mdlCliente';

@Injectable({
  providedIn: 'root'
})
export class ConductoraService {
  
  constructor(
    public afDB: AngularFireDatabase
  ) { }

  /**
   * Para revisar datos:
   * https://mav-db.firebaseio.com/conductora.json
   */
  insertarConductora(conductora: MdlConductora): Promise<any> {
    if (!conductora.id) {
      conductora.id = Date.now();
    }
    return this.afDB.database.ref('conductora/' + conductora.id).set(conductora);
  }
  actualizarConductora(conductora: MdlConductora): Promise<any> {
    return this.afDB.database.ref('conductora/' + conductora.id).set(conductora);
  }
  getConductoraPorUserPass(user: string, pass: string) : Observable<MdlConductora[]> {
    return new Observable<MdlConductora[]>(observer => {
      this.afDB.list<MdlConductora>('conductora/',
        ref => ref.orderByChild('user').equalTo(user)).valueChanges()
        .subscribe(conductoras=>{
          console.log('service',conductoras);
          if(conductoras.length > 0 && pass == conductoras[0].pass){
            observer.next(conductoras);
          } else {
            observer.next();
          }
          observer.complete();
        });
    });
  }

  getConductora(id: number) : Observable<MdlConductora> {
    return this.afDB.object<MdlConductora>('conductora/'+id).valueChanges();
  }

}

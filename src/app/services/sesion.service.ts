import { Injectable } from '@angular/core';
import { ConductoraService } from './db/conductora.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SqliteService } from './sqlite.service';
import { MdlConductora } from '../modelo/mldConductora';

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  
  //SOLO DE PRUEBA, NO USAR
  conductoraSesionPrueba: MdlConductora;
  
  constructor(
    public conductoraService: ConductoraService,
    public sqlite: SqliteService
  ) { }

  login(user: string, pass: string) : Observable<any> {
    return new Observable<boolean>(observer => {
      this.conductoraService.getConductoraPorUserPass(user, pass)
        .subscribe(conductora=>{
          if(conductora){
            if(environment.isSesionPrueba){
              this.conductoraSesionPrueba = conductora[0];
              this.conductoraSesionPrueba.nombre += '(PRUEBA)';
              this.conductoraSesionPrueba.paterno += '(PRUEBA)';
            } else {
              this.sqlite.setConductoraSesion(conductora[0]);
            }
            observer.next();
          } else {
            observer.error({message:'Usuario y/o contraseña inválida'});
          }
          observer.complete();
        });
    });
  }

  getSesion(): Promise<MdlConductora> {
    if(environment.isSesionPrueba){
      return Promise.resolve(this.conductoraSesionPrueba);
    } else {
      return this.sqlite.getConductoraSesion();
    }
  }

  crearSesionBase(): Promise<any> {
    if(environment.isSesionPrueba){
      return Promise.resolve()
    } else {
      return this.sqlite.crearBD();
    }
  }
  
}

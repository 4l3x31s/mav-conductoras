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

  login(user: string) : Observable<MdlConductora> {
    return new Observable<MdlConductora>(observer => {
      this.conductoraService.getConductoraPorUserPass(user)
        .subscribe(conductora=>{
          if(conductora){
            if(conductora[0].estado){
              if(environment.isSesionPrueba){
                this.conductoraSesionPrueba = conductora[0];
                observer.next(this.conductoraSesionPrueba);
                observer.complete();
              } else {
                this.sqlite.setConductoraSesion(conductora[0])
                  .then(()=>{
                    observer.next(conductora[0]);
                    observer.complete();
                  })
                  .catch(e=>{
                    observer.error(e);
                    observer.complete();
                  });
              }
            } else {
              //observer.error({message:'Usuario no habilitado por el administrador'});
              observer.next(conductora[0]);
              observer.complete();
            }
            
          } else {
            observer.error({message:'Usuario y/o contraseña inválida'});
            observer.complete();
          }
        });
    });
  }

  getSesion() : Observable<MdlConductora>{
    return new Observable<MdlConductora>(observer => {
      if(environment.isSesionPrueba){
        observer.next(this.conductoraSesionPrueba);
        observer.complete();
      } else {
        this.sqlite.getConductoraSesion()
          .then(idConductora=>{
            this.conductoraService.getConductora(idConductora)
              .subscribe(conductora => {
                observer.next(conductora);
                observer.complete();
              });
          });
      }
    });
  }

  crearSesionBase(): Promise<any> {
    if(environment.isSesionPrueba){
      return Promise.resolve()
    } else {
      return this.sqlite.crearBD();
    }
  }

  cerrarSesion(): Promise<any>{
    if(environment.isSesionPrueba){
      this.conductoraSesionPrueba=undefined;
      return Promise.resolve()
    } else {
      return this.sqlite.removeConductoraSesion();
    }
  }
}

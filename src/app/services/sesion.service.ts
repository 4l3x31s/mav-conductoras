import { Injectable } from '@angular/core';
import { ConductoraService } from './db/conductora.service';
import { MdlConductora } from '../modelo/mldConductora';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  
  constructor(
    public conductoraService: ConductoraService
  ) { }

  login(user: string, pass: string) : Observable<MdlConductora[]> {
    return this.conductoraService.getConductoraPorUserPass(user, pass);
  }

}

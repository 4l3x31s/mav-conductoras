import { Injectable } from '@angular/core';
import { MdlConductora } from 'src/app/modelo/mldConductora';

@Injectable({
  providedIn: 'root'
})
export class ConductoraService {
  
  constructor() { }

  getConductoraSesion(): MdlConductora {
    return new MdlConductora(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    );
  }

}

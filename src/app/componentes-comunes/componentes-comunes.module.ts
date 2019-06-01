import { CabeceraBackComponent } from './cabecera-back/cabecera-back.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintErrorComponent } from './print-error/print-error.component';
import { IonicModule } from '@ionic/angular';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { NombreUsuarioColorComponent } from './nombre-usuario-color/nombre-usuario-color.component';

@NgModule({
  declarations: [
    PrintErrorComponent,
    CabeceraComponent,
    CabeceraBackComponent,
    NombreUsuarioColorComponent
  ],
  imports: [
    CommonModule, IonicModule
  ],
  exports: [
    PrintErrorComponent,
    CabeceraComponent,
    CabeceraBackComponent,
    NombreUsuarioColorComponent,
  ]
})
export class ComponentesComunesModule { }

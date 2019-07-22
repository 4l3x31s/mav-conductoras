import { GananciasClienteComponent } from './ganancias-cliente/ganancias-cliente.component';
import { GananciasComponent } from './ganancias/ganancias.component';
import { CabeceraBackComponent } from './cabecera-back/cabecera-back.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintErrorComponent } from './print-error/print-error.component';
import { IonicModule } from '@ionic/angular';
import { CabeceraComponent } from './cabecera/cabecera.component';

@NgModule({
  declarations: [
    PrintErrorComponent,
    CabeceraComponent,
    GananciasComponent,
    GananciasClienteComponent,
    CabeceraBackComponent
  ],
  imports: [
    CommonModule, IonicModule
  ],
  exports: [
    PrintErrorComponent,
    CabeceraComponent,
    GananciasComponent,
    GananciasClienteComponent,
    CabeceraBackComponent
  ]
})
export class ComponentesComunesModule { }

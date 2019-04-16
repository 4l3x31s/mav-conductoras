import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetalleCarrerasPage } from './detalle-carreras.page';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ComponentesComunesModule } from '../componentes-comunes/componentes-comunes.module';

const routes: Routes = [
  {
    path: '',
    component: DetalleCarrerasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FullCalendarModule,
    ComponentesComunesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetalleCarrerasPage]
})
export class DetalleCarrerasPageModule {}

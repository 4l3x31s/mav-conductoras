import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetalleVehiculoPage } from './detalle-vehiculo.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleVehiculoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetalleVehiculoPage]
})
export class DetalleVehiculoPageModule {}

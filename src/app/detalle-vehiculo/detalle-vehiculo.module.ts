import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetalleVehiculoPage } from './detalle-vehiculo.page';
import { ComponentesComunesModule } from '../componentes-comunes/componentes-comunes.module';
import { SubirImagenModule } from '../componentes/subir-imagen/subir-imagen.module';

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
    ComponentesComunesModule,
    SubirImagenModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetalleVehiculoPage]
})
export class DetalleVehiculoPageModule {}

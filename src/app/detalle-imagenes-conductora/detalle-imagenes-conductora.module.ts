import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetalleImagenesConductoraPage } from './detalle-imagenes-conductora.page';
import { SubirImagenModule } from '../componentes/subir-imagen/subir-imagen.module';
import { ComponentesComunesModule } from '../componentes-comunes/componentes-comunes.module';

const routes: Routes = [
  {
    path: '',
    component: DetalleImagenesConductoraPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubirImagenModule,
    ComponentesComunesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetalleImagenesConductoraPage]
})
export class DetalleImagenesConductoraPageModule {}

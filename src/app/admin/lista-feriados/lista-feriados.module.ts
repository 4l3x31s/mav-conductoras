import { ComponentesComunesModule } from './../../componentes-comunes/componentes-comunes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListaFeriadosPage } from './lista-feriados.page';

const routes: Routes = [
  {
    path: '',
    component: ListaFeriadosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentesComunesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListaFeriadosPage]
})
export class ListaFeriadosPageModule {}

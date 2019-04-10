import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListaClientesPage } from './lista-clientes.page';
import { ComponentesComunesModule } from 'src/app/componentes-comunes/componentes-comunes.module';

const routes: Routes = [
  {
    path: '',
    component: ListaClientesPage
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
  declarations: [ListaClientesPage]
})
export class ListaClientesPageModule {}

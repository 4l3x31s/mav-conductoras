import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListaContratosPage } from './lista-contratos.page';
import { ComponentesComunesModule } from 'src/app/componentes-comunes/componentes-comunes.module';

const routes: Routes = [
  {
    path: '',
    component: ListaContratosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComponentesComunesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListaContratosPage]
})
export class ListaContratosPageModule {}

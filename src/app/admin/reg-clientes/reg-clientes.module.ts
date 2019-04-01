import { ComponentesComunesModule } from 'src/app/componentes-comunes/componentes-comunes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegClientesPage } from './reg-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: RegClientesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentesComunesModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegClientesPage]
})
export class RegClientesPageModule {}

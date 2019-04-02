import { ComponentesComunesModule } from './../../componentes-comunes/componentes-comunes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegDepositosPage } from './reg-depositos.page';

const routes: Routes = [
  {
    path: '',
    component: RegDepositosPage
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
  declarations: [RegDepositosPage]
})
export class RegDepositosPageModule {}

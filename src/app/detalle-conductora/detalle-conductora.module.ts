import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetalleConductoraPage } from './detalle-conductora.page';
import { ComponentesComunesModule } from '../componentes-comunes/componentes-comunes.module';

const routes: Routes = [
  {
    path: '',
    component: DetalleConductoraPage
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
  declarations: [DetalleConductoraPage]
})
export class DetalleConductoraPageModule {}

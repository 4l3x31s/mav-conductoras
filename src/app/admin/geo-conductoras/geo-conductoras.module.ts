import { ComponentesComunesModule } from 'src/app/componentes-comunes/componentes-comunes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GeoConductorasPage } from './geo-conductoras.page';

const routes: Routes = [
  {
    path: '',
    component: GeoConductorasPage
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
  declarations: [GeoConductorasPage]
})
export class GeoConductorasPageModule {}

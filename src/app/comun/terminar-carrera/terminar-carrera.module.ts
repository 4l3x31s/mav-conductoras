import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TerminarCarreraPage } from './terminar-carrera.page';
import { ComponentesComunesModule } from 'src/app/componentes-comunes/componentes-comunes.module';
import { IonicRatingModule } from 'ionic4-rating';

const routes: Routes = [
  {
    path: '',
    component: TerminarCarreraPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    IonicRatingModule,
    ComponentesComunesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TerminarCarreraPage]
})
export class TerminarCarreraPageModule {}

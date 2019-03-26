import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BuscaConductoraPage } from './busca-conductora.page';

const routes: Routes = [
  {
    path: '',
    component: BuscaConductoraPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BuscaConductoraPage]
})
export class BuscaConductoraPageModule {}

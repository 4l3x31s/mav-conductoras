import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InformesReportesPage } from './informes-reportes.page';
import { ComponentesComunesModule } from 'src/app/componentes-comunes/componentes-comunes.module';

const routes: Routes = [
  {
    path: '',
    component: InformesReportesPage
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
  declarations: [InformesReportesPage]
})
export class InformesReportesPageModule {}

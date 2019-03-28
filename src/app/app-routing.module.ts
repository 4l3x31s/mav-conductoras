import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },  { path: 'detalle-conductora', loadChildren: './detalle-conductora/detalle-conductora.module#DetalleConductoraPageModule' },
  { path: 'busca-conductora', loadChildren: './admin/busca-conductora/busca-conductora.module#BuscaConductoraPageModule' },
  { path: 'lista-conductoras', loadChildren: './admin/lista-conductoras/lista-conductoras.module#ListaConductorasPageModule' },
  { path: 'detalle-contrato', loadChildren: './admin/detalle-contrato/detalle-contrato.module#DetalleContratoPageModule' },
  { path: 'mapa', loadChildren: './comun/mapa/mapa.module#MapaPageModule' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'detalle-conductora', loadChildren: './detalle-conductora/detalle-conductora.module#DetalleConductoraPageModule' },
  { path: 'busca-conductora', loadChildren: './admin/busca-conductora/busca-conductora.module#BuscaConductoraPageModule' },
  { path: 'lista-conductoras', loadChildren: './admin/lista-conductoras/lista-conductoras.module#ListaConductorasPageModule' },
  { path: 'detalle-contrato', loadChildren: './admin/detalle-contrato/detalle-contrato.module#DetalleContratoPageModule' },
  { path: 'mapa', loadChildren: './comun/mapa/mapa.module#MapaPageModule' },
  { path: 'detalle-vehiculo', loadChildren: './detalle-vehiculo/detalle-vehiculo.module#DetalleVehiculoPageModule' },
  { path: 'reg-feriados', loadChildren: './admin/reg-feriados/reg-feriados.module#RegFeriadosPageModule' },
  { path: 'lista-clientes', loadChildren: './admin/lista-clientes/lista-clientes.module#ListaClientesPageModule' },
  { path: 'reg-clientes', loadChildren: './admin/reg-clientes/reg-clientes.module#RegClientesPageModule' },
  { path: 'reg-depositos', loadChildren: './admin/reg-depositos/reg-depositos.module#RegDepositosPageModule' },
  { path: 'reg-parametros', loadChildren: './admin/reg-parametros/reg-parametros.module#RegParametrosPageModule' },
  { path: 'lista-parametros', loadChildren: './admin/lista-parametros/lista-parametros.module#ListaParametrosPageModule' },
  { path: 'detalle-imagenes-conductora', 
    loadChildren: './detalle-imagenes-conductora/detalle-imagenes-conductora.module#DetalleImagenesConductoraPageModule' },
  { path: 'calendario', loadChildren: './comun/calendario/calendario.module#CalendarioPageModule' },
  { path: 'lista-contratos', loadChildren: './admin/lista-contratos/lista-contratos.module#ListaContratosPageModule' },
  { path: 'detalle-carreras', loadChildren: './detalle-carreras/detalle-carreras.module#DetalleCarrerasPageModule' },
  { path: 'detalle-carrera', loadChildren: './comun/detalle-carrera/detalle-carrera.module#DetalleCarreraPageModule' },  { path: 'lista-feriados', loadChildren: './admin/lista-feriados/lista-feriados.module#ListaFeriadosPageModule' },
  { path: 'geo-conductoras', loadChildren: './admin/geo-conductoras/geo-conductoras.module#GeoConductorasPageModule' },
  { path: 'home-admin', loadChildren: './home-admin/home-admin.module#HomeAdminPageModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

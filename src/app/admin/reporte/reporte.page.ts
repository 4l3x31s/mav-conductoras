import { MdlCarrera } from 'src/app/modelo/mdlCarrera';
import { DepositoService } from './../../services/db/deposito.service';
import { CarreraService } from './../../services/db/carrera.service';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash'; 

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.page.html',
  styleUrls: ['./reporte.page.scss'],
})
export class ReportePage implements OnInit {
  public lstCarreras: MdlCarrera[] = [];
  filtros = {};
  public lstCarrerasFiltrado: MdlCarrera[] = [];

  constructor(public navController: NavController,
              public carreraService: CarreraService,
              public depositoService: DepositoService) { }

  ngOnInit() {
    this.obtenerCarreras();
  }
  public obtenerCarreras() {
    this.carreraService.listCarreras().subscribe(data => {
      this.lstCarreras = data;
      this.lstCarrerasFiltrado = this.filtrarContrato('estado', 3);
      console.log(this.lstCarrerasFiltrado);
    });
  }
  public filtrarContrato(atributo: string, valor: any): any {
    this.filtros[atributo] = val => val == valor;
    return _.filter(this.lstCarreras, _.conforms(this.filtros));
  }
  public filtrarGeneral(atributo: string, valor: any): any {
    this.filtros[atributo] = val => val == valor;
    return _.filter(this.lstCarreras, _.conforms(this.filtros));
  }

}

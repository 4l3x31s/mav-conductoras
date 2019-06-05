import { MdlCarrera } from 'src/app/modelo/mdlCarrera';
import { DepositoService } from './../../services/db/deposito.service';
import { CarreraService } from './../../services/db/carrera.service';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.page.html',
  styleUrls: ['./reporte.page.scss'],
})
export class ReportePage implements OnInit {
  public lstCarreras: Array<MdlCarrera>;
  constructor(public navController: NavController,
              public carreraService: CarreraService,
              public depositoService: DepositoService) { }

  ngOnInit() {
    this.obtenerCarreras();
  }
  public obtenerCarreras() {
    this.carreraService.listCarreras().subscribe(data => {
      this.lstCarreras = data;
      console.log(this.lstCarreras);
    });
  }

}

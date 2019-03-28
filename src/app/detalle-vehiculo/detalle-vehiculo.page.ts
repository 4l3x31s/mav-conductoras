import { Component, OnInit } from '@angular/core';
import { NavParamService } from '../services/nav-param.service';
import { MdlConductora } from '../modelo/mldConductora';

@Component({
  selector: 'app-detalle-vehiculo',
  templateUrl: './detalle-vehiculo.page.html',
  styleUrls: ['./detalle-vehiculo.page.scss'],
})
export class DetalleVehiculoPage implements OnInit {
  conductora: MdlConductora;

  constructor(
    public navParam: NavParamService
  ) { }

  ngOnInit() {
    this.conductora = this.navParam.get().conductora;
  }

}

import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../services/util/loading.service';
import { SesionService } from '../services/sesion.service';
import { MdlConductora } from '../modelo/mldConductora';
import { ContratoService } from '../services/db/contrato.service';
import * as moment from 'moment';
import { CarreraService } from '../services/db/carrera.service';
import { MdlCarrera } from '../modelo/mdlCarrera';

@Component({
  selector: 'app-detalle-ganancias',
  templateUrl: './detalle-ganancias.page.html',
  styleUrls: ['./detalle-ganancias.page.scss'],
})
export class DetalleGananciasPage implements OnInit {
  
  conductora: MdlConductora;
  mes: string;
  contratos: any[];
  totalRemiseCobrado: number=0;
  totalRemiseDepositados: number=0;
  totalContratos: number=0;

  constructor(
    public loadingService: LoadingService,
    public sesionService: SesionService,
    public contratoService: ContratoService,
    public carreraService: CarreraService
  ) { }

  ngOnInit() {
    this.loadingService.present()
      .then(() => {
        this.sesionService.getSesion()
          .then(conductora => {
            this.conductora = conductora;
            this.mes = moment().format();
            this.carreraService.getCarrerasPorConductora(this.conductora.id)
              .subscribe(carreras=>{
                if(carreras && carreras.length>0){
                  carreras.forEach(carrera => {
                    if(carrera.estado == 3 ){
                      if(carrera.idContrato){
                        this.adicionarContrato(carrera);
                      } else {
                        if(carrera.tipoPago=='Efectivo'){
                          this.adicionarRemiseCobrado(carrera);
                        } else {
                          this.adicionarRemiseDepositado(carrera);
                        }
                      }
                    }
                  });
                }
                this.loadingService.dismiss();
              });
          });
      });
  }
  adicionarContrato(carrera: MdlCarrera) {
    if(!this.contratos){
      this.contratos=new Array();
    }
    let index = this.contratos.findIndex(i => i.idContrato === carrera.idContrato);
    if(index>-1){
      let contrato = this.contratos[index];
      contrato.total += carrera.costo;
      this.contratos[index]=contrato;
      this.totalContratos+=carrera.costo;
    } else {
      this.contratos.push({
        idContrato: carrera.idContrato,
        idUsuario: carrera.idUsuario,
        total: carrera.costo
      });
      this.totalContratos=carrera.costo;
    }
  }
  adicionarRemiseCobrado(carrera: MdlCarrera) {
    this.totalRemiseCobrado+=carrera.costo;
    
  }
  adicionarRemiseDepositado(carrera: MdlCarrera) {
    this.totalRemiseDepositados+=carrera.costo;
  }

}

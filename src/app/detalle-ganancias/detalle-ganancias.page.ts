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
  minInicio: string;
  carreras: MdlCarrera[];

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
            //console.log('this.mes',this.mes)
            //console.log('anio',moment(this.mes).format('YYYY'));
            //console.log('mes',moment(this.mes).format('M'));
            //var startDate = moment([moment(this.mes).format('YYYY'), parseInt(moment(this.mes).format('M'))-2]);

            // Clone the value before .endOf()
            //var endDate = moment(startDate).endOf('month');
            // just for demonstration:
            //console.log('start',startDate.toDate());
            //console.log('fin',endDate.toDate());

            this.carreraService.getCarrerasPorConductoraLimite(this.conductora.id, 200)
              .subscribe(carreras=>{
                if(carreras && carreras.length>0){
                  let inicio=moment(carreras[0].fechaFin);
                  if(inicio.isBefore(moment())){
                    inicio=moment(carreras[0].fechaFin).add(1,'months');
                    if(inicio.isAfter(moment())){
                      inicio=moment(carreras[0].fechaFin).subtract(1,'months');
                    }
                  }
                  this.minInicio=inicio.format('YYYY')+'-'+inicio.format('MM')+'-01';
                  
                  this.carreras = carreras;
                  this.llenarDatos();

                }
                this.loadingService.dismiss();
              });
          });
      });
  }
  filtrar(){
    this.llenarDatos();
  }
  llenarDatos() {
    this.contratos=undefined;
    this.totalRemiseCobrado=0;
    this.totalRemiseDepositados=0;
    this.totalContratos=0;
    this.carreras.forEach(carrera => {
      if(carrera.estado == 3
          && carrera.idConductora == this.conductora.id
          && moment(carrera.fechaFin).format('M')==moment(this.mes).format('M')){
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

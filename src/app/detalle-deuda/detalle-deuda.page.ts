import { Component, OnInit } from '@angular/core';
import { NavParamService } from '../services/nav-param.service';
import { MdlCliente } from '../modelo/mdlCliente';
import { LoadingService } from '../services/util/loading.service';
import { CarreraService } from '../services/db/carrera.service';
import { MdlCarrera } from '../modelo/mdlCarrera';
import * as moment from 'moment';
import { DepositoService } from '../services/db/deposito.service';
import { MdlDepositos } from '../modelo/mdlDepositos';

@Component({
  selector: 'app-detalle-deuda',
  templateUrl: './detalle-deuda.page.html',
  styleUrls: ['./detalle-deuda.page.scss'],
})
export class DetalleDeudaPage implements OnInit {

  cliente: MdlCliente;
  fechaInicio: string;
  fechaFin: string;
  carreras: MdlCarrera[];
  depositos: MdlDepositos[];
  
  contratos: { idContrato: number, total: number }[];
  totalContratos: number = 0;

  totalRemises: number = 0;
  totalRemisesPagados: number = 0;
  totalDepositos: number = 0;

  constructor(
    public navParam: NavParamService,
    public loadingService: LoadingService,
    public carreraService: CarreraService,
    public depositoService: DepositoService
  ) { }

  ngOnInit() {
    //ini TODO quitar
    this.navParam.set({cliente:new MdlCliente(
      1559758003416, 'Veronica Paredes', '5967540 LP', 'Vino Tinto', 'japaza', 'japaza', 
      2306334, 70505938, 'antoniojuan777@gmail.com', 'xxx', true
    )});
    //fin TODO quitar
    if (this.navParam.get() && this.navParam.get().cliente) {
      this.cliente = this.navParam.get().cliente;
    } else {
      throw "cliente no enviado";
    }
    this.cargarDatos();
  }
  cargarDatos(){
    this.loadingService.present()
    .then(() => {
      this.obtieneCarreras();
    });
  }

  obtieneCarreras() {
    this.carreraService.getCarrerasPorCliente(this.cliente.id)
            .subscribe(carreras => {
              if (carreras && carreras.length > 0) {
                this.carreras = carreras;
              } else {
                this.carreras = undefined;
              }
              this.loadingService.dismiss();
            });
    this.depositoService.listaDepositosPorCliente(this.cliente.id)
            .subscribe(data=>{
              this.depositos = Object.assign(data);
            })
  }

  filtrar() {
    if(this.fechaInicio && this.fechaFin){
      this.llenarDatos();
    }
  }

  llenarDatos() {
    this.contratos = undefined;
    this.totalContratos=0;
    this.totalDepositos=0;
    this.totalRemises=0;
    this.totalRemisesPagados=0;
    if (this.carreras) {
      this.carreras.forEach(carrera => {
        if (carrera.estado == 3
          && moment(carrera.fechaInicio).isAfter(this.fechaInicio)
          && moment(carrera.fechaInicio).isSameOrBefore(this.fechaFin)) {
            if (carrera.idContrato) {
              this.adicionarContrato(carrera);
            } else {
              this.adicionarRemise(carrera);
            }
        }
      });
    }
    if(this.depositos){
      this.depositos.forEach(deposito => {
        if(moment(deposito.fecha).isAfter(this.fechaInicio)
          && moment(deposito.fecha).isSameOrBefore(this.fechaFin)){
            let aux:any=deposito.monto;
            this.totalDepositos += parseInt(aux);
        }
      });
    }
  }

  adicionarRemise(carrera: MdlCarrera){
    let aux:any=carrera.costo;
    this.totalRemises+=parseInt(aux);
    if(carrera.tipoPago=='Efectivo'){
      this.totalRemisesPagados+=parseInt(aux);
    }
  }
  adicionarContrato(carrera: MdlCarrera) {
    if (!this.contratos) {
      this.contratos = new Array();
    }
    let index = this.contratos.findIndex(i => i.idContrato === carrera.idContrato);
    if (index > -1) {
      let aux:any=carrera.costo;
      let contrato = this.contratos[index];
      contrato.total += parseInt(aux);
      this.contratos[index] = contrato;
      this.totalContratos += parseInt(aux);
    } else {
      let aux:any=carrera.costo;
      this.contratos.push({
        idContrato: carrera.idContrato,
        total: parseInt(aux)
      });
      this.totalContratos += parseInt(aux);
    }
  }
}

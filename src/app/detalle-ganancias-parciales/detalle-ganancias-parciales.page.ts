import { NavParamService } from './../services/nav-param.service';
import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../services/util/loading.service';
import { SesionService } from '../services/sesion.service';
import { MdlConductora } from '../modelo/mldConductora';
import { ContratoService } from '../services/db/contrato.service';
import * as moment from 'moment';
import { CarreraService } from '../services/db/carrera.service';
import { MdlCarrera } from '../modelo/mdlCarrera';
import { ClienteService } from '../services/db/cliente.service';
import { ModalController } from '@ionic/angular';
import { ClientePage } from '../comun/cliente/cliente.page';
import { MdlGananciasTotal } from '../modelo/mdlGananciasTotal';
import { MdlAbonos } from '../modelo/mdlAbonos';
import { AbonoService } from '../services/db/abono.service';

@Component({
  selector: 'app-detalle-ganancias-parciales',
  templateUrl: './detalle-ganancias-parciales.page.html',
  styleUrls: ['./detalle-ganancias-parciales.page.scss'],
})
export class DetalleGananciasParcialesPage implements OnInit {
  conductora: MdlConductora;
  mdlGananciasTotales: MdlGananciasTotal = new MdlGananciasTotal(null,null,null,null,null);
  lstGananciasTotal: Array<MdlGananciasTotal> =[];
  contratos: any[];
  totalRemiseCobrado: number = 0;
  totalRemiseDepositados: number = 0;
  totalContratos: number = 0;
  carreras: MdlCarrera[];
  fechaInicio: string;
  fechaFin: string;
  abonos: Array<MdlAbonos> = [];
  totalAbonos: number = 0;
  totalPenalizaciones:number = 0;

  constructor(
    public loadingService: LoadingService,
    public sesionService: SesionService,
    public contratoService: ContratoService,
    public carreraService: CarreraService,
    public clienteService: ClienteService,
    public modalController: ModalController,
    public navParamService: NavParamService,
    public abonoService: AbonoService
  ) { }

  ngOnInit() {
    console.log(this.navParamService.get());
    if (this.navParamService.get().conductora) {
      this.conductora = this.navParamService.get().conductora;
    }
    this.abonoService.listaDepositosPorCliente(this.conductora.id)
    .subscribe(data => {
      this.abonos = Object.assign(data);
    })
    this.cargarDatos();
  }
  cargarDatos(){
    this.loadingService.present()
    .then(() => {
      this.obtieneGananciasCarrera();
    });
  }
  obtieneGananciasCarrera() {
    this.carreraService.getCarrerasPorConductora(this.conductora.id)
            .subscribe(carreras => {
              if (carreras && carreras.length > 0) {
                this.carreras = carreras;
              } else {
                this.carreras = undefined;
              }
              this.loadingService.dismiss();
            });
  }
  filtrar() {
    if(this.fechaInicio && this.fechaFin){
      this.llenarDatos();
    }
  }

  llenarDatos() {
    this.contratos = undefined;
    this.totalRemiseCobrado = 0;
    this.totalRemiseDepositados = 0;
    this.totalContratos = 0;
    if (this.carreras) {
      this.carreras.forEach(carrera => {
        if (carrera.estado !==1
          && moment(carrera.fechaInicio).isAfter(this.fechaInicio)
          && moment(carrera.fechaInicio).isSameOrBefore(this.fechaFin)) {
            if (carrera.idContrato) {
            this.adicionarContrato(carrera);
            this.lstGananciasTotal.push(new MdlGananciasTotal(0,'Contrato',carrera.estado,carrera.costo, ''));
          } else {
            if (carrera.tipoPago == 'Efectivo') {
              this.adicionarRemiseCobrado(carrera);
              this.lstGananciasTotal.push(new MdlGananciasTotal(0,'Remise',carrera.estado,carrera.costo, 'Efectivo'));
            } else {
              this.adicionarRemiseDepositado(carrera);
              this.lstGananciasTotal.push(new MdlGananciasTotal(0,'Remise',carrera.estado,carrera.costo, 'Deposito'));
            }
          }
        }
      });
    }

    //TODO: Adicionar ABONO/ Penalizacion
    console.log(this.abonos);
    if(this.abonos.length > 0) {
      this.abonos.forEach(abono => {
        if(moment(abono.fecha).isAfter(this.fechaInicio)
        && moment(abono.fecha).isSameOrBefore(this.fechaFin)){
          if(abono.tipo === 'Abono'){
            this.adicionarAbonos(abono);
            this.lstGananciasTotal.push(new MdlGananciasTotal(0,'Bono',0,abono.monto, '--'));
          }else {
            this.adicionarPenalizaciones(abono);
            this.lstGananciasTotal.push(new MdlGananciasTotal(0,'Penalización',0, (-1 * abono.monto), '--'));
          }
        }
      });
    }
  }

  adicionarContrato(carrera: MdlCarrera) {
    if (!this.contratos) {
      this.contratos = new Array();
    }

    let index = this.contratos.findIndex(i => i.idContrato === carrera.idContrato);
    if (index > -1) {
      let aux: any = carrera.costo;
      let contrato = this.contratos[index];
      contrato.total += parseInt(aux);
      this.contratos[index] = contrato;
      this.totalContratos += parseInt(aux);
    } else {
      let aux:any=carrera.costo;
      this.contratos.push({
        idContrato: carrera.idContrato,
        idUsuario: carrera.idUsuario,
        nombreCliente: carrera.nombreCliente,
        colorCliente: this.clienteService.getColorPorCliente(carrera),
        total: parseInt(aux)
      });
      this.totalContratos += parseInt(aux);
    }
  }

  adicionarRemiseCobrado(carrera: MdlCarrera) {
    let aux:any=carrera.costo;
    this.totalRemiseCobrado += parseInt(aux);
  }
  adicionarAbonos(abono: MdlAbonos) {
    let aux:any=abono.monto;
    this.totalAbonos += parseInt(aux);
  }
  adicionarPenalizaciones(penalizacion: MdlAbonos) {
    let aux:any=penalizacion.monto;
    this.totalPenalizaciones += parseInt(aux);
    this.totalPenalizaciones = (this.totalPenalizaciones * -1);
  }

  adicionarRemiseDepositado(carrera: MdlCarrera) {
    let aux:any=carrera.costo;
    this.totalRemiseDepositados += parseInt(aux);
  }
  async irCliente(idUsuario){
    this.clienteService.getCliente(idUsuario)
      .subscribe(async cliente=>{
        const modal = await this.modalController.create({
          component: ClientePage,
          componentProps: { 
            cliente: cliente
          }
        });
        modal.onDidDismiss().then(()=>{
          this.llenarDatos();
        });
        return await modal.present();
      });
      
  }

}

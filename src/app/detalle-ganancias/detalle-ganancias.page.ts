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

@Component({
  selector: 'app-detalle-ganancias',
  templateUrl: './detalle-ganancias.page.html',
  styleUrls: ['./detalle-ganancias.page.scss'],
})
export class DetalleGananciasPage implements OnInit {

  conductora: MdlConductora;
  contratos: any[];
  totalRemiseCobrado: number = 0;
  totalRemiseDepositados: number = 0;
  totalContratos: number = 0;
  carreras: MdlCarrera[];
  fechaInicio: string;
  fechaFin: string;

  constructor(
    public loadingService: LoadingService,
    public sesionService: SesionService,
    public contratoService: ContratoService,
    public carreraService: CarreraService,
    public clienteService: ClienteService,
    public modalController: ModalController,
    public navParamService: NavParamService
  ) { }

  ngOnInit() {
    console.log(this.navParamService.get());
    if (this.navParamService.get().conductora) {
      this.conductora = this.navParamService.get().conductora;
    }
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
        if (carrera.estado == 3
          && moment(carrera.fechaInicio).isAfter(this.fechaInicio)
          && moment(carrera.fechaInicio).isSameOrBefore(this.fechaFin)) {
            
            if (carrera.idContrato) {
            this.adicionarContrato(carrera);
          } else {
            if (carrera.tipoPago == 'Efectivo') {
              this.adicionarRemiseCobrado(carrera);
            } else {
              this.adicionarRemiseDepositado(carrera);
            }
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
      let aux:any=carrera.costo;
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

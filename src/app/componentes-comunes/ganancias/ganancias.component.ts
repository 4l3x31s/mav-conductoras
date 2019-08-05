import { ClientePage } from './../../comun/cliente/cliente.page';
import { ModalController } from '@ionic/angular';
import { ClienteService } from 'src/app/services/db/cliente.service';
import { CarreraService } from 'src/app/services/db/carrera.service';
import { ContratoService } from 'src/app/services/db/contrato.service';
import { LoadingService } from './../../services/util/loading.service';
import { MdlCarrera } from './../../modelo/mdlCarrera';
import { MdlConductora } from './../../modelo/mldConductora';
import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { SesionService } from 'src/app/services/sesion.service';



@Component({
  selector: 'app-ganancias',
  templateUrl: './ganancias.component.html',
  styleUrls: ['./ganancias.component.scss'],
})
export class GananciasComponent implements OnInit {
  conductora: MdlConductora;
  mes: string;
  contratos: any[];
  totalRemiseCobrado: number = 0;
  totalRemiseDepositados: number = 0;
  totalContratos: number = 0;
  minInicio: string;
  carreras: MdlCarrera[];

  @Input() cond: any;
  //@Input() carrerasInput: any;
  constructor(
    public loadingService: LoadingService,
    public sesionService: SesionService,
    public contratoService: ContratoService,
    public carreraService: CarreraService,
    public clienteService: ClienteService,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    this.mes = moment().format();
    this.cargarDatos();
  }
  cargarDatos() {
    this.loadingService.present()
    .then(() => {
      this.conductora = this.cond;

      this.carreraService.getCarrerasPorConductoraLimite(this.conductora.id, 200)
        .subscribe(carreras => {
          if (carreras && carreras.length > 0) {
            let inicio = moment(carreras[0].fechaInicio);
            if (inicio.isBefore(moment())) {
              inicio = moment(carreras[0].fechaInicio).add(1, 'months');
              if (inicio.isAfter(moment())) {
                inicio = moment(carreras[0].fechaInicio).subtract(1, 'months');
              }
            }
            this.minInicio = inicio.format('YYYY') + '-' + inicio.format('MM') + '-01';

            this.carreras = carreras;
            this.llenarDatos();

          } else {
            this.carreras = undefined;
          }
          this.loadingService.dismiss();
        });
    });
  }

  filtrar() {
    this.llenarDatos();
  }
  llenarDatos() {
    this.contratos = undefined;
    this.totalRemiseCobrado = 0;
    this.totalRemiseDepositados = 0;
    this.totalContratos = 0;
    if (this.carreras) {
      this.carreras.forEach(carrera => {
        if (carrera.estado == 3
          && carrera.idConductora == this.conductora.id
          && moment(carrera.fechaInicio).format('M') == moment(this.mes).format('M')) {
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
      this.totalContratos = parseInt(aux);
    }
  }
  adicionarRemiseCobrado(carrera: MdlCarrera) {
    let aux:any=carrera.costo;
    this.totalRemiseCobrado += parseInt(aux);
  }
  adicionarRemiseDepositado(carrera: MdlCarrera) {
    let aux: any = carrera.costo;
    this.totalRemiseDepositados += parseInt(aux);
  }
  /*irCliente(idUsuario){
    this.clienteService.getCliente(idUsuario)
      .subscribe(cliente=>{
        this.modalController.create({
          component: ClientePage,
          componentProps: { 
            cliente: cliente
          }
        }).then(modal=>{
          modal.present();
        });
      });
  }*/
  async irCliente(idUsuario){
    this.clienteService.getCliente(idUsuario)
      .subscribe(async cliente => {
        const modal = await this.modalController.create({
          component: ClientePage,
          componentProps: {
            cliente: cliente
          }
        });
        modal.onDidDismiss().then(()=>{
          this.cargarDatos();
        });
        return await modal.present();
      });
  }
}

import { ParametrosCarreraService } from './../../services/db/parametros-carrera.service';
import { MdlFeriado } from './../../modelo/mdlFeriado';
import { MdlCliente } from './../../modelo/mdlCliente';
import { MdlConductora } from './../../modelo/mldConductora';
import { CarreraService } from './../../services/db/carrera.service';
import { ClienteService } from './../../services/db/cliente.service';
import { ConductoraService } from './../../services/db/conductora.service';
import { MdlContrato } from './../../modelo/mdlContrato';
import { MapaPage } from './../../comun/mapa/mapa.page';
import { NavParamService } from './../../services/nav-param.service';
import { NavController, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FeriadosService } from 'src/app/services/db/feriados.service';
import { LoadingService } from 'src/app/services/util/loading.service';
import { MdlParametrosCarrera } from 'src/app/modelo/mdlParametrosCarrera';

@Component({
  selector: 'app-detalle-contrato',
  templateUrl: './detalle-contrato.page.html',
  styleUrls: ['./detalle-contrato.page.scss'],
})
export class DetalleContratoPage implements OnInit {
  frmContrato: FormGroup;
  public contrato: MdlContrato = new MdlContrato(
    null, null, null, null, null, null, null, null, null, null, null,null,null,null,null,null,null, null
  );
  public lstConductoras: MdlConductora[] = [];
  public lstClientes: MdlCliente[] = [];
  public lstFeriados: MdlFeriado[] = [];
  public lstParametros: MdlParametrosCarrera [] = [];
  public lstCiudadesFiltrado: MdlParametrosCarrera [] = [];
  public lstPaisesFiltrados = [];
  public cliente: MdlCliente;
  constructor(
    public fb: FormBuilder,
    public navController: NavController,
    public navParamService: NavParamService,
    public modalController: ModalController,
    public conductoraService: ConductoraService,
    public clienteService: ClienteService,
    public feriadoService: FeriadosService,
    public carreraService: CarreraService,
    public loading: LoadingService,
    public parametrosService: ParametrosCarreraService,
    public navParams: NavParamService
  ) {
    this.cliente = this.navParams.get().cliente;
  }

  ngOnInit() {
    this.initValidaciones();
    // this.obtenerClientes();
    this.obtenerParametros();
    // this.obtenerConductoras();
    this.obtenerFeriados();
  }
  filtrarCiudades(event) {
    console.log(event);
    this.lstCiudadesFiltrado = this.lstParametros.filter(
      parametros => parametros.pais.indexOf(event) > -1
    );
  }
  filtrarConductoras(event) {
    this.contrato.idConductora = null;
    this.lstConductoras = undefined;
    this.conductoraService.getConductoraPorPaisCiudad(this.contrato.pais, event)
        .subscribe(conductora => {
          this.lstConductoras = undefined;
          if (conductora) {
            this.lstConductoras = conductora;
          }
        }, error => {
          this.lstConductoras = undefined;
        });
  }
  obtenerConductoras() {
    //this.loading.present();
    this.conductoraService.listaConductoras().subscribe(data => {
      //this.loading.dismiss();
      this.lstConductoras = Object.assign(data);
    }, error => {
      //this.loading.dismiss();
    });
  }
  async obtenerParametros() {
    this.loading.present();
    await this.parametrosService.listarParametros().subscribe(data => {
      //this.loading.dismiss();
      this.lstParametros = Object.assign(data);
      this.lstPaisesFiltrados = Array.from(new Set(this.lstParametros.map(s => s.pais)))
      .map(id => {
        return {
          id: id,
          pais: this.lstParametros.find( s => s.pais === id).pais,
        }
      })
      console.log(this.lstPaisesFiltrados);
    }, error => {
      //this.loading.dismiss();
    });
  }
  obtenerClientes() {
    this.loading.present();
    this.clienteService.listaClientes().subscribe(data => {
      this.loading.dismiss();
      this.lstClientes = Object.assign(data);
    }, error => {
      this.loading.dismiss();
    });
  }
  obtenerFeriados() {
    //this.loading.present();
    this.feriadoService.listaFeriados().subscribe(data => {
      this.loading.dismiss();
      this.lstFeriados = Object.assign(data);
    }, error => {
      this.loading.dismiss();
    });
  }
  initValidaciones() {
    this.frmContrato = this.fb.group({
      vNombreCliente: ['', [
        Validators.required,
      ]],
      vConductora: ['', [
        Validators.required,
      ]],
      vPais: ['', [
        Validators.required,
      ]],
      vCiudad: ['', [
        Validators.required,
      ]],
      vFechaInicio: ['', [
        Validators.required,
      ]],
      vFechaFin: ['', [
        Validators.required,
      ]],
      vLatOrigen: ['', [
        Validators.required,
      ]],
      vLongOrigen: ['', [
        Validators.required,
      ]],
      vCantidadPasajeros: ['', [
        Validators.required,
      ]],
      vLatDestino: ['', [
        Validators.required,
      ]],
      vLongDestino: ['', [
        Validators.required,
      ]],
      vMontoTotal: ['', [
        Validators.required,
      ]],
      vDias: ['', [
        Validators.required,
      ]],
      vHora: ['', [
        Validators.required,
      ]],
      vTipoPago: ['', [
        Validators.required,
      ]],
      vEstadoPago: ['', [
        Validators.required,
      ]],

    })
  }
  get f() { return this.frmContrato.controls; }
  async irMapaOrigen() {
    const modal = await this.modalController.create({
      component: MapaPage
    }).then( dato => {
      dato.present();
      dato.onDidDismiss().then(resultado => {
        console.log(resultado.data);
        this.contrato.latOrigen = resultado.data.lat;
        this.contrato.longOrigen = resultado.data.lng;
      });
    });
  }
  async irMapaDestino() {
    const modal = await this.modalController.create({
      component: MapaPage
    }).then( dato => {
      dato.present();
      dato.onDidDismiss().then(resultado => {
        console.log(resultado.data);
        this.contrato.latDestino = resultado.data.lat;
        this.contrato.longDestino = resultado.data.lng;
      });
    });
  }
}

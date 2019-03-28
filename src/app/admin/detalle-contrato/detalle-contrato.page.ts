import { MdlContrato } from './../../modelo/mdlContrato';
import { MapaPage } from './../../comun/mapa/mapa.page';
import { NavParamService } from './../../services/nav-param.service';
import { NavController, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-contrato',
  templateUrl: './detalle-contrato.page.html',
  styleUrls: ['./detalle-contrato.page.scss'],
})
export class DetalleContratoPage implements OnInit {
  frmContrato: FormGroup;
  public contrato: MdlContrato = new MdlContrato(
    null, null, null, null, null, null, null,null, null, null, null,null,null,null,null,null
  );
  constructor(
    public fb: FormBuilder,
    public navController: NavController,
    public navParamService: NavParamService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.initValidaciones();
  }
  initValidaciones() {
    this.frmContrato = this.fb.group({
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

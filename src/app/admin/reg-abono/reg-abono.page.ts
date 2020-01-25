import { MdlCliente } from './../../modelo/mdlCliente';
import { NavParamService } from './../../services/nav-param.service';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/util/alert.service';
import { DepositoService } from './../../services/db/deposito.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MdlDepositos } from './../../modelo/mdlDepositos';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/util/loading.service';
import {MdlAbonos} from '../../modelo/mdlAbonos';
import {MdlConductora} from '../../modelo/mldConductora';
import { AbonoService } from 'src/app/services/db/abono.service';
@Component({
  selector: 'app-reg-abono',
  templateUrl: './reg-abono.page.html',
  styleUrls: ['./reg-abono.page.scss'],
})
export class RegAbonoPage implements OnInit {

  frmDeposito: FormGroup;
  public deposito: MdlAbonos;
  public conductora: MdlConductora;
  constructor(
    public fb: FormBuilder,
    public abonoService: AbonoService,
    public loadingServices: LoadingService,
    public alertService: AlertService,
    public navController: NavController,
    public navParams: NavParamService
  ) {
    this.conductora = this.navParams.get().conductora;
    if (this.navParams.get().deposito) {
      this.deposito = this.navParams.get().deposito;
    } else {
      this.deposito = new MdlAbonos(null, null, null, null, null, null);
    }
    this.deposito.idConductora = this.conductora.id;
  }

  ngOnInit() {
    this.iniciarValidaciones();
  }
  public iniciarValidaciones() {
    this.frmDeposito = this.fb.group({
      vTipo: ['', [
        Validators.required
      ]],
      vFecha: ['', [
        Validators.required
      ]],
      vMonto: ['', [
        Validators.required
      ]],
      vObservaciones: ['', [
        Validators.required
      ]]
    });
  }
  get f(): any { return this.frmDeposito.controls; }

  public grabar() {
    this.loadingServices.present();
      this.abonoService.insertarDeposito(this.deposito)
      .then(  () => {
        this.loadingServices.dismiss();
        this.alertService.present('Info', 'Datos guardados correctamente.');
        this.navController.navigateBack('detalle-conductora-admin');
      })
      .catch( error => {
        this.loadingServices.dismiss();
        this.alertService.present('Error', 'Hubo un error al grabar los datos.');
        this.navController.navigateRoot('/home');
      });
  }
}

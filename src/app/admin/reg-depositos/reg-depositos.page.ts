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

@Component({
  selector: 'app-reg-depositos',
  templateUrl: './reg-depositos.page.html',
  styleUrls: ['./reg-depositos.page.scss'],
})
export class RegDepositosPage implements OnInit {
  frmDeposito: FormGroup;
  public deposito: MdlDepositos;
  public cliente: MdlCliente;
  constructor(
    public fb: FormBuilder,
    public depositoService: DepositoService,
    public loadingServices: LoadingService,
    public alertService: AlertService,
    public navController: NavController,
    public navParams: NavParamService
  ) {
    this.cliente = this.navParams.get().cliente;
    if (this.navParams.get().deposito) {
      this.deposito = this.navParams.get().deposito;
    } else {
      this.deposito = new MdlDepositos(null, null, null, null, null, null, null);
      this.deposito.verificado = false;
    }
    this.deposito.idCliente = this.cliente.id;
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
      vVerificado: ['', [
        Validators.required,
      ]],
      vObservaciones: ['', [
        Validators.required
      ]]
    });
  }
  get f(): any { return this.frmDeposito.controls; }

  public grabar() {
    this.loadingServices.present();
      this.depositoService.insertarDeposito(this.deposito)
      .then(  () => {
        this.loadingServices.dismiss();
        this.alertService.present('Info', 'Datos guardados correctamente.');
        this.navController.navigateBack('reg-clientes');
      })
      .catch( error => {
        this.loadingServices.dismiss();
        this.alertService.present('Error', 'Hubo un error al grabar los datos.');
        this.navController.navigateRoot('/home');
      });
  }
}

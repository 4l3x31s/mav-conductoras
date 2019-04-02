import { MdlParametrosCarrera } from './../../modelo/mdlParametrosCarrera';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/services/util/loading.service';
import { AlertService } from 'src/app/services/util/alert.service';
import { NavController, ActionSheetController } from '@ionic/angular';
import { NavParamService } from 'src/app/services/nav-param.service';
import { ParametrosCarreraService } from 'src/app/services/db/parametros-carrera.service';

@Component({
  selector: 'app-reg-parametros',
  templateUrl: './reg-parametros.page.html',
  styleUrls: ['./reg-parametros.page.scss'],
})
export class RegParametrosPage implements OnInit {
  frmParametro: FormGroup;
  public parametroCarrera: MdlParametrosCarrera;
  constructor(
    public fb: FormBuilder,
    public loadingServices: LoadingService,
    public alertService: AlertService,
    public navController: NavController,
    public navParams: NavParamService,
    public actionSheetController: ActionSheetController,
    public parametrosService: ParametrosCarreraService
  ) {
    if (navParams.get().parametro) {
      this.parametroCarrera = this.navParams.get().parametro;
    } else {
      this.parametroCarrera = new MdlParametrosCarrera(null, null, null, null, null, null, null, null);
    }
  }

  ngOnInit() {
    this.iniciarValidaciones();
  }
  get f() { return this.frmParametro.controls; }
  public iniciarValidaciones() {
    this.frmParametro = this.fb.group({
      vCiudad: ['', [
        Validators.required
      ]],
      vPais: ['', [
        Validators.required
      ]],
      vBase: ['', [
        Validators.required
      ]],
      vCuotaSolicitud: ['', [
        Validators.required
      ]],
      vTarifaMinima: ['', [
        Validators.required
      ]],
      vTiempo: ['', [
        Validators.required
      ]],
      vDistancia: ['', [
        Validators.required
      ]]
    });
  }
  public grabar() {
    this.loadingServices.present();
      this.parametrosService.insertarParametro(this.parametroCarrera)
      .then(() => {
        this.loadingServices.dismiss();
        this.alertService.present('Info', 'Datos guardados correctamente.');
        this.navController.navigateBack('/lista-parametros');
      })
      .catch( error => {
        this.loadingServices.dismiss();
        console.log(error);
        this.alertService.present('Error', 'Hubo un error al grabar los datos');
        this.navController.navigateRoot('/home');
      });
  }
}

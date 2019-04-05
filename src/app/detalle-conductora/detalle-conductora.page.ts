import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MdlConductora } from '../modelo/mldConductora';
import { ConductoraService } from '../services/db/conductora.service';
import { AlertService } from '../services/util/alert.service';
import { LoadingService } from '../services/util/loading.service';
import { SesionService } from '../services/sesion.service';
import { NavController, ModalController } from '@ionic/angular';
import { NavParamService } from '../services/nav-param.service';
import { MapaPage } from '../comun/mapa/mapa.page';

@Component({
  selector: 'app-detalle-conductora',
  templateUrl: './detalle-conductora.page.html',
  styleUrls: ['./detalle-conductora.page.scss'],
})
export class DetalleConductoraPage implements OnInit {

  form: FormGroup;

  conductora: MdlConductora;

  constructor(
    public fb: FormBuilder,
    public conductoraService: ConductoraService,
    public alertService: AlertService,
    public loadingService: LoadingService,
    public sesionService: SesionService,
    public navController: NavController,
    public navParam: NavParamService,
    public modalController: ModalController,
  ) { }

  iniciarValidaciones() {
    this.form = this.fb.group({
      vnombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]],
      vpaterno: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50),
      ]],
      vmaterno: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50),
      ]],
      vfechanac: ['', [
        Validators.required
      ]],
      vci: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15),
      ]],
      vtipolicencia: ['', [
        Validators.required
      ]],
      vdireccion: ['', [
        Validators.minLength(4),
        Validators.maxLength(100),
      ]],
      vgenero: ['', [
        Validators.required
      ]],
      vnroctabancaria: ['', [
        Validators.minLength(4),
        Validators.maxLength(50),
      ]],
      vtelefono: ['', [
        Validators.minLength(7),
        Validators.maxLength(9),
      ]],
      vcelular: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
      ]],
      vnroresidencia: ['', [
        Validators.minLength(1),
        Validators.maxLength(10),
      ]],
      vuser: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
      ]],
      vpass: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
      ]],
    });
  }
  get f() { return this.form.controls; }

  ngOnInit() {
    this.iniciarValidaciones();
    if(this.navParam.get() && this.navParam.get().conductora){
      this.conductora = this.navParam.get().conductora;
    } else {
      this.conductora = new MdlConductora(
        null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null
      );
    }
  }

  grabar() {
    this.loadingService.present().then(() => {
      this.conductoraService.grabarConductora(this.conductora)
        .then((conductora) => {
          this.conductora=conductora;
          this.loadingService.dismiss();
          this.alertService.present('Info','Datos guardados correctamente.');
        })
        .catch(error => {
          this.loadingService.dismiss();
          console.log(error);
          this.alertService.present('Error','Hubo un error al grabar los datos');
          this.navController.navigateRoot('/home');
        });
    });
  }

  irDetalleVehiculo() {
    this.navParam.set({ conductora: this.conductora});
    this.navController.navigateForward('/detalle-vehiculo');
  }

  irDetalleImagenes(){
    this.navParam.set({conductora:this.conductora})
    this.navController.navigateForward('/detalle-imagenes-conductora');
  }

  async irGetCroquis(){
    await this.modalController.create({
      component: MapaPage
    }).then( dato => {
      dato.present();
      dato.onDidDismiss().then(resultado => {
        if(resultado.data && resultado.data.lat){
          this.conductora.lat = resultado.data.lat;
          this.conductora.long = resultado.data.lng;
        }
      });
    });
  }
}

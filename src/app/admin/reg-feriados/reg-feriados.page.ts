import { NavController, AlertController } from '@ionic/angular';
import { AlertService } from './../../services/util/alert.service';
import { MdlFeriado } from './../../modelo/mdlFeriado';
import { FeriadosService } from './../../services/db/feriados.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reg-feriados',
  templateUrl: './reg-feriados.page.html',
  styleUrls: ['./reg-feriados.page.scss'],
})
export class RegFeriadosPage implements OnInit {
  frmFeriados: FormGroup;
  public feriados: MdlFeriado = new MdlFeriado(null, null, null, null);
  constructor(
    public fb: FormBuilder,
    public feriadoService: FeriadosService,
    public alertController: AlertService,
    public navController: NavController,
    public alertCtrl: AlertController
  ) { }
  ngOnInit() {
    this.initValidaciones();
    this.feriados.estado = true;
  }
  get f() { return this.frmFeriados.controls; }
  initValidaciones() {
    this.frmFeriados = this.fb.group({
      vFechaFeriado: ['', [
        Validators.required,
      ]],
      vDescFeriado: ['', [
        Validators.required,
      ]],
      vEstado: ['', [
        Validators.required,
      ]]
    });
  }
  registroFeriados() {
    this.feriadoService.insertarFeriado(this.feriados).then(data => {
      this.presentConfirmation();
    }).catch(error => {
      this.alertController.present('Error', 'El dato no se pudo registrar.');
    });
  }
  async presentConfirmation() {
    const alert = await this.alertCtrl.create({
      header: 'Registro Exitoso',
      message: 'Quiere seguir registrando feriados?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.feriados.descFeriado = null;
            this.feriados.fecha = null;
            this.feriados.id = null;
          }
        },
        {
          text: 'No',
          handler: () => {
            this.navController.navigateForward('/home');
          }
        }
      ]
    });
    alert.present();
  }
}

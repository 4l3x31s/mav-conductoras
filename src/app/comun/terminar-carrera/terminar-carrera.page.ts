import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { MdlCarrera } from 'src/app/modelo/mdlCarrera';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CarreraService } from 'src/app/services/db/carrera.service';
import { AlertService } from 'src/app/services/util/alert.service';

@Component({
  selector: 'app-terminar-carrera',
  templateUrl: './terminar-carrera.page.html',
  styleUrls: ['./terminar-carrera.page.scss'],
})
export class TerminarCarreraPage implements OnInit {

  @Input()
  carrera: MdlCarrera;
  
  form: FormGroup;
  
  constructor(
    private modalCtrl: ModalController,
    public fb: FormBuilder,
    public alertController: AlertController,
    public carreraService: CarreraService,
    public alertService: AlertService
  ) { }

  ngOnInit() {
    this.carrera.califConductora = 3;
    this.iniciarValidaciones();
  }

  iniciarValidaciones() {
    this.form = this.fb.group({
      vcalifConductora: ['', [
        Validators.required,
      ]],
      vobservacion: ['', [
        Validators.required,
      ]],
    });
  }

  get f() { return this.form.controls; }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  async confirmarTerminar() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Desea terminar la carrera?',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancelar',
          cssClass: 'secondary',
          handler: (blah) => {
            //this.grabar();
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.terminar();
          }
        }
      ]
    });

    await alert.present();
  }
  terminar(){
    this.carreraService.terminarCarrera(this.carrera)
      .then(()=>{
        this.alertService.present('Información','Carrera Terminada');
        this.cerrar();
      });
  }

}

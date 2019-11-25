import { Observable } from 'rxjs';
import { MdlParametrosCarrera } from './../../modelo/mdlParametrosCarrera';
import { LoadingService } from 'src/app/services/util/loading.service';
import { MdlCliente } from 'src/app/modelo/mdlCliente';
import { ClienteService } from './../../services/db/cliente.service';
import { ConductoraService } from './../../services/db/conductora.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { MdlCarrera } from 'src/app/modelo/mdlCarrera';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CarreraService } from 'src/app/services/db/carrera.service';
import { AlertService } from 'src/app/services/util/alert.service';
import { PushNotifService } from 'src/app/services/push-notif.service';
import { ParametrosCarreraService } from 'src/app/services/db/parametros-carrera.service';
import * as _ from 'lodash';
declare var google;

@Component({
  selector: 'app-terminar-carrera',
  templateUrl: './terminar-carrera.page.html',
  styleUrls: ['./terminar-carrera.page.scss'],
})
export class TerminarCarreraPage implements OnInit {

  @Input() carrera: MdlCarrera;
  @Input() motivo: boolean;
  
  public lstParametrosCarrera: MdlParametrosCarrera [] = [];
  public lstFiltroParametrosCarrera: MdlParametrosCarrera [] = [];
  public parametroCarrera: MdlParametrosCarrera;
  form: FormGroup;
  filtros = {};
  distance: any;

  constructor(
    private modalCtrl: ModalController,
    public fb: FormBuilder,
    public alertController: AlertController,
    public carreraService: CarreraService,
    public alertService: AlertService,
    public clienteService: ClienteService,
    public pushNotifService: PushNotifService,
    public loadingService: LoadingService,
    public parametrosCarreraService: ParametrosCarreraService
  ) { }

  ngOnInit() {
    if(this.motivo){
      this.iniciarValidaciones();
      navigator.geolocation.getCurrentPosition((resp) => {
        this.carrera.latFin = resp.coords.latitude;
        this.carrera.longFin = resp.coords.longitude;
        this.determinarDistanciaTiempo();
      }, (error) => {
        this.loadingService.dismiss();
      }, { enableHighAccuracy: true });
      this.carrera.costo = 0;
      this.carrera.califConductora = 0;
    } else {
      this.distance = new google.maps.DistanceMatrixService();
      this.carrera.califConductora = 3;
      this.iniciarValidaciones();
      navigator.geolocation.getCurrentPosition((resp) => {
        this.carrera.latFin = resp.coords.latitude;
        this.carrera.longFin = resp.coords.longitude;
        this.determinarDistanciaTiempo();
      }, (error) => {
        this.loadingService.dismiss();
      }, { enableHighAccuracy: true });
    }
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

  get f(): any { return this.form.controls; }

  cerrar() {
    this.modalCtrl.dismiss();
  }
  async confirmarBorrar(){
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Desea borrar la carrera?',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancelar',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.borrar();
          }
        }
      ]
    });

    await alert.present();
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
  borrar(){
    this.carreraService.borrarCarrera(this.carrera, this.carrera.obsConductora).then(()=>{
      this.alertService.present('Información', 'Carrera Eliminada');
      this.cerrar();
    });
  }

  terminar() {
    this.clienteService.getCliente(this.carrera.idConductora).subscribe( data => {
      let cliente: MdlCliente = data;
      if (cliente.ui) {
        let notificaciones = {
          notification:{
            title: 'Mujeres al Volante',
            body: 'La carrera que tenias terminó!!!!',
            sound: 'default',
            click_action: 'FCM_PLUGIN_ACTIVITY',
            icon: 'fcm_push_icon'
          },
          data: {
            landing_page: 'home',
          },
          to: cliente.ui,
          priority: 'high',
          restricted_package_name: ''
        };
        this.pushNotifService.postGlobal(notificaciones, '')
        .subscribe(response => {
        });
      }
    });
    this.carreraService.terminarCarrera(this.carrera).then(()=>{
      this.alertService.present('Información', 'Carrera Terminada');
      this.cerrar();
    });
  }

  public async determinarDistanciaTiempo() {
    let responseMatrix: google.maps.DistanceMatrixRequest;
    responseMatrix = {
      origins:
        [{
            lat: Number(this.carrera.latInicio),
            lng: Number(this.carrera.longInicio)
        }],
      destinations:
        [{
            lat: Number(this.carrera.latFin),
            lng: Number(this.carrera.longFin)
        }],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      durationInTraffic: false,
      avoidHighways: false,
      avoidTolls: false
    };
    this.parametrosPorPais(this.carrera.pais.toUpperCase(), responseMatrix);
  }

  public parametrosPorPais(pais: string, responseMatrix: any) {
    this.loadingService.present();    
    this.parametrosCarreraService.getParametrosPorPais(pais).subscribe( data => {
      this.loadingService.dismiss();
      this.lstParametrosCarrera = Object.assign(data);
      this.filtrar('ciudad', this.carrera.ciudad.toUpperCase(), responseMatrix);
    },  error => {
      this.loadingService.dismiss();
    });
  }

  public filtrar(atributo: string, valor: any, responseMatrix: any) {
    this.filtros[atributo] = val => val == valor;
    this.lstFiltroParametrosCarrera = _.filter(this.lstParametrosCarrera, _.conforms(this.filtros) );
    this.parametroCarrera = this.lstFiltroParametrosCarrera[0];
    let datos = this.getDistanceMatrix(responseMatrix);
    datos.subscribe(data => {
        const origins = data.originAddresses;
        for (let i = 0; i < origins.length; i++) {
            const results = data.rows[i].elements;
            for (let j = 0; j < results.length; j++) {
                const element = results[j];
                const distance = element.distance.value;
                const time = element.duration.value;
                // calcular costos UBER: https://calculouber.netlify.com/
                let montoFinal: number = (Math.round((this.parametroCarrera.base + ((element.duration.value / 60) * this.parametroCarrera.tiempo) + ((element.distance.value / 1000) * this.parametroCarrera.distancia))* this.parametroCarrera.tarifaDinamica) + this.parametroCarrera.cuotaSolicitud);
                if (montoFinal < 10) {
                    this.carrera.costo = 10;
                } else {
                    this.carrera.costo = montoFinal;
                }
                console.log(this.carrera.costo);
            }
        }
    });
  }

  getDistanceMatrix(req: google.maps.DistanceMatrixRequest): Observable<google.maps.DistanceMatrixResponse> {
    return Observable.create((observer) => {
      this.distance.getDistanceMatrix(req, (rsp, status) => {
        observer.next(rsp);
        observer.complete();
      });
    });
  }
}

import { AlertService } from 'src/app/services/util/alert.service';
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
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FeriadosService } from 'src/app/services/db/feriados.service';
import { LoadingService } from 'src/app/services/util/loading.service';
import { MdlParametrosCarrera } from 'src/app/modelo/mdlParametrosCarrera';
declare var google;

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
  public ciudadSeleccionada: string;
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
    public navParams: NavParamService,
    public alertService: AlertService,
    public alertController: AlertController
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
    this.ciudadSeleccionada = event;
    this.contrato.idConductora = null;
    this.lstConductoras = undefined;
    this.conductoraService.getConductoraPorPaisCiudad(this.contrato.pais, event)
        .subscribe(conductora => {
          this.lstConductoras = undefined;
          if (conductora) {
            this.lstConductoras = conductora;
          }
          console.log('datos conductoras');
          console.log(this.lstConductoras);
        }, error => {
          this.lstConductoras = undefined;
        });
  }
  grabar() {
    if (this.lstConductoras) {
      //TODO: Validaciones de guardado acá.
    } else {
      this.alertService.present('Alerta',
            'No existe una conductora seleccionada o no existen conductoras disponibles para la radicatoria.');
    }
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
      vNombreCliente: ['', []],
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
  async presentAlertCheckbox() {
    const alert = await this.alertController.create({
      header: 'Días',
      inputs: [
        {
          name: 'lunes',
          type: 'checkbox',
          label: 'Lunes',
          value: 'LU',
          checked: true
        },

        {
          name: 'martes',
          type: 'checkbox',
          label: 'Martes',
          value: 'MA'
        },

        {
          name: 'miercoles',
          type: 'checkbox',
          label: 'Miércoles',
          value: 'MI'
        },

        {
          name: 'jueves',
          type: 'checkbox',
          label: 'Jueves',
          value: 'JU'
        },

        {
          name: 'viernes',
          type: 'checkbox',
          label: 'Viernes',
          value: 'VI'
        },

        {
          name: 'sabado',
          type: 'checkbox',
          label: 'Sábado',
          value: 'SA'
        },
        {
          name: 'domingo',
          type: 'checkbox',
          label: 'Domingo',
          value: 'DO'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            console.log(data);
            this.contrato.dias = null;
            for (let i = 0; i < data.length; i++) {
              if (this.contrato.dias) {
                this.contrato.dias = this.contrato.dias + ',' + data[i];
              } else {
                this.contrato.dias = data[i];
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }
  public determinarDistanciaTiempo() {
    console.log('ingresa calcula tiempo');
    if(this.lstCiudadesFiltrado){
    let distance = new google.maps.DistanceMatrixService();
    distance.getDistanceMatrix({
      origins:
      [{
        lat: Number(this.contrato.latOrigen),
        lng: Number(this.contrato.longOrigen)
      }],
      destinations:
      [{
        lat: Number(this.contrato.latDestino),
        lng: Number(this.contrato.longDestino)
      }],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC,
      durationInTraffic: false,
      avoidHighways: false,
      avoidTolls: false
    }, function (response, status) {
      console.log('entra acá');
      console.log(response);
      console.log(status);
      if (status === 'OK') {
        let origins = response.originAddresses;
        let destinations = response.destinationAddresses;
        for (let i = 0; i < origins.length; i++) {
          let results = response.rows[i].elements;
          for (let j = 0; j < results.length; j++) {
            let element = results[j];
            let distance = element.distance.text;
            let time = element.duration.text;
            console.log(distance, time);
            /*
            this.lstCiudadesFiltrado = this.lstParametros.filter(
              parametros => parametros.pais.indexOf(event) > -1
            );
            */
            let ciudadParametro: MdlParametrosCarrera[] = this.lstCiudadesFiltrado.filter(
              parametros => parametros.ciudad.indexOf(this.ciudadSeleccionada) > -1
            );
            let montoFinal: number = (ciudadParametro[0].base + (element.duration.value * ciudadParametro[0].tiempo) + (element.distance.value * ciudadParametro[0].distancia));
            console.log(montoFinal);
            this.contrato.montoTotal = montoFinal;
          }
        }
      }
    }
    );
  } else {
    // TODO: decir que no hay que calcular sin conductoras
  }
}


}

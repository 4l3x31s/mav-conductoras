import { ConductoraService } from './../../services/db/conductora.service';
import { DataUtilService } from 'src/app/services/util/data-util.service';
import { MdlConductora } from 'src/app/modelo/mldConductora';
import { MapaPage } from './../../comun/mapa/mapa.page';
import { Observable } from 'rxjs';
import { ClienteService } from './../../services/db/cliente.service';
import { MdlCarrera } from 'src/app/modelo/mdlCarrera';
import { MdlCliente } from 'src/app/modelo/mdlCliente';
import { MdlParametrosCarrera } from './../../modelo/mdlParametrosCarrera';
import { FormGroup, Validators } from '@angular/forms';
import { MapParamService } from './../../services/map-param.service';
import { NavParamService } from './../../services/nav-param.service';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { AlertService } from './../../services/util/alert.service';
import { LoadingService } from 'src/app/services/util/loading.service';
import { CarreraService } from './../../services/db/carrera.service';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SesionService } from 'src/app/services/sesion.service';
import { ParametrosCarreraService } from 'src/app/services/db/parametros-carrera.service';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var google;

@Component({
  selector: 'app-mod-carrera',
  templateUrl: './mod-carrera.page.html',
  styleUrls: ['./mod-carrera.page.scss'],
})
export class ModCarreraPage implements OnInit {
  frmCarrera: FormGroup;

  public lstParametrosCarrera: MdlParametrosCarrera [] = [];
  public lstFiltroParametrosCarrera: MdlParametrosCarrera [] = [];
  public parametroCarrera: MdlParametrosCarrera;
  public cliente: MdlCliente;
  public carrera: MdlCarrera;
  public fechaMin: string;
  public lstParametros: MdlParametrosCarrera [] = [];
  public lstCiudadesFiltrado: MdlParametrosCarrera [] = [];
  public lstPaisesFiltrados = [];
  public ciudadSeleccionada: string;
  public lstConductoras: MdlConductora[] = [];
  public lstConcudtorasFiltrado: MdlConductora[] = [];
  pais: string;
  ciudad: string;
  distance: any;
  filtros = {};
  constructor(
    public fb: FormBuilder,
    public carreraService: CarreraService,
    public loadingServices: LoadingService,
    public alertService: AlertService,
    public navController: NavController,
    public modalController: ModalController,
    public sesionService: SesionService,
    public navParams: NavParamService,
    public alertController: AlertController,
    public mapParamService: MapParamService,
    public parametrosCarreraService: ParametrosCarreraService,
    public clienteService: ClienteService,
    public dataUtilService: DataUtilService,
    public conductoraService: ConductoraService,
  ) {
      this.carrera = this.navParams.get();
      this.fechaMin = moment().format('YYYY-MM-DD');
      this.carrera.moneda = 'Bolivianos';
      this.validarLugar();
      this.distance = new google.maps.DistanceMatrixService();
  }
  get f(): any { return this.frmCarrera.controls; }
  ngOnInit() {
    this.iniciarValidaciones();
    this.clienteService.getCliente(this.carrera.idUsuario)
    .subscribe(cliente => {
      this.cliente = cliente;
      this.determinarDistanciaTiempo();
    }, error => {
    })

  }
  validarLugar() {
    let mylocation = new google.maps.LatLng(this.carrera.latInicio, this.carrera.longInicio);
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': mylocation}, (results, status) => {
      if (status === 'OK') {
            this.processLocation(results);
          }
    })
  }
  public filtrarContrato(atributo: string, valor: any) {
    this.filtros[atributo] = val => val == valor;
    this.lstConcudtorasFiltrado = _.filter(this.lstConductoras, _.conforms(this.filtros) );
  }
  processLocation(location) {
    if (location[1]) {
      for (var i = 0; i < location.length; i++) {
        if (location[i].types[0] === 'locality') {
          console.log(location[i]);
          this.ciudad = location[i].address_components[0].short_name;
          this.pais = location[i].address_components[3].long_name;
          this.seleccionarCiudad();
          this.obtenerParametros();
          this.parametrosPorPais(this.pais);
        }
      }
    }
  }
  public iniciarValidaciones(){
    this.frmCarrera = this.fb.group({
      vdescLugar: ['', [
        Validators.required,
      ]],
      vmoneda: ['', [
        Validators.required,
      ]],
      vfechaInicio: ['', [
        Validators.required,
      ]],
      vtipoPago: ['', [
        Validators.required,
      ]],
      vConductora: ['', [
          Validators.required,
      ]],
    })
  }
  
  async validarHoraPeticionCarrera() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'No puede registrar una hora menor a la actual.',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  async confirmarFecha() {
    let fechaCarrera =  moment(this.carrera.fechaInicio).toObject();
    let fechaCarreraMoment = moment(fechaCarrera);
    let fechaActual = moment().format();
    let mensaje = null;
    
      
      const alert = await this.alertController.create({
        header: 'Confirmar',
        message: 'Desea crear la carrera en:  <br>' + 
                 'Fecha:  <strong>' + fechaCarrera.date  + '/' + (fechaCarrera.months + 1) + '/'+ fechaCarrera.years +'</strong> <br> '+ 
                 'Hora :  <strong>' + fechaCarrera.hours + ':' + fechaCarrera.minutes + ' ? </strong>',
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
              this.carrera.estado = 2;
              this.grabar();
            }
          }
        ]
      });

      await alert.present();
    //}
  }

  public grabar(){
    this.loadingServices.present();
    //var identificadorPrueba = Date.now();
    this.carrera.idUsuario = this.cliente.id;
    this.carrera.estado = 2;
    this.carrera.nombreCliente = this.cliente.nombre;
    this.filtrarContrato('id', this.carrera.idConductora);
    this.carrera.nombreConductora = this.lstConcudtorasFiltrado[0].nombre
                                    + this.lstConcudtorasFiltrado[0].paterno
                                    + this.lstConcudtorasFiltrado[0].materno;


      this.carreraService.crearCarrera(this.carrera)
      .then(() => {
        this.loadingServices.dismiss();
        this.alertService.present('Información', 'Datos guardados correctamente.');
        this.carrera = this.carreraService.getCarreraSesion();
      })
      .catch( error => {
        this.loadingServices.dismiss();
        this.alertService.present('Error', 'Hubo un error al grabar los datos');
      });
      this.navController.back();
      //this.navController.navigateRoot('/home-admin');

  }

  async irMapaOrigen() {

    let ubicacion: any = { lat: this.carrera.latInicio, lng: this.carrera.longInicio};
    this.mapParamService.set(ubicacion);
    const modal = await this.modalController.create({
      component: MapaPage
    }).then( dato => {
      dato.present();
      dato.onDidDismiss().then(resultado => {
        this.carrera.latInicio = resultado.data.lat;
        this.carrera.longInicio = resultado.data.lng;
        //calcular costo
        this.determinarDistanciaTiempo();
      });
    });
  }
  filtrarCiudades(event) {
    this.lstCiudadesFiltrado = this.lstParametros.filter(
        parametros => parametros.pais.indexOf(event) > -1
    );
  }

  seleccionarCiudad() {
    this.ciudadSeleccionada = this.ciudad;
    this.conductoraService.getConductoraPorPaisCiudad(this.pais.toUpperCase(), this.ciudad.toUpperCase())
        .subscribe(conductora => {
            if (conductora) {
                this.lstConductoras = conductora;
                this.dataUtilService.set(this.lstConductoras);
            }
        }, error => {
            this.lstConductoras = undefined;
        });
  }

  async irMapaDestino() {
    let ubicacion: any = { lat: this.carrera.latFin, lng: this.carrera.longFin};
    this.mapParamService.set(ubicacion);
    const modal = await this.modalController.create({
        component: MapaPage
    }).then(dato => {
        dato.present();
        dato.onDidDismiss().then(resultado => {
          this.carrera.latFin = resultado.data.lat;
          this.carrera.longFin = resultado.data.lng;
          //calcular costo
          this.determinarDistanciaTiempo();
        });
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
                let montoFinal: number = Math.round((this.parametroCarrera.base + ((element.duration.value / 60) * this.parametroCarrera.tiempo) + ((element.distance.value / 1000) * this.parametroCarrera.distancia))* this.parametroCarrera.tarifaDinamica + this.parametroCarrera.cuotaSolicitud);
               
                if (montoFinal < 10) {
                    this.carrera.costo = 10;
                } else {
                    this.carrera.costo = montoFinal;
                }
            }
        }
    });
  }

  
  async obtenerParametros() {
    this.loadingServices.present();
    await this.parametrosCarreraService.listarParametros().subscribe(data => {
        // this.loading.dismiss();
        this.lstParametros = Object.assign(data);
        this.lstPaisesFiltrados = Array.from(new Set(this.lstParametros.map(s => s.pais)))
            .map(id => {
                return {
                    id: id,
                    pais: this.lstParametros.find(s => s.pais === id).pais,
                };
            });
    }, error => {
        // this.loading.dismiss();
    });
}
  public parametrosPorPais(pais: string) {
    this.loadingServices.present();    
    this.parametrosCarreraService.getParametrosPorPais(pais).subscribe( data => {
      this.loadingServices.dismiss();
      this.lstParametrosCarrera = Object.assign(data);
      this.lstParametros = Object.assign(data);
      this.filtrar('ciudad',this.ciudad.toUpperCase());
    },  error => {
      this.loadingServices.dismiss();
    });
  }

  public filtrar(atributo: string, valor: any) {
    this.filtros[atributo] = val => val == valor;
    this.lstFiltroParametrosCarrera = _.filter(this.lstParametrosCarrera, _.conforms(this.filtros) );
    this.parametroCarrera = this.lstFiltroParametrosCarrera[0];
  }

  getDistanceMatrix(req: google.maps.DistanceMatrixRequest): Observable<google.maps.DistanceMatrixResponse> {
    return Observable.create((observer) => {
        this.distance.getDistanceMatrix(req, (rsp, status) => {
            // status checking goes here
            observer.next(rsp);
            observer.complete();
        });
    });
  }


}

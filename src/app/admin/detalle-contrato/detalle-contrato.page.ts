/// <reference types='@types/googlemaps' />


import { ActionSheetController } from '@ionic/angular';

import { MapParamService } from './../../services/map-param.service';

import {AlertService} from 'src/app/services/util/alert.service';
import {ParametrosCarreraService} from './../../services/db/parametros-carrera.service';
import {MdlFeriado} from './../../modelo/mdlFeriado';
import {MdlCliente} from './../../modelo/mdlCliente';
import {MdlConductora} from './../../modelo/mldConductora';
import {CarreraService} from './../../services/db/carrera.service';
import {ClienteService} from './../../services/db/cliente.service';
import {ConductoraService} from './../../services/db/conductora.service';
import {MdlContrato} from './../../modelo/mdlContrato';
import {MapaPage} from './../../comun/mapa/mapa.page';
import {NavParamService} from './../../services/nav-param.service';
import {NavController, ModalController, AlertController} from '@ionic/angular';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {FeriadosService} from 'src/app/services/db/feriados.service';
import {LoadingService} from 'src/app/services/util/loading.service';
import {MdlParametrosCarrera} from 'src/app/modelo/mdlParametrosCarrera';
import {DataUtilService} from 'src/app/services/util/data-util.service';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import { ContratoService } from './../../services/db/contrato.service';
import { MdlCarrera } from 'src/app/modelo/mdlCarrera';
import * as _ from 'lodash';


declare var google: any;

@Component({
    selector: 'app-detalle-contrato',
    templateUrl: './detalle-contrato.page.html',
    styleUrls: ['./detalle-contrato.page.scss'],
})
export class DetalleContratoPage implements OnInit {
    frmContrato: FormGroup;
    public contrato: MdlContrato = new MdlContrato(
        null, null, null, null, null, null, null, null
        , null, null, null, null, null, null, null, null
        , null, null, null, null, null, null
    );
    public lstConductoras: MdlConductora[] = [];
    public lstClientes: MdlCliente[] = [];
    public lstFeriados: MdlFeriado[] = [];
    public lstParametros: MdlParametrosCarrera [] = [];
    public lstCiudadesFiltrado: MdlParametrosCarrera [] = [];
    public lstPaisesFiltrados = [];
    public cliente: MdlCliente;
    public ciudadSeleccionada: string;
    public txtDescripcionLugar: string;
    public esNuevo: boolean = true;
    public opcionElegida: number = 0;

    public numDias: Array<any> = [];
    public diasArray: Array<any> = [];

    public costoTotal: number = 0;
    public lstCarreras: Array<MdlCarrera> = [];

    private esVuelta: boolean = false;
    filtros = {}
    public lstConcudtorasFiltrado: MdlConductora[] = [];
    // directionsService = new google.maps.DirectionsService;
    // directionsDisplay = new google.maps.DirectionsRenderer;
    distance: any;
    public conductora: MdlConductora = new MdlConductora(null,null,null,null,null,null,null,null,
        null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);

    direccionIni: any = 'Donde te encontramos?';
    direccionFin: any = 'A donde quieres ir?';

    constructor(public fb: FormBuilder,
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
                public alertController: AlertController,
                public dataUtilService: DataUtilService,
                public contratoService: ContratoService,
                public mapParamService: MapParamService,
                public actionSheetController: ActionSheetController
                ) {
        this.cliente = this.navParams.get().cliente;
        this.distance = new google.maps.DistanceMatrixService();
        this.txtDescripcionLugar = "Registrado en la Carrera";
        if (navParams.get().contrato) {
            this.esNuevo = false;
            this.contrato = this.navParams.get().contrato;
            this.direccionIni = this.contrato.dirOrigen;
            this.direccionFin = this.contrato.dirDestino;
            
        } else {
            this.esNuevo = true;
            this.contrato = new MdlContrato(null, null, null, null,
                null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            this.contrato.fechaInicio = moment().format();
        }
        this.contrato.idUsuario = this.cliente.id;
        
    }

    ngOnInit() {
        this.contrato.codigoContrato = 'MAV-LPZ-';
        this.initValidaciones();
        // this.obtenerClientes();
        this.obtenerParametros();
        // this.obtenerConductoras();
        this.obtenerFeriados();
        
    }

    filtrarCiudades(event) {
        
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
                    this.dataUtilService.set(this.lstConductoras);
                }
                
            }, error => {
                this.lstConductoras = undefined;
            });
    }
    public filtrarContrato(atributo: string, valor: any) {
        this.filtros[atributo] = val => val == valor;
        this.lstConcudtorasFiltrado = _.filter(this.lstConductoras, _.conforms(this.filtros) );
        
    }
    async modificarCarreras() {
        
        await this.eliminarCarrerasContrato();
        this.realizarContrato();
    }
    async eliminarCarrerasContrato() {
        await this.carreraService.getCarrerasPorContrato(this.contrato.id)
        .then(lisCarreras => {
            let filtro = {};
            filtro['fechaInicio'] = val => val >= this.contrato.fechaInicio;
            let lstCarrerasFiltrado: MdlCarrera[] = _.filter(lisCarreras, _.conforms(filtro));
            for (const item of lstCarrerasFiltrado) {
                this.carreraService.eliminarCarrera(item.id);
            }
        });
    }
    obtenerCostoCarreras() {
        console.log("asi funciona");
        if(this.contrato.dias !== null && this.contrato.dias.length>0) {
        this.lstCarreras = [];
        let numeroDias =[];
        let fechaSinFormato = moment(this.contrato.fechaInicio).toObject();
        let fechaIMoment = moment(this.contrato.fechaInicio);
        let fechaFMoment = moment(this.contrato.fechaFin);
        let duracion = moment.duration(fechaIMoment.diff(fechaFMoment));
        let dias = duracion.asDays();
        let finalDias = dias * -1;
        
        let diasObt = this.contrato.dias.split(',');
        
        for (let di of diasObt) {
            switch (di) {
                case 'LU':
                    numeroDias.push(1);
                break;
                case 'MA':
                    numeroDias.push(2);
                break;
                case 'MI':
                    numeroDias.push(3);
                break;
                case 'JU':
                    numeroDias.push(4);
                break;
                case 'VI':
                    numeroDias.push(5);
                break;
                case 'SA':
                    numeroDias.push(6);
                break;
                case 'DO':
                    numeroDias.push(0);
                break;
                default:
                break;
            }
        }
        
        let enteroDias = Math.floor(finalDias);
        let decimalDias = finalDias - enteroDias;
        if (decimalDias < 0.5) {
            enteroDias = enteroDias + 1;
            finalDias = enteroDias;
        }
        let costoFinal = 0;
        for (let i = 0; i <= finalDias; i++) {
            let fechaModificada: any;
            if (i === 0) {
                fechaModificada = fechaIMoment.add(0, 'd');
            } else {
                fechaModificada = fechaIMoment.add(1, 'd');
            }
            for (let numDi of numeroDias) {
                let numSelecDia = fechaModificada.day();

                if (numSelecDia === numDi) {
                    costoFinal = costoFinal + this.contrato.montoTotal;
                }
            }
        }
        this.costoTotal = costoFinal;
    }
}

costoChange(event) {
    
    console.log("asi funciona");
    if(this.contrato.dias !== null && this.contrato.dias.length>0) {
    this.lstCarreras = [];
    let numeroDias =[];
    let fechaSinFormato = moment(this.contrato.fechaInicio).toObject();
    let fechaIMoment = moment(this.contrato.fechaInicio);
    let fechaFMoment = moment(this.contrato.fechaFin);
    let duracion = moment.duration(fechaIMoment.diff(fechaFMoment));
    let dias = duracion.asDays();
    let finalDias = dias * -1;
    
    let diasObt = this.contrato.dias.split(',');
    
    for (let di of diasObt) {
        switch (di) {
            case 'LU':
                numeroDias.push(1);
            break;
            case 'MA':
                numeroDias.push(2);
            break;
            case 'MI':
                numeroDias.push(3);
            break;
            case 'JU':
                numeroDias.push(4);
            break;
            case 'VI':
                numeroDias.push(5);
            break;
            case 'SA':
                numeroDias.push(6);
            break;
            case 'DO':
                numeroDias.push(0);
            break;
            default:
            break;
        }
    }
    
    let enteroDias = Math.floor(finalDias);
    let decimalDias = finalDias - enteroDias;
    if (decimalDias < 0.5) {
        enteroDias = enteroDias + 1;
        finalDias = enteroDias;
    }
    let costoFinal = 0;
    for (let i = 0; i <= finalDias; i++) {
        let fechaModificada: any;
        if (i === 0) {
            fechaModificada = fechaIMoment.add(0, 'd');
        } else {
            fechaModificada = fechaIMoment.add(1, 'd');
        }
        for (let numDi of numeroDias) {
            let numSelecDia = fechaModificada.day();

            if (numSelecDia === numDi) {
                costoFinal = costoFinal + parseInt(event);
            }
        }
    }
    this.costoTotal = costoFinal;
}
}
    async realizarContrato() {
        this.lstCarreras = [];
        this.numDias = [];
        let fechaSinFormato = moment(this.contrato.fechaInicio).toObject();
        let fechaIMoment = moment(this.contrato.fechaInicio);
        let fechaFMoment = moment(this.contrato.fechaFin);
        let duracion = moment.duration(fechaIMoment.diff(fechaFMoment));
        let dias = duracion.asDays();
        let finalDias = dias * -1;
      
        this.diasArray = this.contrato.dias.split(',');

        for (let di of this.diasArray) {
            switch (di) {
                case 'LU':
                this.numDias.push(1);
                break;
                case 'MA':
                this.numDias.push(2);
                break;
                case 'MI':
                this.numDias.push(3);
                break;
                case 'JU':
                this.numDias.push(4);
                break;
                case 'VI':
                this.numDias.push(5);
                break;
                case 'SA':
                this.numDias.push(6);
                break;
                case 'DO':
                this.numDias.push(0);
                break;
                default:
                break;
            }
        }
        
        
        let carrera: MdlCarrera = new MdlCarrera(
            null, null, null, null, null,
            null, null, null, null, null,
            null, null, null, null, null,
            null, null, null, null, null,
            null, null, null, null, null, null);

        this.filtrarContrato('id', this.contrato.idConductora);
        let enteroDias = Math.floor(finalDias);
        let decimalDias = finalDias - enteroDias;
        if (decimalDias < 0.5) {
            enteroDias = enteroDias + 1;
            finalDias = enteroDias;
        }
        for (let i = 0; i <= finalDias; i++) {
            let fechaModificada: any;
            if (i === 0) {
                fechaModificada = fechaIMoment.add(0, 'd');
            } else {
                fechaModificada = fechaIMoment.add(1, 'd');
            }
            for (let numDi of this.numDias) {
                let numSelecDia = fechaModificada.day();
             
                if (numSelecDia === numDi) {
                    carrera = new MdlCarrera(
                        null, null, null, null, null,
                        null, null, null, null, null,
                        null, null, null, null, null,
                        null, null, null, null, null,
                        null, null, null, null,null, null);
                    //carrera.id = Date.now();
                    
                    carrera.idConductora = Number(this.contrato.idConductora);
                    carrera.idUsuario = this.contrato.idUsuario;
                    carrera.latInicio = this.contrato.latOrigen;
                    carrera.longInicio = this.contrato.longOrigen;
                    carrera.latFin = this.contrato.latDestino;
                    carrera.longFin = this.contrato.longDestino;
                    carrera.costo = this.contrato.montoTotal;
                    carrera.moneda = 'BS';
                    carrera.descLugar = this.txtDescripcionLugar;
                    carrera.fechaInicio = fechaModificada.format();
                    carrera.tipoPago = this.contrato.tipoPago;
                    carrera.estado = 2;
                    carrera.nombreCliente = this.cliente.nombre;
                    carrera.nombreConductora = this.lstConcudtorasFiltrado[0].nombre + ' ' + this.lstConcudtorasFiltrado[0].paterno;
                    carrera.pais = this.contrato.pais;
                    carrera.ciudad = this.contrato.ciudad;
                    this.lstCarreras.push(carrera);
                }
            }
        }
        this.contrato.idConductora = Number(this.contrato.idConductora);
       this.contrato.codigoContrato = this.contrato.codigoContrato + '-' + this.contrato.id;
        await this.contratoService.insertarContrato(this.contrato)
        .then( async data => {
            
            for (let carrera of this.lstCarreras) {
                carrera.idContrato = this.contrato.id;
                await this.carreraService.crearCarreraAsync(carrera)
                .then( carreraInsertada => {
                }).catch(err => {
                    
                });
            }
            this.loading.dismiss();
            await this.alertService.present('Info', 'Las carreras fueron registradas correctamente.').then( async () => {
                await this.navController.navigateForward('/lista-clientes');
            });
        });
    }
    async grabar() {
        if(this.direccionIni === 'Donde te encontramos?'){
            this.alertService.present('Alerta', 'Debes ingresar la direccion de inicio.');
            return;
        }
        if(this.direccionFin === 'A donde quieres ir?') {
            this.alertService.present('Alerta', 'Debes ingresar la direccion de destino.');
            return;
        }

        this.contrato.dirOrigen = this.direccionIni;
        this.contrato.dirDestino = this.direccionFin;
        this.lstCarreras = [];
        this.numDias = [];
        
        if (this.lstConductoras) {
            // TODO: Validaciones de guardado acá.
        } else {
            this.alertService.present('Alerta',
                'No existe una conductora seleccionada o no existen conductoras disponibles para la radicatoria.');
                return;
        }
        this.loading.present();
        this.obtenerCostoCarreras();
        let fechaSinFormato = moment(this.contrato.fechaInicio).toObject();
        let fechaIMoment = moment(this.contrato.fechaInicio);
        let fechaFMoment = moment(this.contrato.fechaFin);
        let duracion = moment.duration(fechaIMoment.diff(fechaFMoment));
        let dias = duracion.asDays();
        let finalDias = dias * -1;
       
        this.diasArray = this.contrato.dias.split(',');
        
        for (let di of this.diasArray) {
            switch (di) {
                case 'LU':
                this.numDias.push(1);
                break;
                case 'MA':
                this.numDias.push(2);
                break;
                case 'MI':
                this.numDias.push(3);
                break;
                case 'JU':
                this.numDias.push(4);
                break;
                case 'VI':
                this.numDias.push(5);
                break;
                case 'SA':
                this.numDias.push(6);
                break;
                case 'DO':
                this.numDias.push(0);
                break;
                default:
                break;
            }
        }
     
        let carrera: MdlCarrera = new MdlCarrera(
            null, null, null, null, null,
            null, null, null, null, null,
            null, null, null, null, null,
            null, null, null, null, null,
            null, null, null, null, null, null);

            this.filtrarContrato('id', this.contrato.idConductora);

        for (let i = 0; i <= finalDias; i++) {
            let fechaModificada: any;
            if (i === 0) {
                fechaModificada = fechaIMoment.add(0, 'd');
            } else {
                fechaModificada = fechaIMoment.add(1, 'd');
            }
            for (let numDi of this.numDias) {
                let numSelecDia = fechaModificada.day();
                
                if (numSelecDia === numDi) {
                    carrera = new MdlCarrera(
                        null, null, null, null, null,
                        null, null, null, null, null,
                        null, null, null, null, null,
                        null, null, null, null, null,
                        null, null, null, null,null, null);
                    //carrera.id = Date.now();
                    
                    carrera.idConductora = Number(this.contrato.idConductora);
                    carrera.idUsuario = this.contrato.idUsuario;
                    carrera.latInicio = this.contrato.latOrigen;
                    carrera.longInicio = this.contrato.longOrigen;
                    carrera.latFin = this.contrato.latDestino;
                    carrera.longFin = this.contrato.longDestino;
                    carrera.costo = this.contrato.montoTotal;
                    carrera.moneda = 'BS';
                    carrera.descLugar = this.txtDescripcionLugar;
                    carrera.fechaInicio = fechaModificada.format();
                    carrera.tipoPago = this.contrato.tipoPago;
                    carrera.estado = 2;
                    carrera.nombreCliente = this.cliente.nombre;
                    carrera.nombreConductora = this.lstConcudtorasFiltrado[0].nombre + ' ' + this.lstConcudtorasFiltrado[0].paterno;
                    carrera.pais = this.contrato.pais;
                    carrera.ciudad = this.contrato.ciudad;
                    this.lstCarreras.push(carrera);
                }
            }
        }
        this.contrato.idConductora = Number(this.contrato.idConductora);
        if (!this.contrato.id) {
            this.contrato.id = Date.now();
        }
        this.contrato.codigoContrato = this.contrato.codigoContrato + this.contrato.id;
        await this.contratoService.insertarContrato(this.contrato)
        .then( async data => {
        
            for (let carrera of this.lstCarreras) {
                carrera.idContrato = this.contrato.id;
                await this.carreraService.crearCarreraAsync(carrera)
                .then( carreraInsertada => {
                }).catch(err => {
                });
            }
            this.loading.dismiss();
            await this.alertService.present('Info', 'Las carreras fueron registradas correctamente.').then( async () => {
                await this.navController.navigateForward('/lista-clientes');
            });
        });

    }

    obtenerConductoras() {
        // this.loading.present();
        this.conductoraService.listaConductoras().subscribe(data => {
            // this.loading.dismiss();
            this.lstConductoras = Object.assign(data);
        }, error => {
            // this.loading.dismiss();
        });
    }

    async obtenerParametros() {
        this.loading.present();
        await this.parametrosService.listarParametros().subscribe(data => {
            // this.loading.dismiss();
            this.lstParametros = Object.assign(data);
     
            this.lstPaisesFiltrados = Array.from(new Set(this.lstParametros.map(s => s.pais)))
                .map(id => {
                    return {
                        id: id,
                        pais: this.lstParametros.find(s => s.pais === id).pais,
                    };
                });
           
            if(this.contrato.id) {
                this.filtrarCiudades(this.contrato.pais);
                this.filtrarConductoras(this.contrato.ciudad);
            }
        }, error => {
            // this.loading.dismiss();
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
        // this.loading.present();
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
            vCantidadPasajeros: ['', [
                Validators.required,
            ]],
            vMontoTotal: ['', [
                Validators.required,
            ]],
            vDias: ['', [
                Validators.required,
            ]],
            vDescLugar: ['', [
                Validators.required,
            ]],
            vTipoPago: ['', [
                Validators.required,
            ]],
            vEstadoContrato: ['', [
                Validators.required,
            ]],
            vCodigoContrato: ['', [
                Validators.required
            ]],
        });
    }

    get f(): any {
        return this.frmContrato.controls;
    }

    async irMapaOrigen() {
        if (this.contrato.latOrigen) {
            this.mapParamService.set({
                lat: this.contrato.latOrigen,
                lng: this.contrato.longOrigen
            });
        }
        const modal = await this.modalController.create({
            component: MapaPage
        }).then(dato => {
            dato.present();
            dato.onDidDismiss().then(resultado => {
                
                this.contrato.latOrigen = resultado.data.lat;
                this.contrato.longOrigen = resultado.data.lng;
                var geocoder = new google.maps.Geocoder();
                let mylocation = new google.maps.LatLng(this.contrato.latOrigen, this.contrato.longOrigen);
                geocoder.geocode({'location': mylocation}, (results, status: any) => {
                if (status === 'OK') {
                    
                    this.processLocation(results, true);
                }
                });
            });
        });
    }

    async irMapaDestino() {
        if (this.contrato.latOrigen) {
            this.mapParamService.set({
                lat: this.contrato.latDestino,
                lng: this.contrato.longDestino
            });
        }
        const modal = await this.modalController.create({
            component: MapaPage
        }).then(dato => {
            dato.present();
            dato.onDidDismiss().then(resultado => {
       
                this.contrato.latDestino = resultado.data.lat;
                this.contrato.longDestino = resultado.data.lng;
                var geocoder = new google.maps.Geocoder();
                let mylocation = new google.maps.LatLng(this.contrato.latDestino, this.contrato.longDestino);
                geocoder.geocode({'location': mylocation}, (results, status: any) => {
                    if (status === 'OK') {
                   
                    this.processLocation(results, false);
                    }
                });
                this.determinarDistanciaTiempo();
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
                        
                    }
                }, {
                    text: 'Ok',
                    handler: (data) => {
                        
                        
                        this.contrato.dias = null;
                        for (let i = 0; i < data.length; i++) {
                            if (this.contrato.dias) {
                                this.contrato.dias = this.contrato.dias + ',' + data[i];
                            } else {
                                this.contrato.dias = data[i];
                            }
                        }
                        this.obtenerCostoCarreras();
                    }
                }
            ]
        });

        await alert.present();
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

    public async determinarDistanciaTiempo() {

        if (this.lstCiudadesFiltrado) {
            let responseMatrix: google.maps.DistanceMatrixRequest;

            responseMatrix = {
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
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                durationInTraffic: false,
                avoidHighways: false,
                avoidTolls: false
            };

            /*const valor = await this.distance.getDistanceMatrix(
              responseMatrix , this.callBack
            );*/
            let datos = this.getDistanceMatrix(responseMatrix);
            datos.subscribe(data => {
                let ciudadParametro: MdlParametrosCarrera[] = this.lstCiudadesFiltrado.filter(
                    parametros => parametros.ciudad.indexOf(this.ciudadSeleccionada) > -1
                );
                const origins = data.originAddresses;
                const destinations = data.destinationAddresses;
                for (let i = 0; i < origins.length; i++) {
                    const results = data.rows[i].elements;
                    for (let j = 0; j < results.length; j++) {
                        const element = results[j];
                        const distance = element.distance.value;
                        const time = element.duration.value;
                        
                        // calcular costos UBER: https://calculouber.netlify.com/
                        let montoFinal: number = Math.round((ciudadParametro[0].base + ((element.duration.value / 60) * ciudadParametro[0].tiempo) + ((element.distance.value / 1000) * ciudadParametro[0].distancia))* ciudadParametro[0].tarifaDinamica + ciudadParametro[0].cuotaSolicitud);
                        
                        if (montoFinal < 10) {
                            this.contrato.montoTotal = 10;
                        } else {
                            this.contrato.montoTotal = montoFinal;
                        }
                    }
                }
            });
        } else {
            // TODO: decir que no hay que calcular sin conductoras
        }
    }

    async callBack(response: any, status: any) {
        
        /*let ciudadParametro: MdlParametrosCarrera[] = this.lstCiudadesFiltrado.filter(
          parametros => parametros.ciudad.indexOf(this.ciudadSeleccionada) > -1
        );*/
        if (status === 'OK') {
            const origins = response.originAddresses;
            const destinations = response.destinationAddresses;
            for (let i = 0; i < origins.length; i++) {
                const results = response.rows[i].elements;
                for (let j = 0; j < results.length; j++) {
                    const element = results[j];
                    const distance = element.distance.value;
                    const time = element.duration.value;
                    return await {distance: distance, time: time};
                }
            }
        }
    }

    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
          header: 'Albums',
          buttons: [{
            text: 'Guardar Como Vuelta',
            icon: 'share',
            handler: () => {
                if (!this.frmContrato.invalid) {
                    this.esVuelta = true;
                    this.contrato.id = null;
                    let latOr = this.contrato.latOrigen;
                    let lngOr = this.contrato.longOrigen;
                    let latDes = this.contrato.latDestino;
                    let lngDes = this.contrato.longDestino;
                    this.contrato.latOrigen = latDes;
                    this.contrato.longOrigen = lngDes;
                    this.contrato.latDestino = latOr;
                    this.contrato.longDestino = lngOr;
                    this.alertService.present('Guardado', 'Esta seguro de guardar los datos')
                    this.presentAlertConfirm();
                } else {
                    return;
                }
                
            }
          }, {
            text: 'Guardar Como Nuevo',
            icon: 'arrow-dropright-circle',
            handler: () => {
                if (!this.frmContrato.invalid) {
                    this.contrato.id = null;
                    this.esVuelta = false;
                    this.presentAlertConfirm();
                } else {
                    return;
                }
            }
          }, {
            text: 'Actualizar Carreras',
            icon: 'arrow-dropright-circle',
            handler: () => {
                this.modificarCarreras();
            }
          },
          {
            text: 'Guardar Modificado',
            icon: 'save',
            handler: () => {
                if (!this.frmContrato.invalid) {
                    this.esVuelta = false;
                    this.presentAlertConfirm();
                } else {
                    return;
                }
            }
          },
          {
            text: 'Eliminar Contrato',
            icon: 'save',
            handler: () => {
               this.eliminarContratoAlert();
                
            }
          },
           {
            text: 'Cancelar',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              
            }
          }]
        });
        await actionSheet.present();
      }

      async presentAlertConfirm() {
        const alert = await this.alertController.create({
          header: 'Confirmación!',
          message: 'Está seguro de registrar los datos?, Verifique que la hora de la carrera este correcta.',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
              }
            }, {
              text: 'Aceptar',
              handler: async () => {
                if (this.contrato.id) {
                    await this.eliminarCarrerasContrato();
                }
                this.grabar();
              }
            }
          ]
        });
    
        await alert.present();
      }
      async eliminarContratoAlert() {
        const alert = await this.alertController.create({
          header: 'Confirmación!',
          message: 'Desea eliminar el contrato seleccionado?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
              }
            }, {
              text: 'Aceptar',
              handler: async () => {
                if (this.contrato.id) {
                    await this.eliminarCarrerasContrato();
                }
                this.eliminarContrato();
              }
            }
          ]
        });
    
        await alert.present();
      }
      async eliminarContrato() {
          await this.eliminarCarrerasContrato();
          this.contratoService.eliminarContrato(this.contrato.id);
      }
    /*

    http://uber-tarifas-la-paz-bo.ubertarifa.com/

    https://calculouber.netlify.com/
    
    Buscador en los mapas
    Bolsa de Credito - mensual
    Pago efectivo - A la conductora
    Ambas caras de los documentos -> detalle de documentos

    Validacion de horas - 30 minimo de validacion
    Que se registre igual pero con alerta.




    Modulos Extras
    Pagos online -pay me


    */
   processLocation(location, tipo: boolean) {
    if (location[1]) {
      for (var i = 0; i < location.length; i++) {
        for (let j = 0; j < location[i].types.length; j++) {
          if (location[i].types[j] === 'route') {
            if (tipo) {
              this.direccionIni = location[i].formatted_address;
            } else {
              this.direccionFin = location[i].formatted_address;
            }
          }
        }
      }
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from "@angular/forms";
import { MdlConductora } from '../modelo/mldConductora';
import { ConductoraService } from '../services/db/conductora.service';
import { AlertService } from '../services/util/alert.service';
import { LoadingService } from '../services/util/loading.service';
import { SesionService } from '../services/sesion.service';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';
import { NavParamService } from '../services/nav-param.service';
import { MapaPage } from '../comun/mapa/mapa.page';
import { MdlParametrosCarrera } from '../modelo/mdlParametrosCarrera';
import { ParametrosCarreraService } from '../services/db/parametros-carrera.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detalle-conductora',
  templateUrl: './detalle-conductora.page.html',
  styleUrls: ['./detalle-conductora.page.scss'],
})
export class DetalleConductoraPage implements OnInit {

  form: FormGroup;

  conductora: MdlConductora;

  public lstPaisesFiltrados = [];
  public lstCiudadesFiltrado: MdlParametrosCarrera [] = [];
  public lstParametros: MdlParametrosCarrera [] = [];
  public isSesionAdmin: boolean = false;

  constructor(
    public fb: FormBuilder,
    public conductoraService: ConductoraService,
    public alertService: AlertService,
    public loadingService: LoadingService,
    public sesionService: SesionService,
    public navController: NavController,
    public navParam: NavParamService,
    public modalController: ModalController,
    public parametrosService: ParametrosCarreraService,
    public actionSheetController: ActionSheetController
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
      ],[
        this.validarCelularUnico.bind(this)
      ]],
      vnroresidencia: ['', [
        Validators.minLength(1),
        Validators.maxLength(10),
      ]],
      vemail: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
      ],[
        this.validarEmailUnico.bind(this)
      ]],
      vpass: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
      ]],
      vPais: ['', [
        Validators.required
      ]],
      vCiudad: ['', [
        Validators.required
      ]],
      vestado: ['', []],
      vadmin: ['', []],
    });
  }

  validarEmailUnico(control: FormControl):Observable<any>{
    return new Observable<any>(observer => {
      this.conductoraService.getConductoraPorEmail(control.value)
        .subscribe(conductora => {
          if(conductora && conductora.length>0
              && this.conductora.id != conductora[0].id){
            observer.next({ validarUnico: true });
            observer.complete();
          } else {
            observer.next(null);
            observer.complete();
          }
        },error=>{
          observer.error(error);
          observer.complete();
        });
    });
  }

  validarCelularUnico(control: FormControl):Observable<any>{
    return new Observable<any>(observer => {
      this.conductoraService.getConductoraPorCelular(control.value)
        .subscribe(conductora => {
          if(conductora && conductora.length>0
              && this.conductora.id != conductora[0].id){
            observer.next({ validarUnico: true });
            observer.complete();
          } else {
            observer.next(null);
            observer.complete();
          }
        },error=>{
          observer.error(error);
          observer.complete();
        });
    });
  }

  get f() { return this.form.controls; }

  ngOnInit() {
    this.iniciarValidaciones();
    if (this.navParam.get() && this.navParam.get().conductora){
      this.conductora = this.navParam.get().conductora;
    } else {
      this.conductora = new MdlConductora(
        null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, false, false
      );
    }
    this.obtenerParametros();
    this.sesionService.getSesion()
      .then(conductora=>{
        if(conductora && conductora.admin){
          this.isSesionAdmin = true;
        }
      });
  }

  obtenerParametros() {
    this.loadingService.present()
      .then(() => {
        this.parametrosService.listarParametros().subscribe(data => {
          this.loadingService.dismiss();
          this.lstParametros = Object.assign(data);
          this.lstPaisesFiltrados = Array.from(new Set(this.lstParametros.map(s => s.pais)))
          .map(id => {
            return {
              id: id,
              pais: this.lstParametros.find( s => s.pais === id).pais,
            };
          });
          this.filtrarCiudades(this.lstParametros[0].pais);
        }, error => {
          console.log(error);
        });
      });
    
  }

  filtrarCiudades(event) {
    this.lstCiudadesFiltrado = this.lstParametros.filter(
      parametros => parametros.pais.indexOf(event) > -1
    );
  }

  grabar() {
    this.loadingService.present().then(() => {
      this.conductora.user = this.conductora.email;
      if (this.isSesionAdmin) {
        this.conductora.estado = true;
      }
      this.conductoraService.grabarConductora(this.conductora)
        .then((conductora) => {
          this.conductora = conductora;
          this.loadingService.dismiss();
          this.alertService.present('Info', 'Datos guardados correctamente.');
          if (this.isSesionAdmin) {
            this.navController.navigateBack('/lista-conductoras');
          }
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
    this.navParam.set({conductora: this.conductora})
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
          this.form.markAsDirty();
        }
      });
    });
  }

  async showOpcionesConductora(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones Conductora',
      buttons: [
      {
        text: 'Imágenes',
        icon: 'images',
        handler: () => {
          this.irDetalleImagenes();
        }
      },
      {
        text: 'Vehículo',
        icon: 'car',
        handler: () => {
          this.irDetalleVehiculo();
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
}

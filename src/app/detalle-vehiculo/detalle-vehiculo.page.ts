import { Component, OnInit } from '@angular/core';
import { NavParamService } from '../services/nav-param.service';
import { MdlConductora } from '../modelo/mldConductora';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MdlVehiculo } from '../modelo/mdlVehiculo';
import { Observable } from 'rxjs';
import { VehiculoService } from '../services/db/vehiculo.service';
import { NavController } from '@ionic/angular';
import { LoadingService } from '../services/util/loading.service';
import { AlertService } from '../services/util/alert.service';
import { AngularFireUploadTask } from '@angular/fire/storage';

@Component({
  selector: 'app-detalle-vehiculo',
  templateUrl: './detalle-vehiculo.page.html',
  styleUrls: ['./detalle-vehiculo.page.scss'],
})
export class DetalleVehiculoPage implements OnInit {
  
  conductora: MdlConductora;
  vehiculo: MdlVehiculo;
  urlImgVehiculo: Observable<string>;
  urlImgRuat: Observable<string>;
  uploadPorcentaje: Observable<number>;

  form: FormGroup;

  constructor(
    public navParam: NavParamService,
    public fb: FormBuilder,
    public vehiculoService: VehiculoService,
    public navController: NavController,
    public loadingService: LoadingService,
    public alertService: AlertService,
  ) { }

  ngOnInit() {
    if(this.navParam.get()){
      this.conductora = this.navParam.get().conductora;
      this.iniciarValidaciones();
      this.vehiculo = new MdlVehiculo(
        null,this.conductora.id,null,null,null
      );
      this.vehiculoService.getVehiculoPorConductora(this.conductora.id)
        .subscribe(vehiculo=>{
          if(vehiculo[0]){
            this.vehiculo=vehiculo[0]
          }
        });
      this.urlImgVehiculo = this.vehiculoService.getUrlImgVehiculoPorConductora(this.conductora.id);
      this.urlImgRuat = this.vehiculoService.getUrlImgRuatPorConductora(this.conductora.id);
    } else {
      this.navController.navigateRoot('/login');
    }
    
  }

  iniciarValidaciones() {
    this.form = this.fb.group({
      vcapacidad: ['', [
        Validators.required,
        Validators.min(3),
        Validators.max(12),
      ]],
      vmarca: ['', [
        Validators.required,
        Validators.maxLength(50),
      ]],
      vmodelo: ['', [
        Validators.required,
        Validators.min(1950)
      ]],
    });
  }
  get f() { return this.form.controls; }

  grabar(){
    this.loadingService.present().then(() => {
      this.vehiculoService.actualizarVehiculo(this.vehiculo)
      .then(()=>{
        this.loadingService.dismiss();
        this.alertService.present('Info','Datos guardados correctamente.');
      })
      .catch(error=>{
        this.loadingService.dismiss();
        console.log(error);
        this.alertService.present('Error','Hubo un error al grabar los datos');
        this.navController.navigateRoot('/home');
      });
    });
  }

  uploadImgVehiculo(event){
    let upload:AngularFireUploadTask;
    this.loadingService.present()
      .then(()=>{
        upload = this.vehiculoService.uploadImgVehiculo(event.target.files[0], this.vehiculo.idConductora);
        upload.then(()=>{
          this.urlImgVehiculo = this.vehiculoService.getUrlImgVehiculoPorConductora(this.conductora.id);
          this.loadingService.dismiss();
          this.alertService.present('Info','Imagen subida correctamente.');
        }).catch(e=>{
          console.log(e);
          this.loadingService.dismiss();
          this.alertService.present('Error','Error al subir la imagen.');
          this.navController.navigateRoot('/home');
        });
      });
  }

  uploadImgRuat(event){
    let upload:AngularFireUploadTask;
    this.loadingService.present()
      .then(()=>{
        upload = this.vehiculoService.uploadImgRuat(event.target.files[0], this.vehiculo.idConductora);
        upload.then(()=>{
          this.urlImgRuat = this.vehiculoService.getUrlImgRuatPorConductora(this.conductora.id);
          this.loadingService.dismiss();
          this.alertService.present('Info','Imagen subida correctamente.');
        }).catch(e=>{
          console.log(e);
          this.loadingService.dismiss();
          this.alertService.present('Error','Error al subir la imagen.');
          this.navController.navigateRoot('/home');
        });
      });
  }
}

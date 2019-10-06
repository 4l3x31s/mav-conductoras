import { Component, OnInit } from '@angular/core';
import { NavParamService } from '../services/nav-param.service';
import { MdlConductora } from '../modelo/mldConductora';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MdlVehiculo } from '../modelo/mdlVehiculo';
import { VehiculoService } from '../services/db/vehiculo.service';
import { NavController, AlertController } from '@ionic/angular';
import { LoadingService } from '../services/util/loading.service';
import { AlertService } from '../services/util/alert.service';

@Component({
  selector: 'app-detalle-vehiculo',
  templateUrl: './detalle-vehiculo.page.html',
  styleUrls: ['./detalle-vehiculo.page.scss'],
})
export class DetalleVehiculoPage implements OnInit {
  
  conductora: MdlConductora;
  vehiculo: MdlVehiculo;
  
  form: FormGroup;

  constructor(
    public navParam: NavParamService,
    public fb: FormBuilder,
    public vehiculoService: VehiculoService,
    public navController: NavController,
    public loadingService: LoadingService,
    public alertService: AlertService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    if(this.navParam.get()){
      this.conductora = this.navParam.get().conductora;
      this.iniciarValidaciones();
      
      this.vehiculoService.getVehiculoPorConductora(this.conductora.id)
        .subscribe(vehiculo=>{
          if(vehiculo[0]){
            this.vehiculo=vehiculo[0];
          } else {
            this.vehiculo = new MdlVehiculo(
              null,this.conductora.id,null,null,null,null, null
            );
          }
        });
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
      //vplaca
      vplaca: ['', [
        Validators.required,
      ]],
      //vcolor
      vcolor: ['', [
        Validators.required,
      ]],
    });
  }
  get f(): any { return this.form.controls; }

  grabar(){
    this.loadingService.present().then(() => {
      this.vehiculoService.grabarVehiculo(this.vehiculo)
      .then((vehiculo)=>{
        this.vehiculo = vehiculo;
        this.loadingService.dismiss();
        this.alertService.present('Info','Datos guardados correctamente.');
      })
      .catch(error=>{
        this.loadingService.dismiss();
        this.alertService.present('Error','Hubo un error al grabar los datos');
        this.navController.navigateRoot('/home');
      });
    });
  }
}

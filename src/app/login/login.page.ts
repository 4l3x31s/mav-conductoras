import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SesionService } from '../services/sesion.service';
import { LoadingService } from '../services/util/loading.service';
import { NavController } from '@ionic/angular';
import { AlertService } from '../services/util/alert.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;
  public user: string;
  public pass: string;

  constructor(
    public fb: FormBuilder,
    public sesionService: SesionService,
    public loadingService: LoadingService,
    public navController: NavController,
    public alertService: AlertService
  ) { }

  ngOnInit() {
    this.iniciaValidaciones();
    if(environment.isSesionPrueba){
      //datos prueba
      this.user='alvarez';
      this.pass='l1234567';
    }
    this.sesionService.getSesion()
      .then((conductora)=>{
        if(conductora){
          this.navController.navigateRoot('/home');
        }
      });
  }
  iniciaValidaciones() {
    this.form = this.fb.group({
      vuser: ['', [
        Validators.required,
      ]],
      vpass: ['', [
        Validators.required,
      ]]
    });
  }
  get f() { return this.form.controls; }

  ingresar() {
    this.loadingService.present()
      .then(() => {
        this.sesionService.login(this.user, this.pass)
          .subscribe(() => {
            console.log('login exito');
            this.navController.navigateRoot('/home');
            this.loadingService.dismiss();
          }, error => {
            console.log('error-login', error);
            if (error.message) {
              this.alertService.present('Error', error.message);
            } else {
              this.alertService.present('Error', 'Hubo un error al ingresar.');
            }
            this.loadingService.dismiss();
          });
      })

  }
}

import { AuthService } from './../services/firebase/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SesionService } from '../services/sesion.service';
import { LoadingService } from '../services/util/loading.service';
import { NavController, Events, AlertController, ToastController } from '@ionic/angular';
import { AlertService } from '../services/util/alert.service';
import { environment } from '../../environments/environment';
import { NavParamService } from '../services/nav-param.service';
import { TokenNotifService } from '../services/token-notif.service';
import { ConductoraService } from '../services/db/conductora.service';

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
    public alertService: AlertService,
    public events: Events,
    public authService: AuthService,
    public alertController: AlertController,
    public toastController: ToastController,
    public navParam: NavParamService,
    public tokenService: TokenNotifService,
    public conductoraService: ConductoraService
  ) { }

  ngOnInit() {
    this.iniciaValidaciones();
    if(environment.isSesionPrueba){
      //datos prueba
      this.user = '';
      this.pass = '';

    }
    this.loadingService.present()
      .then(()=>{
        this.sesionService.crearSesionBase()
        .then(() => {
          this.sesionService.getSesion()
            .subscribe((conductora)=>{
              if(conductora){
                
                conductora.ui = this.tokenService.get() ? this.tokenService.get() : null;
                console.log(conductora);
                if(conductora.ui!=null){
                  this.conductoraService.grabarConductora(conductora);
                }
                if (conductora.admin){
                  this.navController.navigateRoot('/home');
                } else {
                  if(!conductora.estado) {
                    this.navParam.set({conductora: conductora});
                    this.navController.navigateRoot('/detalle-conductora');
                  } else {
                    this.navController.navigateRoot('/home');
                  }
                }
                
              }
              this.loadingService.dismiss();
            },
            error=>{
              this.loadingService.dismiss();
              this.alertService.present('Error', 'Error al obtener la sesion.');
            });
        })
        .catch(e=>{
          this.loadingService.dismiss();
          this.alertService.present('Error','Error al crear la BD de sesion')
        });
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
  get f(): any { return this.form.controls; }

  ingresar() {
    this.loadingService.present()
      .then(() => {
        this.authService.doLogin(this.user, this.pass)
        .then( res => {
          this.sesionService.login(this.user)
          .subscribe((conductora) => {
            conductora.ui = this.tokenService.get() ? this.tokenService.get() : null;
            console.log(conductora);
            if(conductora.ui!=null){
              this.conductoraService.grabarConductora(conductora);
            }
            this.events.publish('user:login');
            if (conductora.admin){
              this.navController.navigateRoot('/home');
            } else {
              this.navController.navigateRoot('/home');
            }
            if(!conductora.estado) {
              this.navParam.set({conductora: conductora});
              this.navController.navigateForward('/detalle-conductora');
            }
            this.loadingService.dismiss();
          }, error => {
            if (error.message) {
              this.alertService.present('Información', error.message);
            } else {
              this.alertService.present('Error', 'Hubo un error al ingresar.');
            }
            this.loadingService.dismiss();
          });
        }, err => {
          if (err.message) {
            this.alertService.present('Información', 'Usuario o Contraseña inválidos.');
          } else {
            this.alertService.present('Error', 'Hubo un error al ingresar.');
          }
          this.loadingService.dismiss();
        });
      })

  }
  registrar() {
    // posiblemente se seteo 
    this.navParam.set({conductora:undefined});
    this.navController.navigateForward('/detalle-conductora');
  }
  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Recuperación Contraseña',
      message: 'Ingrese su correo electrónico.',
      inputs: [
        {
          name: 'txtEmailPop',
          type: 'text',
          placeholder: 'ejemplo@ejemplo.com',
          label: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Enviar',
          handler: (data) => {
            if (data.txtEmailPop.length > 0) {
              this.authService.resetPassword(data.txtEmailPop)
              .then( () => {
                this.presentToast('Se ha enviado el correo.');
              }, err => {
                this.presentToast('Hubo un error al enviar el correo.');
              })
            } else {
              this.presentToast('Debe ingresar un correo válido.');
            }
          }
        }
      ]
    });

    await alert.present();
  }
  enviarCorreo() {
    this.presentAlertPrompt();
  }
  outFocus() {
    this.user = this.user.trim();
    this.user = this.user.replace(' ', '');
  }
}

import { ConductoraService } from './../services/db/conductora.service';
import { TokenNotifService } from './../services/token-notif.service';
import { Component, OnInit } from '@angular/core';
import { SesionService } from '../services/sesion.service';
import { MdlConductora } from '../modelo/mldConductora';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit {
  conductora: MdlConductora;
  subscription: any;
  constructor(
    public sesionService: SesionService,
    public navController: NavController,
    public platform: Platform,
    public tokenService: TokenNotifService,
    public conductoraService: ConductoraService
  ) { }

  ngOnInit() {
    this.sesionService.crearSesionBase()
      .then(() => {
        this.sesionService.getSesion()
          .subscribe((conductora) => {
            if (conductora) {
              this.conductora = conductora;
              if(!conductora.ui)
              {
                this.conductora.ui = this.tokenService.get() ? this.tokenService.get() : null;
                this.conductoraService.grabarConductora(this.conductora);
              }
            } else {
              this.navController.navigateRoot('/login');
            }
          });
      })
      .catch(e=>{
        alert('error crearSesionBase:'+JSON.stringify(e));
      });
  }
  ionViewDidEnter(){
    this.subscription = this.platform.backButton.subscribe(()=>{
        navigator['app'].exitApp();
    });
  }
  
  ionViewWillLeave(){
      this.subscription.unsubscribe();
  }
}

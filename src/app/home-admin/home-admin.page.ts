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
  ) { }

  ngOnInit() {
    this.sesionService.crearSesionBase()
      .then(() => {
        this.sesionService.getSesion()
          .subscribe((conductora) => {
            if (conductora) {
              this.conductora = conductora;
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

import { Component, OnInit } from '@angular/core';
import { NavParamService } from '../services/nav-param.service';
import { NavController } from '@ionic/angular';
import { MdlConductora } from '../modelo/mldConductora';

@Component({
  selector: 'app-detalle-imagenes-conductora',
  templateUrl: './detalle-imagenes-conductora.page.html',
  styleUrls: ['./detalle-imagenes-conductora.page.scss'],
})
export class DetalleImagenesConductoraPage implements OnInit {

  conductora: MdlConductora;
  
  constructor(
    public navParam: NavParamService,
    public navController: NavController,
  ) { }

  ngOnInit() {
    console.log(this.navParam.get());
    if(this.navParam.get()){
      this.conductora = this.navParam.get().conductora;
      console.log(this.conductora);
    } else {
      //this.navController.navigateRoot('/login');
    }
  }

}

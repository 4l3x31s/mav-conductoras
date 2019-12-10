import { LoadingService } from './../services/util/loading.service';
import { Component, OnInit } from '@angular/core';
import { NavParamService } from '../services/nav-param.service';
import { NavController, AlertController } from '@ionic/angular';
import { MdlConductora } from '../modelo/mldConductora';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AlertService } from '../services/util/alert.service';

@Component({
  selector: 'app-detalle-imagenes-conductora',
  templateUrl: './detalle-imagenes-conductora.page.html',
  styleUrls: ['./detalle-imagenes-conductora.page.scss'],
})
export class DetalleImagenesConductoraPage implements OnInit {

  conductora: MdlConductora;
  //urlImagenFirebase: string;
  urlImagenFoto: string;
  urlImagenCI: string;
  urlImagenCIAnv: string;
  urlImagenLic: string;
  urlImagenFactura: string;
  urlImagenFelcc: string;
  urlImagenTransito: string;
  urlImagenOtros: string;

  urlFoto: string;
  urlCI: string;
  urlCIAnv: string;
  urlLic: string;
  urlFactura: string;
  urlFelcc: string;
  urlTransito: string;
  urlOtros: string;

  cargandoImagen: boolean = false;
  constructor(
    public navParam: NavParamService,
    public navController: NavController,
    private storage: AngularFireStorage,
    public loadingService: LoadingService,
    public alertService: AlertService,
    public alertController: AlertController
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

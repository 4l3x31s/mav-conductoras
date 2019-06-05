import { Component, OnInit, Input } from '@angular/core';
import { MdlCliente } from 'src/app/modelo/mdlCliente';
import { ModalController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {

  @Input()
  cliente: MdlCliente;

  constructor(
    private modalCtrl: ModalController,
    public iab: InAppBrowser,
  ) { }

  ngOnInit() {
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  irWhatsApp(){
    this.iab.create('https://api.whatsapp.com/send?phone=591'+this.cliente.cel+'&text=', '_system', 'location=yes');
  }

}

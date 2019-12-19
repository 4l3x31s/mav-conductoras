import { Component, OnInit, Input } from '@angular/core';
import { MdlCliente } from 'src/app/modelo/mdlCliente';
import { ModalController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ClienteService } from 'src/app/services/db/cliente.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {

  @Input()
  cliente: MdlCliente;

  codigoColorCliente: string;
  colores: any[] = [
    {
      codigo: 'red', descripcion: 'Rojo'
    },
    {
      codigo: 'blue', descripcion: 'Azul'
    },
    {
      codigo: 'green', descripcion: 'Verde'
    },
    {
      codigo: 'black', descripcion: 'negro'
    },
    {
      codigo: 'darkcyan', descripcion: 'Verde Petroleo'
    },
    {
      codigo: 'darkgreen', descripcion: 'Verde Oscuro'
    },
  ];

  constructor(
    private modalCtrl: ModalController,
    public iab: InAppBrowser,
    public clienteService: ClienteService
  ) { }

  ngOnInit() {
    this.codigoColorCliente = this.colores.find(x => x.codigo == this.clienteService.getColorPorClienteGeneral(this.cliente.id)).codigo;
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  irWhatsApp() {
    this.iab.create('https://api.whatsapp.com/send?phone=' + this.cliente.cel + '&text=', '_system', 'location=yes');
  }

  cambiarColor(){
    this.clienteService.setColorCliente(this.cliente.id, this.codigoColorCliente);
  }

}

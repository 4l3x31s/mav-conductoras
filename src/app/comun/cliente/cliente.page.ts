import { Component, OnInit, Input } from '@angular/core';
import { MdlCliente } from 'src/app/modelo/mdlCliente';
import { ModalController } from '@ionic/angular';

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
  ) { }

  ngOnInit() {
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

}

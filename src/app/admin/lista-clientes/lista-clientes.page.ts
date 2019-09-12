import { DepositoService } from './../../services/db/deposito.service';
import { NavParamService } from './../../services/nav-param.service';
import { NavController, ActionSheetController } from '@ionic/angular';
import { LoadingService } from './../../services/util/loading.service';
import { ClienteService } from './../../services/db/cliente.service';
import { MdlCliente } from './../../modelo/mdlCliente';
import { Component, OnInit } from '@angular/core';
import { MdlDepositos } from 'src/app/modelo/mdlDepositos';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.page.html',
  styleUrls: ['./lista-clientes.page.scss'],
})
export class ListaClientesPage implements OnInit {
  public lstClientes: MdlCliente[] = [];
  public lstClientesFiltrado: MdlCliente[] = [];
  public txtBuscarCliente: string;
  constructor(
    public clienteService: ClienteService,
    public loading: LoadingService,
    public navController: NavController,
    public navParams: NavParamService,
    public actionSheetController: ActionSheetController,
    public iab: InAppBrowser
  ) { }

  ngOnInit() {
    this.listarClientes();
  }
  seleccionarCliente(cliente: MdlCliente) {
    this.irActualizarCliente(cliente);
  }
  async listarClientes() {
    this.loading.present();
    await this.clienteService.listaClientes().subscribe( data => {
      this.loading.dismiss();
      this.lstClientes = Object.assign(data);
      this.lstClientesFiltrado = this.lstClientes;
    },  error => {
      this.loading.dismiss();
    });
  }
  public filtrar() {
    this.lstClientesFiltrado = this.lstClientes.filter(
      conductora =>
        conductora.nombre.toLowerCase().indexOf(this.txtBuscarCliente.toLowerCase()) > -1
    );
  }
  public borrarCliente(cliente: MdlCliente) {
  }
  irActualizarCliente(cliente) {
    this.navParams.set({
      cliente: cliente
    });
    this.navController.navigateForward('/reg-clientes');
  }
  public abrirWhatsapp (cliente: MdlCliente) {
    this.iab.create(`https://api.whatsapp.com/send?phone=591` + cliente.cel + `&text=MAV:`, '_system', 'location=yes');
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones Cliente',
      buttons: [
      {
        text: 'Nuevo Cliente',
        icon: 'person',
        handler: () => {
          this.navParams.set({
            cliente: null
          });
          this.navController.navigateForward('/reg-clientes');
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }
 

}

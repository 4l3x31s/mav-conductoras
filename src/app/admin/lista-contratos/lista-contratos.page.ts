import { MdlCliente } from './../../modelo/mdlCliente';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavParamService } from './../../services/nav-param.service';
import { NavController, ActionSheetController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/util/loading.service';
import { Component, OnInit } from '@angular/core';
import { ContratoService } from 'src/app/services/db/contrato.service';
import { MdlContrato } from 'src/app/modelo/mdlContrato';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-lista-contratos',
  templateUrl: './lista-contratos.page.html',
  styleUrls: ['./lista-contratos.page.scss'],
})
export class ListaContratosPage implements OnInit {
  public lstContrato: MdlContrato[] = [];
  public lstContratoFiltrado: MdlContrato[] = [];
  public txtBuscarContrato: string;
  public cliente: MdlCliente;
  constructor(
    public contratoService: ContratoService,
    public loading: LoadingService,
    public navController: NavController,
    public navParams: NavParamService,
    public actionSheetController: ActionSheetController,
    public iab: InAppBrowser,
    public excelService: ExcelService
    ) {
      if (navParams.get().cliente) {
        this.cliente = this.navParams.get().cliente;
      } else {
        this.cliente = new MdlCliente(null, null, null, null, null, null, null, null, null, null, null, null, null);
      }
     }

  ngOnInit() {
    this.listarContrato();
  }
  async listarContrato() {
    this.loading.present();
    await this.contratoService.listaContratosPorUsuario(this.cliente.id).subscribe( data => {
      this.loading.dismiss();
      this.lstContrato = Object.assign(data);
      this.lstContratoFiltrado = this.lstContrato;
    },  error => {
      this.loading.dismiss();
    });
  }
  irActualizarContrato(contrato: MdlContrato) {
    this.navParams.set({
      cliente: this.cliente,
      contrato: contrato
    });
    this.navController.navigateForward('/detalle-contrato');
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones Cliente',
      buttons: [
      {
        text: 'Exportar a EXCEL',
        icon: 'document',
        handler: () => {
          let plataforma = this.excelService.getDevice();
          console.log(plataforma);
          if (plataforma === 'android' || plataforma === 'ios') {
            this.excelService.exportarExcel(this.lstContrato);
          } else {
            this.exportAsXLSX();
          }
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
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.lstContrato, 'sample');
 }
}

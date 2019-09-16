import { NavParamService } from './../../services/nav-param.service';
import { NavController, ActionSheetController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/util/loading.service';
import { ParametrosCarreraService } from './../../services/db/parametros-carrera.service';
import { MdlParametrosCarrera } from 'src/app/modelo/mdlParametrosCarrera';
import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-lista-parametros',
  templateUrl: './lista-parametros.page.html',
  styleUrls: ['./lista-parametros.page.scss'],
})
export class ListaParametrosPage implements OnInit {
  public listParametros: MdlParametrosCarrera[] = [];
  public listParametrosFiltrado: MdlParametrosCarrera[] = [];
  public txtBuscarParametros: string;
  constructor(
    public parametrosService: ParametrosCarreraService,
    public loading: LoadingService,
    public navController: NavController,
    public navParams: NavParamService,
    public actionSheetController: ActionSheetController,
    public excelService: ExcelService
  ) { }

  ngOnInit() {
    this.listarParametros();
  }
  public listarParametros() {
    this.loading.present();
    this.parametrosService.listarParametros().subscribe( data => {
      this.loading.dismiss();
      this.listParametros = Object.assign(data);
      this.listParametrosFiltrado = this.listParametros;
    }, error => {
      this.loading.dismiss();
    })
  }
  public seleccionarParametro(parametro: MdlParametrosCarrera) {
    this.navParams.set({
      parametro: parametro
    });
    this.navController.navigateForward('/reg-parametros');
  }
  public filtrar() {
    this.listParametrosFiltrado = this.listParametros.filter(
      parametro =>
        parametro.ciudad.toLocaleLowerCase().indexOf(this.txtBuscarParametros.toLocaleLowerCase()) > -1
    );
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones Parametros',
      buttons: [
      {
        text: 'Nuevo Parametro',
        icon: 'person',
        handler: () => {
          this.navParams.set({
            parametro: null
          });
          this.navController.navigateForward('/reg-parametros');
        }
      },
      {
        text: 'Exportar a EXCEL',
        icon: 'document',
        handler: () => {
          let plataforma = this.excelService.getDevice();
          console.log(plataforma);
          if (plataforma === 'android' || plataforma === 'ios') {
            this.excelService.exportarExcel(this.listParametros);
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
    this.excelService.exportAsExcelFile(this.listParametros, 'sample');
 }
}

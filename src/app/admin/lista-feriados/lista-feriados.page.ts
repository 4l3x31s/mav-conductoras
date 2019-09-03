import { MdlFeriado } from 'src/app/modelo/mdlFeriado';
import { NavParamService } from './../../services/nav-param.service';
import { NavController, ActionSheetController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/util/loading.service';
import { Component, OnInit } from '@angular/core';
import { FeriadosService } from 'src/app/services/db/feriados.service';

@Component({
  selector: 'app-lista-feriados',
  templateUrl: './lista-feriados.page.html',
  styleUrls: ['./lista-feriados.page.scss'],
})
export class ListaFeriadosPage implements OnInit {
  public listFeriados: MdlFeriado[] = [];
  public listFeriadosFiltrado: MdlFeriado[] = [];
  public txtBuscarParametros: string;
  constructor(
    public feriadosService: FeriadosService,
    public loading: LoadingService,
    public navController: NavController,
    public navParams: NavParamService,
    public actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.listarFeriados();
  }
  public listarFeriados() {
    this.loading.present();
    this.feriadosService.listaFeriados().subscribe( data => {
      this.loading.dismiss();
      this.listFeriados = Object.assign(data);
      this.listFeriadosFiltrado = this.listFeriados;
    }, error => {
      this.loading.dismiss();
    })
  }
  public seleccionarFeriado(feriado: MdlFeriado) {
    this.navParams.set({
      feriado: feriado
    });
    this.navController.navigateForward('/reg-feriados');
  }
  public filtrar() {
    this.listFeriadosFiltrado = this.listFeriados.filter(
      feriado =>
        feriado.descFeriado.toLocaleLowerCase().indexOf(this.txtBuscarParametros.toLocaleLowerCase()) > -1
    );
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones Feriados',
      buttons: [
      {
        text: 'Nuevo Feriado',
        icon: 'calendar',
        handler: () => {
          this.navParams.set({
            feriado: null
          });
          this.navController.navigateForward('/reg-feriados');
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

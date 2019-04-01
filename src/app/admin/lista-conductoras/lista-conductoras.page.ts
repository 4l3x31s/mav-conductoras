import { ConductoraService } from './../../services/db/conductora.service';
import { LoadingService } from './../../services/util/loading.service';
import { AdminService } from './../../services/db/admin.service';
import { Component, OnInit } from '@angular/core';
import { MdlConductora } from 'src/app/modelo/mldConductora';

@Component({
  selector: 'app-lista-conductoras',
  templateUrl: './lista-conductoras.page.html',
  styleUrls: ['./lista-conductoras.page.scss'],
})
export class ListaConductorasPage implements OnInit {
  public lstConductoras: MdlConductora[] = [];
  public lstConductorasFiltradas: MdlConductora[] = [];
  public txtBuscar: string;
  constructor(
    public conductorasService: ConductoraService,
    public loading: LoadingService
    ) { }

  ngOnInit() {
    this.listaConductoras();
  }

  public listaConductoras() {
    this.loading.present();
    this.conductorasService.listaConductoras().subscribe(data => {
      this.loading.dismiss();
      this.lstConductoras = Object.assign(data);
      this.lstConductorasFiltradas = this.lstConductoras;
    }, error => {
      this.loading.dismiss();
    });
  }
  public seleccionarConductora(conductora: MdlConductora) {
    console.log(conductora);
  }
  public filtrar() {
    this.lstConductorasFiltradas = this.lstConductoras.filter(
      conductora =>
        conductora.nombre.toLowerCase().indexOf(this.txtBuscar.toLowerCase()) > -1
    );
  }
}

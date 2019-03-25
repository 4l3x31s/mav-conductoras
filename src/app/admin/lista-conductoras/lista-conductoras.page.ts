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
  public lstConductoras: Array<MdlConductora>;
  constructor(
    public adminService: AdminService,
    public loading: LoadingService
    ) { }

  ngOnInit() {
  }

  listaConductoras() {
    this.adminService.listaConductoras<Array<MdlConductora>>().subscribe(data => {
      this.lstConductoras = Object.assign(data);
      
    })
  }
}

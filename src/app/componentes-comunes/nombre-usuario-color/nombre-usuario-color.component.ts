import { Component, OnInit, Input } from '@angular/core';
import { ClienteService } from 'src/app/services/db/cliente.service';
import { MdlCliente } from 'src/app/modelo/mdlCliente';

@Component({
  selector: 'nombre-usuario-color',
  templateUrl: './nombre-usuario-color.component.html',
  styleUrls: ['./nombre-usuario-color.component.scss'],
})
export class NombreUsuarioColorComponent implements OnInit {

  @Input("idUsuario")
  idUsuario: number;
  cliente: MdlCliente;
  color: string;
  
  constructor(
    public clienteService: ClienteService
  ) { }

  ngOnInit() {
    this.clienteService.getCliente(this.idUsuario)
      .subscribe(cliente=>{
        this.cliente = cliente;
        this.color = this.clienteService.getColorPorCliente(this.cliente.id);
      });

  }

  irDetalleCliente(){
    
  }

}

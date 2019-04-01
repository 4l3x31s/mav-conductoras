import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MdlCliente } from 'src/app/modelo/mdlCliente';
import { ClienteService } from 'src/app/services/db/cliente.service';
import { LoadingService } from 'src/app/services/util/loading.service';
import { AlertService } from 'src/app/services/util/alert.service';
import { NavController } from '@ionic/angular';
import { NavParamService } from 'src/app/services/nav-param.service';

@Component({
  selector: 'app-reg-clientes',
  templateUrl: './reg-clientes.page.html',
  styleUrls: ['./reg-clientes.page.scss'],
})
export class RegClientesPage implements OnInit {
  frmCliente: FormGroup;
  public cliente: MdlCliente;
  constructor(
    public fb: FormBuilder,
    public clienteService: ClienteService,
    public loadingServices: LoadingService,
    public alertService: AlertService,
    public navController: NavController,
    public navParams: NavParamService
  ) {
    if (navParams.get().cliente) {
      this.cliente = this.navParams.get().cliente;
    } else {
      this.cliente = new MdlCliente(null, null, null, null, null, null, null, null, null, null);
    }
  }

  ngOnInit() {
    this.iniciarValidaciones();
  }
  get f() { return this.frmCliente.controls; }
  public iniciarValidaciones() {
    this.frmCliente = this.fb.group({
      vnombre: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50),
      ]],
      vci: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15),
      ]],
      vdireccion: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100),
      ]],
      vuser: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]],
      vpass: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]],
      vtel: ['', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(7),
      ]],
      vcel: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15),
      ]],
      vemail: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(30),
        Validators.email,
      ]],
    })
  }

  public grabar(){
    this.loadingServices.present().then(() => {
      this.clienteService.crearCliente(this.cliente)
      .then(() => {
        this.loadingServices.dismiss();
        this.alertService.present('Info', 'Datos guardados correctamente.');
        this.navController.navigateBack('/lista-clientes');
      })
      .catch( error => {
        this.loadingServices.dismiss();
        console.log(error);
        this.alertService.present('Error', 'Hubo un error al grabar los datos');
        this.navController.navigateRoot('/home');
      })
    })
  }
}

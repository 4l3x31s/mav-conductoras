import { MdlContrato } from './../../modelo/mdlContrato';
import { MdlParametrosCarrera } from './../../modelo/mdlParametrosCarrera';
import { DepositoService } from './../../services/db/deposito.service';
import { MdlDepositos } from 'src/app/modelo/mdlDepositos';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MdlCliente } from 'src/app/modelo/mdlCliente';
import { ClienteService } from 'src/app/services/db/cliente.service';
import { LoadingService } from 'src/app/services/util/loading.service';
import { AlertService } from 'src/app/services/util/alert.service';
import { NavController, ActionSheetController } from '@ionic/angular';
import { NavParamService } from 'src/app/services/nav-param.service';
import { ParametrosCarreraService } from 'src/app/services/db/parametros-carrera.service';
import { TokenNotifService } from 'src/app/services/token-notif.service';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { ExcelService } from 'src/app/services/excel.service';
import { CarreraService } from 'src/app/services/db/carrera.service';
import { MdlCarrera } from 'src/app/modelo/mdlCarrera';

@Component({
  selector: 'app-reg-clientes',
  templateUrl: './reg-clientes.page.html',
  styleUrls: ['./reg-clientes.page.scss'],
})
export class RegClientesPage implements OnInit {
  frmCliente: FormGroup;
  public cliente: MdlCliente;
  public lstDepositos: MdlDepositos[] = [];
  public lstPaisesFiltrados = [];
  public lstCiudadesFiltrado: MdlParametrosCarrera [] = [];
  public lstParametros: MdlParametrosCarrera [] = [];
  public myclass: string;
  public lstCarreras: MdlCarrera[] = [];
  constructor(
    public fb: FormBuilder,
    public clienteService: ClienteService,
    public loadingServices: LoadingService,
    public alertService: AlertService,
    public navController: NavController,
    public navParams: NavParamService,
    public depositosService: DepositoService,
    public actionSheetController: ActionSheetController,
    public loadingService: LoadingService,
    public parametrosService: ParametrosCarreraService,
    public tokenService: TokenNotifService,
    public authService: AuthService,
    public carreraService: CarreraService,
    public excelService: ExcelService,
  ) {
    if (navParams.get().cliente) {
      this.cliente = this.navParams.get().cliente;
    } else {
      this.cliente = new MdlCliente(null, null , null, null, null, null, null, null, null, null, null, null, null);
    }
  }

  ngOnInit() {
    this.obtenerParametros();
    this.iniciarValidaciones();
    this.listarDepositos();
    if (this.cliente.id !== null) {
      this.myclass = "ocultar";
      this.frmCliente.get('vconfirmPass').setValue(this.cliente.pass);
    } else {
      this.myclass = "mostrar";
    }
    this.carreraService.getCarrerasPorCliente(this.cliente.id).subscribe( carreras => {
      this.lstCarreras = carreras;
    });
  }
  get f(): any { return this.frmCliente.controls; }
  listarDepositos() {
    this.loadingServices.present();
    this.depositosService.listaDepositosPorCliente(this.cliente.id).subscribe( data => {
      this.loadingServices.dismiss();
      this.lstDepositos = Object.assign(data);
    },  error => {
      this.loadingServices.dismiss();
    });
  }
  seleccionarDeposito(deposito) {
    this.navParams.set({
      deposito: deposito,
      cliente: this.cliente
    })
    this.navController.navigateForward('/reg-depositos');
  }
  public iniciarValidaciones() {
    this.frmCliente = this.fb.group({
      vnombre: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50),
      ]],
      /*vci: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15),
        Validators.pattern(/^[0-9]/),
      ]],
      vdireccion: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100),
      ]],*/
      vuser: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]],
      vpass: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]],
      vconfirmPass: ['',
       Validators.required],
      /*vtel: ['', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(7),
        Validators.pattern(/^[0-9]/),
      ]],*/
      vcel: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15),
        Validators.pattern(/^[0-9]/),
      ]],
      vemail: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(30),
        Validators.email,
      ]],
      vciudad: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
      ]],
      vpais: ['', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(30),
      ]],
    }, {
      validator: this.mustMatch('vpass', 'vconfirmPass')
    });
  }
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: 'Las contraseñas no coinciden' });
        } else {
            matchingControl.setErrors(null);
        }
    }
}
public grabar(){
  this.loadingService.present().then(() => {
    this.cliente.user = this.cliente.email;
    this.cliente.ui = this.tokenService.get();
    this.cliente.estado = true;
    if(this.cliente.ui === undefined) {
      this.cliente.ui = null;
    }
    this.authService.doRegister(this.cliente.user, this.cliente.pass)
          .then(res => {
            this.clienteService.crearCliente(this.cliente)
            .then((cliente) => {
              this.cliente = cliente;
              this.loadingService.dismiss();
              this.alertService.present('Info', 'Datos guardados correctamente.');   // nuevo cliente
              this.navController.navigateBack('/lista-clientes');
            })
            .catch(error => {
              this.loadingService.dismiss();
              this.alertService.present('Error', 'Hubo un error al grabar los datos');
              this.navController.navigateRoot('/lista-clientes');
            });
          }, error => {
            this.loadingService.dismiss();
            this.alertService.present('Error', 'Hubo un error al grabar los datos');
            this.navController.navigateRoot('/lista-clientes');
          })
  });
}
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones Cliente',
      buttons: [
      {
        text: 'Nuevo Deposito',
        icon: 'cash',
        handler: () => {
          this.navParams.set({
            cliente: this.cliente,
            deposito: null
          });
          this.navController.navigateForward('/reg-depositos');
        }
      },
      {
        text: 'Registrar Contrato',
        icon: 'copy',
        handler: () => {
          this.navParams.set({
            cliente: this.cliente
          });
          this.navController.navigateForward('/detalle-contrato');
        }
      },
      {
        text: 'Lista Contratos Cliente',
        icon: 'list-box',
        handler: () => {
          this.navParams.set({
            cliente: this.cliente
          });
          this.navController.navigateForward('/lista-contratos');
        }
      },
      {
        text: 'Carreras Cliente',
        icon: 'car',
        handler: () => {
          this.navParams.set({
            cliente: this.cliente
          });
          this.navController.navigateForward('/calendario-carrera');
        }
      },
      {
        text: 'Pagos Cliente',
        icon: 'cash',
        handler: () => {
          this.navParams.set({
            cliente: this.cliente
          });
          this.navController.navigateForward('/detalle-deuda');
        }
      },
      {
        text: 'Carreras Cliente',
        icon: 'list-box',
        handler: () => {
          let plataforma = this.excelService.getDevice();
          console.log(plataforma);
          if (plataforma === 'android' || plataforma === 'ios') {
            this.excelService.exportarExcel(this.lstCarreras);
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
    this.excelService.exportAsExcelFile(this.lstCarreras, 'sample');
 }
  obtenerParametros() {
    this.loadingService.present()
      .then(() => {
        this.parametrosService.listarParametros().subscribe(data => {
          this.loadingService.dismiss();
          this.lstParametros = Object.assign(data);
          this.lstPaisesFiltrados = Array.from(new Set(this.lstParametros.map(s => s.pais)))
          .map(id => {
            return {
              id: id,
              pais: this.lstParametros.find( s => s.pais === id).pais,
            };
          });
          this.filtrarCiudades(this.lstParametros[0].pais);
        }, error => {
        });
      });
    
  }

  filtrarCiudades(event) {
    this.lstCiudadesFiltrado = this.lstParametros.filter(
      parametros => parametros.pais.indexOf(event) > -1
    );
  }
  public generarUsuario(){
    this.cliente.user = this.cliente.email;
  }
}

import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ExcelService } from 'src/app/services/excel.service';
import { ActionSheetController } from '@ionic/angular';
import { ClienteService } from 'src/app/services/db/cliente.service';
import { ContratoService } from 'src/app/services/db/contrato.service';
import { ConductoraService } from 'src/app/services/db/conductora.service';
import { MdlCliente } from 'src/app/modelo/mdlCliente';
import { MdlContrato } from 'src/app/modelo/mdlContrato';
import { CarreraService } from 'src/app/services/db/carrera.service';
import { DepositoService } from 'src/app/services/db/deposito.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { VehiculoService } from 'src/app/services/db/vehiculo.service';

@Component({
  selector: 'app-informes-reportes',
  templateUrl: './informes-reportes.page.html',
  styleUrls: ['./informes-reportes.page.scss'],
})
export class InformesReportesPage implements OnInit {
  lstCliente = [];
  idCliente: any = null;
  lstContrato = [];
  lstConductora = [];
  lstDeposito = [];
  lstCarrera = [];
  lstVehiculo = [];
  vehiculo = [];
  constructor(
    public iab: InAppBrowser,
    public actionSheetController: ActionSheetController,
    public excelService: ExcelService,
    public clienteService: ClienteService,
    public contratoService: ContratoService,
    public conductoraService: ConductoraService,
    public carreraService: CarreraService,
    public depositoService: DepositoService,
    public vehiculoService: VehiculoService
  ) { }

  ngOnInit() {
    this.listarClientes();
    this.conductoraService.listaConductoras().subscribe(cond=>{
      this.lstConductora = Object.assign(cond);
    });
    this.carreraService.listCarreras().subscribe(carr => {
      this.lstCarrera = Object.assign(carr);
    });
    this.vehiculoService.listVehiculos().subscribe(veh=>{
      this.lstVehiculo = Object.assign(veh);
    })
  }

  public listarClientes(){
    this.clienteService.listaClientes().subscribe( cli =>{
      this.lstCliente = Object.assign(cli);
    });
  }

  guardarValor(){
    if(this.idCliente){
      this.obtenerContratoCliente(this.idCliente);
    }
  }

  obtenerContratoCliente(id){
    this.carreraService.getCarrerasPorCliente(parseInt(id)).subscribe(carr =>{
      carr.forEach(da => {
        if(da.idContrato){
          this.lstContrato.push(da);
        }
      });
    });
    this.depositoService.listaDepositosPorCliente(parseInt(id)).subscribe(dep =>{
      this.lstDeposito = Object.assign(dep);
    });
  }

  detalleClientes(){
    let plataforma = this.excelService.getDevice();
    const data = [['NOMBRE CONDUCTORA', 'IDCLIENTE', 'CLIENTE', 'FECHA', 'DIRECCION ORIGEN', 'DIRECCION DESTINO', 'Bs.', 'TIPO DE PAGO']];
    this.lstContrato.forEach(valores=>{
      data.push([valores.nombreConductora, valores.idUsuario, valores.nombreCliente, valores.fechaInicio,
                  valores.direccionInicio, valores.direccionDestino, valores.costo, valores.tipoPago]);
    });
    if (plataforma === 'android' || plataforma === 'ios') {
      this.excelService.exportarExcel(data);
    } else {
      this.exportAsXLSX(data);
    }
  }
  depositoControl(){
    let plataforma = this.excelService.getDevice();
    const data2 = [['IDCLIENTE', 'CLIENTE', 'FECHA', 'Bs.', 'OBSERVACION', 'VERIFICADO']];
    this.lstDeposito.forEach(valores=>{
      data2.push([valores.idCliente, valores.nombreCliente, valores.fecha, valores.monto,
                 valores.observaciones, valores.verificado])
    });
    if (plataforma === 'android' || plataforma === 'ios') {
      this.excelService.exportarExcel(data2);
    } else {
      this.exportAsXLSX(data2);
    }
  }
  public estadoClientes(){
    let plataforma = this.excelService.getDevice();
    this.clienteService.listaClientes().subscribe(cli => {
      this.lstCliente = Object.assign(cli);
    });
    const data3 = [['IDCLIENTE', 'CLIENTE', 'CELULAR', 'EMAIL', 'ESTADO', 'FECHA INICIO']];
    this.lstCliente.forEach(val=>{
      data3.push([val.id, val.nombre, val.cel, val.email, val.estado, ' '])
    });
    if (plataforma === 'android' || plataforma === 'ios') {
      this.excelService.exportarExcel(data3);
    } else {
      this.exportAsXLSX(data3);
    }
  }
  public tarifaRef(){
    let plataforma = this.excelService.getDevice();
    const data4 = [['DIRECCION ORIGEN', 'DIRECCION DESTINO', 'Bs.']];
    this.lstCarrera.forEach(val=>{
      data4.push([val.direccionInicio, val.direccionDestino, val.costo])
    });
    if (plataforma === 'android' || plataforma === 'ios') {
      this.excelService.exportarExcel(data4);
    } else {
      console.log(data4)
      this.exportAsXLSX(data4);
    }
  }
  public estadoCond(){
    let plataforma = this.excelService.getDevice();
    const data5 = [['CARNET', 'CONDUCTORA', 'CELULAR', 'TELEFONO', 'ESTADO', 'MODELO VEHICULO', 'PLACA VEHICULO']];
    this.lstConductora.forEach(val1 => {
      this.lstVehiculo.forEach(val2 => {
        if(val2){
          if(val2.idConductora===val1.id){
            data5.push([val1.ci, val1.nombre + ' ' + val1.paterno + ' ' + val1.materno,
            val1.celular, val1.telefono, val1.estado, val2.modelo, val2.placa]);
          }
        } else {
          data5.push([val1.ci, val1.nombre + ' ' + val1.paterno + ' ' + val1.materno,
            val1.celular, val1.telefono, val1.estado, 'no posee vehiculo registrado', 'no posee vehiculo registrado']);
        }
      });
    });
    if (plataforma === 'android' || plataforma === 'ios') {
      this.excelService.exportarExcel(data5);
    } else {
      console.log("estaods")
      console.log(data5);
      this.exportAsXLSX(data5);
    }
  }
  public efecDep(){
    let plataforma = this.excelService.getDevice();
    const data4 = [['DIRECCION ORIGEN', 'DIRECCION DESTINO', 'Bs.', 'TIPO DE PAGO']];
    this.lstCarrera.forEach(val=>{
      data4.push([val.direccionInicio, val.direccionDestino, val.costo, val.tipoPago])
    });
    if (plataforma === 'android' || plataforma === 'ios') {
      this.excelService.exportarExcel(data4);
    } else {
      console.log(data4)
      this.exportAsXLSX(data4);
    }
  }
  public pers(){
    let plataforma = this.excelService.getDevice();
    const data4 = [['DIRECCION ORIGEN', 'DIRECCION DESTINO', 'Bs.', 'EMPRESA/HOTEL']];
    this.lstCarrera.forEach(val=>{
      data4.push([val.direccionInicio, val.direccionDestino, val.costo, 'no se especifica'])
    });
    if (plataforma === 'android' || plataforma === 'ios') {
      this.excelService.exportarExcel(data4);
    } else {
      console.log(data4)
      this.exportAsXLSX(data4);
    }
  }
  exportAsXLSX(data): void {
    this.excelService.exportAsExcelFile(data, 'sample');
  }
}

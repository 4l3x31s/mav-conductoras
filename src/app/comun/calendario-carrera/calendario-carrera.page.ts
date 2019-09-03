import { NavParamService } from './../../services/nav-param.service';
import { DetalleCarreraPage } from './../detalle-carrera/detalle-carrera.page';
import { MdlCarrera } from './../../modelo/mdlCarrera';
import { MdlCliente } from './../../modelo/mdlCliente';
import { ClienteService } from 'src/app/services/db/cliente.service';
import { AlertService } from 'src/app/services/util/alert.service';
import { LoadingService } from 'src/app/services/util/loading.service';
import { CarreraService } from './../../services/db/carrera.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { NavController, ModalController } from '@ionic/angular';
import { EventInput } from '@fullcalendar/core';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-calendario-carrera',
  templateUrl: './calendario-carrera.page.html',
  styleUrls: ['./calendario-carrera.page.scss'],
})
export class CalendarioCarreraPage implements OnInit {

  calendarPlugins = [dayGridPlugin, interactionPlugin];

  @ViewChild('calendar')
  calendarComponent: FullCalendarComponent;

  public cliente: MdlCliente;
  carreras: MdlCarrera[];
  calendarEvents: EventInput[] = [];

  constructor(
    public carreraService: CarreraService,
    public sesionService: SesionService,
    public loadingService: LoadingService,
    public alertService: AlertService,
    public navController: NavController,
    public modalController: ModalController,
    public clienteService: ClienteService,
    public navParams: NavParamService,
  ) { }

  ngOnInit() {
    this.cargarDatos();
  }
  cargarDatos() {
    this.loadingService.present()
      .then(() => {

        if (this.navParams.get().cliente) {
          this.cliente = this.navParams.get().cliente;
          this.obtenerCarreras();
        } else {
          this.alertService.present('Error', 'Error al recuperar sesion.');
          this.navController.navigateRoot('/lista-clientes');
        }
      });
  }
  obtenerCarreras() {
    this.carreraService.getCarrerasPorCliente(this.cliente.id)
      .subscribe(carreras => {
        this.loadingService.dismiss();
          this.carreras = carreras;
          this.calendarEvents = [];
          if (this.carreras && this.carreras.length > 0) {
            this.carreras.forEach(element => {
              let nomConductora = '';
              if(element.nombreConductora) {
                nomConductora = element.nombreConductora;
              }
              this.calendarEvents = this.calendarEvents.concat({
                title: element.costo + 'Bs. ' + nomConductora,
                start: element.fechaInicio,
                idCarrera: element.id,
                backgroundColor: this.clienteService.getColorPorCliente(element)
              });
            });
          }
        },
        error => {
          console.error(error);
          this.alertService.present('Error', 'Error al recuperar las carreras.');
          this.navController.navigateRoot('/login');
        });
  }

  handleDateClick(event) {
  }

  async handleEventClick(event) {
    let carreraSeleccionada:MdlCarrera = this.carreras.find(x => x.id == event.event.extendedProps.idCarrera);

    const modal = await this.modalController.create({
      component: DetalleCarreraPage,
      componentProps: {
        carrera: carreraSeleccionada
      }
    });
    return await modal.present();
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CarreraService } from '../services/db/carrera.service';
import { SesionService } from '../services/sesion.service';
import { MdlConductora } from '../modelo/mldConductora';
import { LoadingService } from '../services/util/loading.service';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { MdlCarrera } from '../modelo/mdlCarrera';
import { AlertService } from '../services/util/alert.service';
import { NavController, ModalController } from '@ionic/angular';
import { EventInput } from '@fullcalendar/core';
import { DetalleCarreraPage } from '../comun/detalle-carrera/detalle-carrera.page';
import { ClienteService } from '../services/db/cliente.service';
import { NavParamService } from '../services/nav-param.service';

@Component({
  selector: 'app-detalle-carreras',
  templateUrl: './detalle-carreras.page.html',
  styleUrls: ['./detalle-carreras.page.scss'],
})
export class DetalleCarrerasPage implements OnInit {
  
  // important!
  calendarPlugins = [dayGridPlugin, interactionPlugin];

  @ViewChild('calendar')
  calendarComponent: FullCalendarComponent;

  conductora: MdlConductora;
  carreras: MdlCarrera[];
  calendarEvents: EventInput[] = [];

  constructor(
    public carreraService:  CarreraService,
    public sesionService:   SesionService,
    public loadingService:  LoadingService,
    public alertService:    AlertService,
    public navController:   NavController,
    public modalController: ModalController,
    public clienteService:  ClienteService,
    public navParams:       NavParamService
  ) {
  }

  ngOnInit() {
    this.cargarDatos();
  }

  handleDateClick(event) {
  }

  async handleEventClick(event) {
    let carreraSeleccionada: MdlCarrera = this.carreras.find(x => x.id === event.event.extendedProps.idCarrera);

    const modal = await this.modalController.create({
      component: DetalleCarreraPage,
      componentProps: {
        carrera: carreraSeleccionada
      }
    });
    modal.onDidDismiss().then(() => {
      this.cargarDatos();
    });
    return await modal.present();
  }

  public cargarDatos() {
    this.loadingService.present()
      .then(() => {
        if (this.navParams.get().conductora) {
          this.conductora = this.navParams.get().conductora;
          this.obtenerCarreras();
        } else {
          this.sesionService.getSesion()
            .subscribe(conductora => {
              this.conductora = conductora;
              this.obtenerCarreras();
            }, error => {
              console.error(error);
              this.alertService.present('Error', 'Error al recuperar sesion.');
              this.navController.navigateRoot('/login');
            });
        }
      });
  }
  obtenerCarreras() {
    this.carreraService.getCarrerasPorConductora(this.conductora.id)
      .subscribe(carreras => {
        this.loadingService.dismiss();
        this.carreras = carreras;
        this.calendarEvents = [];
        if (this.carreras && this.carreras.length > 0) {
          this.carreras.forEach(element => {
            let cadena = '';
            if (element.estado !== 3) {
              cadena = '*';
            }
            this.calendarEvents = this.calendarEvents.concat({
              title: cadena + ' ' + element.costo + 'Bs. ' + element.nombreCliente,
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
}

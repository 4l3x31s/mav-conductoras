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
    public carreraService: CarreraService,
    public sesionService: SesionService,
    public loadingService: LoadingService,
    public alertService: AlertService,
    public navController: NavController,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    this.loadingService.present()
      .then(() => {
        this.sesionService.getSesion()
          .then(conductora => {
            this.conductora = conductora;
            this.carreraService.getCarrerasPorConductora(this.conductora.id)
              .subscribe(carreras => {
                this.loadingService.dismiss();
                this.carreras = carreras;
                this.calendarEvents = [];
                if (this.carreras && this.carreras.length > 0) {
                  this.carreras.forEach(element => {
                    this.calendarEvents = this.calendarEvents.concat({
                      title: 'Carrera',
                      start: element.fechaInicio,
                      idCarrera: element.id,
                      backgroundColor: 'red'
                    })
                  });
                }
              },
              error => {
                console.error(error);
                this.alertService.present('Error', 'Error al recuperar las carreras.');
                this.navController.navigateRoot('/login');
              })
          })
          .catch(e => {
            console.error(e);
            this.alertService.present('Error', 'Error al recuperar sesion.');
            this.navController.navigateRoot('/login');
          })
      });
  }

  handleDateClick(event) {
    console.log(event);
  }

  async handleEventClick(event) {
    //console.log(event.event.extendedProps.idCarrera);
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

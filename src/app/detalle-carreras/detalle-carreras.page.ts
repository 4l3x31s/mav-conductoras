import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-detalle-carreras',
  templateUrl: './detalle-carreras.page.html',
  styleUrls: ['./detalle-carreras.page.scss'],
})
export class DetalleCarrerasPage implements OnInit {

  calendarPlugins = [dayGridPlugin]; // important!
  @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template

  constructor() { }

  ngOnInit() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate('2000-01-01');
  }

}

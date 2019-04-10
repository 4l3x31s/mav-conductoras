import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {
  calendarPlugins = [dayGridPlugin]; // important!
  // docs full calendar angular
  // https://fullcalendar.io/docs/angular
  constructor() { }

  ngOnInit() {
  }

}

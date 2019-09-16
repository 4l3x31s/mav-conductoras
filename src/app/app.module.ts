
import { MapaPageModule } from './comun/mapa/mapa.module';
import { AdminService } from './services/db/admin.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DetalleCarreraPageModule } from './comun/detalle-carrera/detalle-carrera.module';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { TerminarCarreraPageModule } from './comun/terminar-carrera/terminar-carrera.module';
import { IonicRatingModule } from 'ionic4-rating';
import { ClientePageModule } from './comun/cliente/cliente.module';
import { FCM } from '@ionic-native/fcm/ngx';
import { HttpClientModule } from '@angular/common/http';
import { ExcelService } from './services/excel.service';
import {File} from '@ionic-native/file/ngx';
import { Device } from '@ionic-native/device/ngx';

export const firebaseConfig = {
    apiKey: 'AIzaSyCC22o8Imks6DbAf4DXrxgtW_wPE6XYLHs',
    authDomain: 'mav-db.firebaseapp.com',
    databaseURL: 'https://mav-db.firebaseio.com',
    projectId: 'mav-db',
    storageBucket: 'mav-db.appspot.com',
    messagingSenderId: '69193804419',
    appId: '1:69193804419:web:6c522a0e26f79eb5'
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicRatingModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    MapaPageModule,
    DetalleCarreraPageModule,
    TerminarCarreraPageModule,
    ClientePageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    AdminService,
    SQLite,
    Geolocation,
    InAppBrowser,
    LocalNotifications,
    ExcelService,
    FCM,
    File,
    Device,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

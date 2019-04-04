import { Injectable } from '@angular/core';
import { MdlConductora } from '../modelo/mldConductora';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  
  db: SQLiteObject;

  constructor(
    private sqlite: SQLite
  ) { }

  getDB(): Promise<SQLiteObject> {
    if (this.db == undefined) {
      return this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.db = db;
          return Promise.resolve(this.db);
        })
        .catch(e => {
          return Promise.reject(e);
        });
    } else {
      return Promise.resolve(this.db);
    }
  }

  setConductoraSesion(conductora: MdlConductora): Promise<any> {
    return this.getDB()
      .then((db: SQLiteObject) => {
        try{
          let udpates=[];
          udpates.push([
            "delete from conductora_sesion"
          ]);
          udpates.push([
            "insert into conductora_sesion values(?,?,?,?)",
            [conductora.id, conductora.nombre, conductora.materno, conductora.paterno]
          ]);
          return db.sqlBatch(udpates)
              .then(() => {
                return Promise.resolve();
              })
              .catch(e => {
                return Promise.reject(e);
              });
        } catch (error) {
          return Promise.reject(error);
        }
      });
  }

  getConductoraSesion(): Promise<MdlConductora> {
    return this.getDB()
      .then((db: SQLiteObject) => {
        return db.executeSql('select * from conductora', [])
          .then((data) => {
            let conductora: MdlConductora;
            if (data.rows.length > 0) {
              conductora=new MdlConductora(
                data.rows.item(0).id,
                data.rows.item(0).nombre,
                data.rows.item(0).paterno,
                data.rows.item(0).materno,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
              );
            }
            return Promise.resolve(conductora);
          })
          .catch(e => {
            return Promise.reject(e);
          });
      });
  }

  crearBD(): Promise<any> {
    return this.getDB()
      .then((db: SQLiteObject) => {
        let ddl=[];
        ddl.push([
          "create table IF NOT EXISTS conductora (id, nombre, paterno, materno)", []
        ]);
        return db.sqlBatch(ddl)
          .then(() => {
            return Promise.resolve();
          })
          .catch(e => {
            return Promise.reject(e);
          });
      });
  }
  
}

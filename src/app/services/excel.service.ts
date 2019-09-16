import { Injectable } from '@angular/core';
import {File} from '@ionic-native/file/ngx';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Platform } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(
    public file: File,
    public platform: Platform,
    public device: Device
    ) { }
  public getDevice(): string {
    if (this.device.platform != null) {
      return this.device.platform.toLowerCase();
    } else {
      return 'browser';
    }
  }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
     FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }

  public getStoragePath()
    {
        let file = this.file;
        return this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then(function (directoryEntry) {
            return file.getDirectory(directoryEntry, "mav", {
                create: true,
                exclusive: false
            }).then(function () {
                return directoryEntry.nativeURL + "mav/";
            });
        });
    }
  public exportarExcel(data: any) {
    let sheet = XLSX.utils.json_to_sheet(data);
    let wb = {
        SheetNames: ["export"],
        Sheets: {
            "export": sheet
        }
    };

    let wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
    });

    function s2ab(s) {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    let blob = new Blob([s2ab(wbout)], {type: 'application/octet-stream'});
    let self = this;
    this.getStoragePath().then(function (url) {
        self.file.writeFile(url, "export" + Date.now() + ".xlsx", blob).then(() => {
            alert("file created at: " + url);
        }).catch(() => {
            alert("error creating file at :" + url);
        });
    });
  }
}

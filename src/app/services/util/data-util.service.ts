import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataUtilService {
  public param: any;
  constructor() { }
  get () {
    return this.param;
  }
  set (param: any) {
    this.param = param;
  }
}

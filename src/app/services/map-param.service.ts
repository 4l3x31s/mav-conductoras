import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapParamService {
  private param: any;
  constructor() { }
  public set(param: any) {
    this.param = param;
  }
  public get() {
    return this.param;
  }
}

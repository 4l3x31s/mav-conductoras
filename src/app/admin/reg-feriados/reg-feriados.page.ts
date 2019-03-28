import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MdlFeriados } from 'src/app/modelo/mdlFeriados';

@Component({
  selector: 'app-reg-feriados',
  templateUrl: './reg-feriados.page.html',
  styleUrls: ['./reg-feriados.page.scss'],
})
export class RegFeriadosPage implements OnInit {
  frmFeriados: FormGroup;
  public feriados: MdlFeriados = new MdlFeriados(null,null,null,null);
  constructor(
    public fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.initValidaciones();
  }
  get f() { return this.frmFeriados.controls; }
  initValidaciones() {
    this.frmFeriados = this.fb.group({
      vFechaFeriado: ['', [
        Validators.required,
      ]],
      vDescFeriado: ['', [
        Validators.required,
      ]],
      vEstado: ['', [
        Validators.required,
      ]]
    });
  }
}

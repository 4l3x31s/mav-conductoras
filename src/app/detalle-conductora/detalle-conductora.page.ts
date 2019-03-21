import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MdlConductora } from '../modelo/mldConductora';
import { ConductoraService } from '../services/db/conductora.service';

@Component({
  selector: 'app-detalle-conductora',
  templateUrl: './detalle-conductora.page.html',
  styleUrls: ['./detalle-conductora.page.scss'],
})
export class DetalleConductoraPage implements OnInit {

  form: FormGroup;

  conductora:MdlConductora;

  constructor(
    public fb: FormBuilder,
    public conductoraService: ConductoraService
  ) { }

  iniciarValidaciones() {
    this.form = this.fb.group({
      vnombre: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50),
      ]],
      vpaterno: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50),
      ]],
      vmaterno: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50),
      ]],
    });
  }
  get f() { return this.form.controls; }

  ngOnInit() {
    this.conductora = this.conductoraService.getConductoraSesion();
    this.iniciarValidaciones();
  }

}

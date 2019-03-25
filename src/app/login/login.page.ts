import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SesionService } from '../services/sesion.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;
  public user: string;
  public pass: string;

  constructor(
    public fb: FormBuilder,
    public sesionService: SesionService
  ) { }

  ngOnInit() {
    this.iniciaValidaciones();
  }
  iniciaValidaciones() {
    this.form = this.fb.group({
      vuser: ['', [
        Validators.required,
      ]],
      vpass: ['', [
        Validators.required,
      ]]
    });
  }
  get f() { return this.form.controls; }

  ingresar(){
    this.sesionService.login(this.user, this.pass)
      .subscribe(conductora=>{
        console.log('login',conductora);
      });
  }
}

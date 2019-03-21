import { Component, OnInit } from '@angular/core';
import { MdlCliente } from '../modelo/mdlCliente';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  myForm: FormGroup;
  public txtPruebaInput: string;
  public nombre: string = 'Edwin';

  constructor(public fb: FormBuilder) { }

  ngOnInit() {
    this.iniciaValidaciones();
  }
  iniciaValidaciones() {
  this.myForm = this.fb.group({
    vPruebaInput: ['', [
      Validators.required,
      ]]
  });
}
get f() { return this.myForm.controls; }


public nombreFunc() {
    console.log(this.txtPruebaInput);
  }

}

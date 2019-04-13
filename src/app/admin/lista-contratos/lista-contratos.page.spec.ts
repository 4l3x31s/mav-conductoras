import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaContratosPage } from './lista-contratos.page';

describe('ListaContratosPage', () => {
  let component: ListaContratosPage;
  let fixture: ComponentFixture<ListaContratosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaContratosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaContratosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

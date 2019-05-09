import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaFeriadosPage } from './lista-feriados.page';

describe('ListaFeriadosPage', () => {
  let component: ListaFeriadosPage;
  let fixture: ComponentFixture<ListaFeriadosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaFeriadosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaFeriadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

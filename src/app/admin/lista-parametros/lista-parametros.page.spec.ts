import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaParametrosPage } from './lista-parametros.page';

describe('ListaParametrosPage', () => {
  let component: ListaParametrosPage;
  let fixture: ComponentFixture<ListaParametrosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaParametrosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaParametrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

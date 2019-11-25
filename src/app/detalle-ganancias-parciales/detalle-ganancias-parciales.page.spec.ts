import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleGananciasParcialesPage } from './detalle-ganancias-parciales.page';

describe('DetalleGananciasParcialesPage', () => {
  let component: DetalleGananciasParcialesPage;
  let fixture: ComponentFixture<DetalleGananciasParcialesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleGananciasParcialesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleGananciasParcialesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleGananciasPage } from './detalle-ganancias.page';

describe('DetalleGananciasPage', () => {
  let component: DetalleGananciasPage;
  let fixture: ComponentFixture<DetalleGananciasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleGananciasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleGananciasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

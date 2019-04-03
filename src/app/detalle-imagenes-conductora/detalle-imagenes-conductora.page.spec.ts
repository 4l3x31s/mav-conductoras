import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleImagenesConductoraPage } from './detalle-imagenes-conductora.page';

describe('DetalleImagenesConductoraPage', () => {
  let component: DetalleImagenesConductoraPage;
  let fixture: ComponentFixture<DetalleImagenesConductoraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleImagenesConductoraPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleImagenesConductoraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

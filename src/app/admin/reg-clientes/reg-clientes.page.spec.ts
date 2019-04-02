import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegClientesPage } from './reg-clientes.page';

describe('RegClientesPage', () => {
  let component: RegClientesPage;
  let fixture: ComponentFixture<RegClientesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegClientesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegFeriadosPage } from './reg-feriados.page';

describe('RegFeriadosPage', () => {
  let component: RegFeriadosPage;
  let fixture: ComponentFixture<RegFeriadosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegFeriadosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegFeriadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegAbonoPage } from './reg-abono.page';

describe('RegAbonoPage', () => {
  let component: RegAbonoPage;
  let fixture: ComponentFixture<RegAbonoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegAbonoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegAbonoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

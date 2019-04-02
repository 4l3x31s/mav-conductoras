import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegDepositosPage } from './reg-depositos.page';

describe('RegDepositosPage', () => {
  let component: RegDepositosPage;
  let fixture: ComponentFixture<RegDepositosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegDepositosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegDepositosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesReportesPage } from './informes-reportes.page';

describe('InformesReportesPage', () => {
  let component: InformesReportesPage;
  let fixture: ComponentFixture<InformesReportesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformesReportesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformesReportesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

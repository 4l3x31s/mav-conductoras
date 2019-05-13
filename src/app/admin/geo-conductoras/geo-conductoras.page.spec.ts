import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoConductorasPage } from './geo-conductoras.page';

describe('GeoConductorasPage', () => {
  let component: GeoConductorasPage;
  let fixture: ComponentFixture<GeoConductorasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoConductorasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoConductorasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

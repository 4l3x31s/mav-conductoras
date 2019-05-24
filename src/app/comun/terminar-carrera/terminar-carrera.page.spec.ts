import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminarCarreraPage } from './terminar-carrera.page';

describe('TerminarCarreraPage', () => {
  let component: TerminarCarreraPage;
  let fixture: ComponentFixture<TerminarCarreraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminarCarreraPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminarCarreraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

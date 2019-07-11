import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModCarreraPage } from './mod-carrera.page';

describe('ModCarreraPage', () => {
  let component: ModCarreraPage;
  let fixture: ComponentFixture<ModCarreraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModCarreraPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModCarreraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

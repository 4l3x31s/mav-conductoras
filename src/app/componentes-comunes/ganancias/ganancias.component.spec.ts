import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GananciasComponent } from './ganancias.component';

describe('GananciasComponent', () => {
  let component: GananciasComponent;
  let fixture: ComponentFixture<GananciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GananciasComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GananciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

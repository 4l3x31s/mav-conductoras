import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaConductorasPage } from './lista-conductoras.page';

describe('ListaConductorasPage', () => {
  let component: ListaConductorasPage;
  let fixture: ComponentFixture<ListaConductorasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaConductorasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaConductorasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

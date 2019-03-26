import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaConductoraPage } from './busca-conductora.page';

describe('BuscaConductoraPage', () => {
  let component: BuscaConductoraPage;
  let fixture: ComponentFixture<BuscaConductoraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscaConductoraPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscaConductoraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

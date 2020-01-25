import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleConductoraAdminPage } from './detalle-conductora-admin.page';

describe('DetalleConductoraAdminPage', () => {
  let component: DetalleConductoraAdminPage;
  let fixture: ComponentFixture<DetalleConductoraAdminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleConductoraAdminPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleConductoraAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

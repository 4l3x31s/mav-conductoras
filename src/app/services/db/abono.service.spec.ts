import { TestBed } from '@angular/core/testing';

import { AbonoService } from './abono.service';

describe('AbonoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AbonoService = TestBed.get(AbonoService);
    expect(service).toBeTruthy();
  });
});

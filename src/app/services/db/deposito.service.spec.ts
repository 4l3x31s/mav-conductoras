import { TestBed } from '@angular/core/testing';

import { DepositoService } from './deposito.service';

describe('DepositoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DepositoService = TestBed.get(DepositoService);
    expect(service).toBeTruthy();
  });
});

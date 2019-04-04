import { TestBed } from '@angular/core/testing';

import { CalcularDistanciaTiempoService } from './calcular-distancia-tiempo.service';

describe('CalcularDistanciaTiempoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalcularDistanciaTiempoService = TestBed.get(CalcularDistanciaTiempoService);
    expect(service).toBeTruthy();
  });
});

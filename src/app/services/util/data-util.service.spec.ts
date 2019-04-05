import { TestBed } from '@angular/core/testing';

import { DataUtilService } from './data-util.service';

describe('DataUtilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataUtilService = TestBed.get(DataUtilService);
    expect(service).toBeTruthy();
  });
});

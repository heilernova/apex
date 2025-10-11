import { TestBed } from '@angular/core/testing';

import { CountryDataSource } from './country-data-source';

describe('CountryDataSource', () => {
  let service: CountryDataSource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryDataSource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { GeoDataSource } from './geo-data-source';

describe('GeoDataSource', () => {
  let service: GeoDataSource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoDataSource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

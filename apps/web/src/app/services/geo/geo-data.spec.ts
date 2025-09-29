import { TestBed } from '@angular/core/testing';

import { GeoData } from './geo-data';

describe('GeoData', () => {
  let service: GeoData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

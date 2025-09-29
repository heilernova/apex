import { TestBed } from '@angular/core/testing';

import { GeoClient } from '../geo-client/geo-client';

describe('GeoClient', () => {
  let service: GeoClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

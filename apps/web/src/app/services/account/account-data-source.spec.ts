import { TestBed } from '@angular/core/testing';

import { AccountDataSource } from './account-data-source';

describe('AccountDataSource', () => {
  let service: AccountDataSource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountDataSource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

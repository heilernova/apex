import { TestBed } from '@angular/core/testing';

import { AccountClient } from './account-client';

describe('AccountClient', () => {
  let service: AccountClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

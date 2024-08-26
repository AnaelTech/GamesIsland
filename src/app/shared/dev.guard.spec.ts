import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { devGuard } from './dev.guard';

describe('devGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => devGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

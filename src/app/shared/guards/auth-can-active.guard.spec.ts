import { TestBed } from '@angular/core/testing';

import { AuthCanActiveGuard } from './auth-can-active.guard';

describe('AuthCanActiveGuard', () => {
  let guard: AuthCanActiveGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthCanActiveGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

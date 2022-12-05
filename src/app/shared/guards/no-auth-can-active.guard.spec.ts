import { TestBed } from '@angular/core/testing';

import { NoAuthCanActiveGuard } from './no-auth-can-active.guard';

describe('NoAuthCanActiveGuard', () => {
  let guard: NoAuthCanActiveGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NoAuthCanActiveGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

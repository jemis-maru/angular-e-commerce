import { TestBed } from '@angular/core/testing';

import { AdminAuthCanActiveGuard } from './admin-auth-can-active.guard';

describe('AdminAuthCanActiveGuard', () => {
  let guard: AdminAuthCanActiveGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminAuthCanActiveGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

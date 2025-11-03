import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

class AuthServiceStub {
  isAuthenticated = jasmine.createSpy('isAuthenticated');
  logout = jasmine.createSpy('logout');
  authStatus$ = { subscribe: () => ({ unsubscribe: () => undefined }) } as any;
  getToken(): string | null {
    return null;
  }
}

describe('AuthGuard', () => {
  let authService: AuthServiceStub;
  let router: Router;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useClass: AuthServiceStub }],
    });

    authService = TestBed.inject(AuthService) as unknown as AuthServiceStub;
    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate').and.resolveTo(true);
  });

  it('allows navigation when the user is authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => AuthGuard({} as any, {} as any));

    expect(result).toBeTrue();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('redirects to login when the user is not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => AuthGuard({} as any, {} as any));

    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login'], jasmine.any(Object));
  });
});

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  void router.navigate(['/auth/login'], {
    state: {
      errorMessage: $localize`برای دسترسی به این بخش ابتدا وارد حساب کاربری خود شوید.`,
    },
  });
  return false;
};

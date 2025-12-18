import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';

import { BusinessOwnerService } from '../../../services/business-owner.service';
import { BusinessProfileStateService } from '../state/business-profile-state.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Injectable({ providedIn: 'root' })
export class BusinessProfileGuard implements CanActivate, CanActivateChild {
  constructor(
    private readonly profileState: BusinessProfileStateService,
    private readonly router: Router,
    private readonly businessOwnerService: BusinessOwnerService,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
  ) {}

  canActivate(_route: unknown, state: RouterStateSnapshot): ReturnType<BusinessProfileGuard['evaluateAccess']> {
    return this.evaluateAccess(state.url);
  }

  canActivateChild(_childRoute: unknown, state: RouterStateSnapshot): ReturnType<BusinessProfileGuard['evaluateAccess']> {
    return this.evaluateAccess(state.url);
  }

  private evaluateAccess(targetUrl: string): Observable<boolean | UrlTree> | boolean | UrlTree {
    const isProfileRoute = targetUrl.includes('/business/profile-setup');
    const businessOwnerId = this.authService.userId;

    if (!businessOwnerId) {
      this.toastService.error($localize`شناسه کاربر یافت نشد. لطفاً دوباره وارد شوید.`);
      void this.router.navigate(['/auth/login'], { state: { errorMessage: $localize`برای ادامه وارد شوید.` } });
      this.authService.clearStoredToken();
      return false;
    }

    if (this.profileState.isProfileCompleted) {
      return true;
    }

    return this.businessOwnerService.checkBusinessOwnerProfile(businessOwnerId).pipe(
      map(response => {
        const message = response.message?.trim();
        const isCompleted = response.isSuccess;

        if (isCompleted) {
          this.profileState.completeProfile();

          if (isProfileRoute) {
            return this.router.createUrlTree(['/business/customers']);
          }

          return true;
        }

        if (message?.includes('دسترسی ندارید')) {
          this.toastService.error(message);
          void this.router.navigate(['/auth/login'], { state: { errorMessage: message } });
          this.authService.clearStoredToken();
          return false;
        }

        this.toastService.info(
          message || $localize`جهت مشاهده داشبورد کسب و کار باید پروفایل خود را تکمیل کنید`,
        );
        return this.router.createUrlTree(['/business/profile-setup']);
      }),
      catchError(() => {
        this.toastService.error($localize`خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.`);
        return of(this.router.createUrlTree(['/business/profile-setup']));
      }),
    );
  }
}

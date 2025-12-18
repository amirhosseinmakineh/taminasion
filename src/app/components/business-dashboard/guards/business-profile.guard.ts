import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';

import { BusinessOwnerService } from '../../../services/business-owner.service';
import { BusinessProfileStateService } from '../state/business-profile-state.service';

@Injectable({ providedIn: 'root' })
export class BusinessProfileGuard implements CanActivate, CanActivateChild {
  constructor(
    private readonly profileState: BusinessProfileStateService,
    private readonly router: Router,
    private readonly businessOwnerService: BusinessOwnerService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): ReturnType<BusinessProfileGuard['evaluateAccess']> {
    return this.evaluateAccess(route, state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): ReturnType<BusinessProfileGuard['evaluateAccess']> {
    return this.evaluateAccess(childRoute, state.url);
  }

  private evaluateAccess(
    route: ActivatedRouteSnapshot,
    targetUrl: string,
  ): Observable<boolean | UrlTree> | boolean | UrlTree {
    const isProfileRoute = targetUrl.includes('/business/profile-setup');
    const businessOwnerId = this.getBusinessOwnerId(route);

    if (!businessOwnerId) {
      return this.router.createUrlTree(['/auth/login'], {
        queryParams: { errorMessage: $localize`شناسه کاربر یافت نشد. لطفاً دوباره وارد شوید.` },
      });
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
            return this.router.createUrlTree(['/business/customers'], {
              queryParams: { id: businessOwnerId },
            });
          }

          return true;
        }

        if (message?.includes('دسترسی ندارید')) {
          return this.router.createUrlTree(['/auth/login'], {
            queryParams: { errorMessage: message },
          });
        }

        return this.router.createUrlTree(['/business/profile-setup'], {
          queryParams: {
            id: businessOwnerId,
            errorMessage:
              message || $localize`جهت مشاهده داشبورد کسب و کار باید پروفایل خود را تکمیل کنید`,
          },
        });
      }),
      catchError(() =>
        of(
          this.router.createUrlTree(['/business/profile-setup'], {
            queryParams: {
              id: businessOwnerId,
              errorMessage: $localize`جهت مشاهده داشبورد کسب و کار باید پروفایل خود را تکمیل کنید`,
            },
          }),
        ),
      ),
    );
  }

  private getBusinessOwnerId(route: ActivatedRouteSnapshot): string | null {
    return route.queryParamMap.get('id') ?? route.parent?.queryParamMap.get('id') ?? null;
  }
}

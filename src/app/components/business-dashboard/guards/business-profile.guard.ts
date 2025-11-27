import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BusinessProfileStateService } from '../state/business-profile-state.service';

@Injectable({ providedIn: 'root' })
export class BusinessProfileGuard implements CanActivate, CanActivateChild {
  constructor(private profileState: BusinessProfileStateService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.evaluateAccess(state.url);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.evaluateAccess(state.url);
  }

  private evaluateAccess(targetUrl: string): boolean | UrlTree {
    const isProfileRoute = targetUrl.includes('/business/profile-setup');

    if (!this.profileState.isProfileCompleted && !isProfileRoute) {
      return this.router.createUrlTree(['/business/profile-setup']);
    }

    return true;
  }
}

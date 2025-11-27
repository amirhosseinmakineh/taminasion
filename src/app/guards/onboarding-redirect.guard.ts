import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { OnboardingService } from '../services/onboarding.service';

@Injectable({ providedIn: 'root' })
export class OnboardingRedirectGuard implements CanActivate {
  constructor(private onboardingService: OnboardingService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    return this.onboardingService.isOnboarded ? this.router.createUrlTree(['/app/dashboard']) : true;
  }
}

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private onboarded = false;

  // Mock flag used to gate access to the dashboard UI
  get isOnboarded(): boolean {
    return this.onboarded;
  }

  setOnboardingState(isComplete: boolean): void {
    this.onboarded = isComplete;
  }

  completeOnboarding(): void {
    this.onboarded = true;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BusinessProfileStateService {
  private profileCompletedSubject = new BehaviorSubject<boolean>(false);
  private profileCheckedSubject = new BehaviorSubject<boolean>(false);

  readonly profileCompleted$ = this.profileCompletedSubject.asObservable();
  readonly profileChecked$ = this.profileCheckedSubject.asObservable();

  get isProfileCompleted(): boolean {
    return this.profileCompletedSubject.value;
  }

  get isProfileChecked(): boolean {
    return this.profileCheckedSubject.value;
  }

  setProfileStatus(isCompleted: boolean): void {
    this.profileCompletedSubject.next(isCompleted);
    this.profileCheckedSubject.next(true);
  }

  completeProfile(): void {
    this.setProfileStatus(true);
  }

  markProfileIncomplete(): void {
    this.setProfileStatus(false);
  }
}

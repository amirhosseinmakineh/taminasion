import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BusinessProfileStateService {
  private profileCompletedSubject = new BehaviorSubject<boolean>(false);
  readonly profileCompleted$ = this.profileCompletedSubject.asObservable();

  get isProfileCompleted(): boolean {
    return this.profileCompletedSubject.value;
  }

  completeProfile(): void {
    this.profileCompletedSubject.next(true);
  }
}

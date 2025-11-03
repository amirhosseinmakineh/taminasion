import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';

import { BusinessOwnerProfile } from '../../models/user/business-owner-profile.model';
import { UserReservation, UserReservationsResponse } from '../../models/user/user-reservation.model';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  standalone: false,
})
export class UserDashboardComponent implements OnInit {
  profile: BusinessOwnerProfile | null = null;
  reservations: UserReservation[] = [];
  isProfileLoading = false;
  isReservationsLoading = false;
  profileError = '';
  reservationError = '';
  cancelFeedback = '';
  cancelFeedbackType: 'success' | 'error' | '' = '';

  constructor(private readonly userProfileService: UserProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadReservations();
  }

  loadProfile(): void {
    this.isProfileLoading = true;
    this.profileError = '';
    this.userProfileService
      .getBusinessOwnerProfile()
      .pipe(finalize(() => (this.isProfileLoading = false)))
      .subscribe({
        next: response => {
          if (response.isSuccess) {
            this.profile = response.data;
          } else {
            this.profileError = response.message || $localize`امکان دریافت اطلاعات حساب وجود ندارد.`;
          }
        },
        error: () => {
          this.profileError = $localize`دریافت اطلاعات حساب با خطا مواجه شد.`;
        },
      });
  }

  loadReservations(): void {
    this.isReservationsLoading = true;
    this.reservationError = '';
    this.userProfileService
      .getUserReservations()
      .pipe(finalize(() => (this.isReservationsLoading = false)))
      .subscribe({
        next: (response: UserReservationsResponse) => {
          if (response.isSuccess) {
            this.reservations = response.data ?? [];
          } else {
            this.reservationError = response.message || $localize`امکان دریافت رزروها وجود ندارد.`;
          }
        },
        error: () => {
          this.reservationError = $localize`دریافت رزروها با خطا مواجه شد.`;
        },
      });
  }

  cancelReservation(reservation: UserReservation): void {
    this.cancelFeedback = '';
    this.cancelFeedbackType = '';

    this.userProfileService.cancelReservation(reservation.id).subscribe({
      next: result => {
        if (result.isSuccess !== false) {
          this.reservations = this.reservations.filter(r => r.id !== reservation.id);
          this.cancelFeedback = result.message || $localize`رزرو با موفقیت لغو شد.`;
          this.cancelFeedbackType = 'success';
        } else {
          this.cancelFeedback = result.message || $localize`لغو رزرو با خطا روبه‌رو شد.`;
          this.cancelFeedbackType = 'error';
        }
      },
      error: () => {
        this.cancelFeedback = $localize`لغو رزرو با خطا روبه‌رو شد.`;
        this.cancelFeedbackType = 'error';
      },
    });
  }

  trackByReservation(_: number, reservation: UserReservation): number {
    return reservation.id;
  }
}

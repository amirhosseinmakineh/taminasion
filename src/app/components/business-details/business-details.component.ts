import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, finalize, map, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  BusinessAchievementDto,
  BusinessCommentDto,
  BusinessDetailDto,
  BusinessOwnerDayDto,
  BusinessOwnerTimeDto,
} from '../../models/business/business-detail.dto';
import { BusinessServiceDto } from '../../models/business/business-service.dto';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.css'],
  standalone: false,
})
export class BusinessDetailsComponent implements OnInit {
  activeTab: 'services' | 'schedule' | 'achievements' | 'comments' = 'services';
  businessDetail?: BusinessDetailDto;
  isLoading = false;
  errorMessage = '';

  private readonly dayNames: Record<number, string> = {
    1: 'یکشنبه',
    2: 'دوشنبه',
    3: 'سه‌شنبه',
    4: 'چهارشنبه',
    5: 'پنجشنبه',
    6: 'جمعه',
    7: 'شنبه',
  };

  constructor(
    private readonly businessService: BusinessService,
    private readonly route: ActivatedRoute,
    private readonly destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(() => {
          this.businessDetail = undefined;
          this.errorMessage = '';
          this.isLoading = false;
        }),
        map(params => params.get('id')),
        switchMap(idParam => {
          const id = idParam ? Number(idParam) : NaN;
          if (Number.isNaN(id) || id <= 0) {
            this.errorMessage = 'شناسه کسب‌وکار معتبر نیست.';
            return EMPTY;
          }
          this.isLoading = true;
          return this.businessService.getBusinessDetail(id).pipe(
            finalize(() => (this.isLoading = false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: detail => {
          this.businessDetail = detail;
          if (detail.businessServiceDtos?.length) {
            this.activeTab = 'services';
          } else if (detail.businessOwnerDayDtos?.some(day => day.businessOwnerTimes?.length)) {
            this.activeTab = 'schedule';
          } else if (detail.achievementDtos?.length) {
            this.activeTab = 'achievements';
          } else {
            this.activeTab = 'comments';
          }
        },
        error: () => {
          this.errorMessage = 'امکان دریافت اطلاعات کسب‌وکار وجود ندارد.';
        },
      });
  }

  setActiveTab(tab: 'services' | 'schedule' | 'achievements' | 'comments'): void {
    this.activeTab = tab;
  }

  getDayName(day: number): string {
    return this.dayNames[day] ?? 'روز نامشخص';
  }

  formatTime(time?: string | null): string {
    if (!time) {
      return 'زمان نامشخص';
    }
    return time.slice(0, 5);
  }

  formatPrice(amount?: number): string {
    return amount != null
      ? `${amount.toLocaleString('fa-IR')} تومان`
      : 'قیمت ثبت نشده';
  }

  formatCommentDate(dateValue?: string): string | null {
    if (!dateValue) {
      return null;
    }
    const date = new Date(dateValue);
    return Number.isNaN(date.getTime())
      ? null
      : date.toLocaleDateString('fa-IR');
  }

  getCommentText(comment: BusinessCommentDto): string {
    return comment.comment ?? comment.text ?? 'بدون متن';
  }

  getImageUrl(fileName?: string | null): string | null {
    if (!fileName) {
      return null;
    }
    return `http://localhost:5107/Images/${fileName}`;
  }

  trackByService(_: number, service: BusinessServiceDto): number {
    return service.serviceId;
  }

  trackByDay(_: number, day: BusinessOwnerDayDto): number {
    return day.id;
  }

  trackByTime(_: number, time: BusinessOwnerTimeDto): number {
    return time.id;
  }

  trackByAchievement(index: number, achievement: BusinessAchievementDto): string {
    return `${achievement.userId ?? 'user'}-${achievement.name}-${index}`;
  }

  trackByComment(index: number, comment: BusinessCommentDto): string {
    return `${comment.userId ?? 'user'}-${comment.id ?? index}`;
  }
}

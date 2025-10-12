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

type TabKey = 'about' | 'staff' | 'info' | 'reviews';

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.css'],
  standalone: false,
})
export class BusinessDetailsComponent implements OnInit {
  activeTab: TabKey = 'about';
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
          this.activeTab = this.getDefaultTab(detail);
        },
        error: () => {
          this.errorMessage = 'امکان دریافت اطلاعات کسب‌وکار وجود ندارد.';
        },
      });
  }

  setActiveTab(tab: TabKey): void {
    this.activeTab = tab;
  }

  private getDefaultTab(detail: BusinessDetailDto): TabKey {
    if (detail.description || detail.achievementDtos?.length) {
      return 'about';
    }
    if (detail.businessServiceDtos?.length) {
      return 'staff';
    }
    if (
      detail.cityName ||
      detail.regionName ||
      detail.neighberhoodName ||
      detail.businessOwnerDayDtos?.some(day => day.businessOwnerTimes?.length)
    ) {
      return 'info';
    }
    if (detail.commentDtos?.length) {
      return 'reviews';
    }
    return 'about';
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

  getServiceCountLabel(services?: BusinessServiceDto[] | null): string | null {
    const count = services?.length ?? 0;
    if (!count) {
      return null;
    }
    return `${count.toLocaleString('fa-IR')} خدمت ثبت‌شده`;
  }

  getAverageRating(comments?: BusinessCommentDto[] | null): string | null {
    if (!comments?.length) {
      return null;
    }
    const rates = comments
      .map(comment => comment.rate)
      .filter((rate): rate is number => typeof rate === 'number' && !Number.isNaN(rate));
    if (!rates.length) {
      return null;
    }
    const total = rates.reduce((sum, rate) => sum + rate, 0);
    const average = total / rates.length;
    return average.toLocaleString('fa-IR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  }

  getReviewCount(comments?: BusinessCommentDto[] | null): string | null {
    const count = comments?.length ?? 0;
    if (!count) {
      return null;
    }
    return `(${count.toLocaleString('fa-IR')})`;
  }

  getActiveDayCount(days?: BusinessOwnerDayDto[] | null): number {
    if (!days?.length) {
      return 0;
    }
    return days.filter(day => day.businessOwnerTimes?.length).length;
  }

  getAchievementColor(index: number): string {
    const colors: Array<'red' | 'blue' | 'pink'> = ['red', 'blue', 'pink'];
    return colors[index % colors.length];
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

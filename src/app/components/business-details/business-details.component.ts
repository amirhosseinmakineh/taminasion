import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { combineLatest, EMPTY, finalize, map, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  BusinessAchievementDto,
  BusinessCommentDto,
  BusinessDetailDto,
  BusinessOwnerDayDto,
  BusinessOwnerTimeDto,
} from '../../models/business/business-detail.dto';
import { BusinessServiceDto } from '../../models/business/business-service.dto';
import { BusinessService, BusinessReviewRequest } from '../../services/business.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.css'],
  standalone: false,
})
export class BusinessDetailsComponent implements OnInit {
  activeTab: 'about' | 'staff' | 'info' | 'reviews' = 'about';
  businessDetail?: BusinessDetailDto;
  isLoading = false;
  errorMessage = '';
  averageRating: number | null = null;
  ratingCount = 0;
  reviewFeedback = '';
  reviewFeedbackType: 'success' | 'error' | '' = '';
  isSubmittingReview = false;

  private readonly formBuilder = inject(FormBuilder);

  readonly reviewForm = this.formBuilder.nonNullable.group({
    comment: ['', [Validators.required, Validators.maxLength(500)]],
    rate: [5, [Validators.required]],
  });

  private readonly imageBaseUrl = environment.imageBaseUrl;

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
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(
        map(([params, queryParams]) => params.get('id') ?? queryParams.get('businessId')),
        switchMap(idParam => {
          const id = idParam ? Number(idParam) : NaN;
          if (Number.isNaN(id) || id <= 0) {
            this.errorMessage = $localize`شناسه کسب‌وکار معتبر نیست.`;
            return EMPTY;
          }
          this.isLoading = true;
          this.errorMessage = '';
          this.businessDetail = undefined;
          return this.businessService.getBusinessDetail(id).pipe(
            finalize(() => (this.isLoading = false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: detail => {
          this.businessDetail = detail;
          this.averageRating = this.calculateAverageRating(detail.commentDtos ?? []);
          this.ratingCount = detail.commentDtos?.length ?? 0;
          this.activeTab = 'about';
        },
        error: () => {
          this.errorMessage = $localize`امکان دریافت اطلاعات کسب‌وکار وجود ندارد.`;
        },
      });
  }

  setActiveTab(tab: 'about' | 'staff' | 'info' | 'reviews'): void {
    this.activeTab = tab;
  }

  getDayName(day: number): string {
    return this.dayNames[day] ?? 'روز نامشخص';
  }

  getInitial(name?: string): string {
    if (!name) {
      return '؟';
    }
    const trimmed = name.trim();
    return trimmed ? trimmed[0] : '؟';
  }

  getLogoUrl(logo?: string | null): string | null {
    if (!logo) {
      return null;
    }
    return `${this.imageBaseUrl}/${logo}`;
  }

  getBannerUrl(banner?: string | null): string {
    if (!banner) {
      return 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1350&q=80';
    }
    return `${this.imageBaseUrl}/${banner}`;
  }

  getWorkingHours(day: BusinessOwnerDayDto): string {
    if (!day.businessOwnerTimes?.length) {
      return 'تعطیل';
    }
    return day.businessOwnerTimes
      .map(time => `${this.formatTime(time.from)} تا ${this.formatTime(time.to)}`)
      .join('، ');
  }

  hasWorkingHours(days: BusinessOwnerDayDto[] | undefined): boolean {
    return !!days?.some(day => day.businessOwnerTimes?.length);
  }

  getCommentText(comment: BusinessCommentDto): string {
    return comment.comment ?? comment.text ?? 'بدون متن';
  }

  formatTime(value?: string | null): string {
    if (!value) {
      return '00:00';
    }
    return value.slice(0, 5);
  }

  formatCurrency(amount?: number): string {
    if (amount == null) {
      return 'نامشخص';
    }
    return `${amount.toLocaleString('fa-IR')} تومان`;
  }

  getAchievementColor(index: number): 'red' | 'blue' | 'pink' {
    const colors: Array<'red' | 'blue' | 'pink'> = ['red', 'blue', 'pink'];
    return colors[index % colors.length];
  }

  trackByService(_: number, service: BusinessServiceDto): number {
    return service.serviceId;
  }

  trackByDay(_: number, day: BusinessOwnerDayDto): number {
    return day.id;
  }

  trackByAchievement(index: number, achievement: BusinessAchievementDto): string {
    return `${achievement.userId ?? 'user'}-${achievement.name}-${index}`;
  }

  trackByComment(index: number, comment: BusinessCommentDto): string {
    return `${comment.userId ?? 'user'}-${comment.id ?? index}`;
  }

  submitReview(): void {
    if (!this.authService.isAuthenticated()) {
      this.reviewFeedback = $localize`برای ارسال نظر باید ابتدا وارد شوید.`;
      this.reviewFeedbackType = 'error';
      return;
    }

    if (this.reviewForm.invalid || !this.businessDetail) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const payload: BusinessReviewRequest = {
      businessId: this.businessDetail.businessId,
      comment: this.reviewForm.getRawValue().comment.trim(),
      rate: Number(this.reviewForm.getRawValue().rate),
    };

    this.isSubmittingReview = true;
    this.reviewFeedback = '';
    this.reviewFeedbackType = '';

    this.businessService
      .submitReview(payload)
      .pipe(finalize(() => (this.isSubmittingReview = false)))
      .subscribe({
        next: () => {
          this.reviewFeedback = $localize`نظر شما با موفقیت ثبت شد.`;
          this.reviewFeedbackType = 'success';
          const newComment: BusinessCommentDto = {
            comment: payload.comment,
            rate: payload.rate,
            userId: 'me',
          };
          if (this.businessDetail) {
            if (this.businessDetail.commentDtos) {
              this.businessDetail.commentDtos.unshift(newComment);
            } else {
              this.businessDetail.commentDtos = [newComment];
            }
            this.ratingCount = this.businessDetail.commentDtos.length;
            this.averageRating = this.calculateAverageRating(this.businessDetail.commentDtos);
          }
          this.reviewForm.reset({ comment: '', rate: 5 });
        },
        error: () => {
          this.reviewFeedback = $localize`ثبت نظر با خطا مواجه شد. لطفاً دوباره تلاش کنید.`;
          this.reviewFeedbackType = 'error';
        },
      });
  }

  private calculateAverageRating(comments: BusinessCommentDto[]): number | null {
    const ratedComments = comments.filter(comment => typeof comment.rate === 'number');
    if (!ratedComments.length) {
      return null;
    }
    const total = ratedComments.reduce((sum, comment) => sum + (comment.rate ?? 0), 0);
    return Math.round((total / ratedComments.length) * 10) / 10;
  }
}

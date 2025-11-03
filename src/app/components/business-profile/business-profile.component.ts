import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

import {
  BusinessOwnerAchievement,
  BusinessOwnerComment,
  BusinessOwnerProfile,
  BusinessOwnerProfileResponse,
} from '../../models/user/business-owner-profile.model';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.css'],
  standalone: false,
})
export class BusinessProfileComponent implements OnInit {
  activeTab: 'experience' | 'certificates' | 'comments' = 'experience';
  profile: BusinessOwnerProfile | null = null;
  isLoading = false;
  errorMessage = '';

  workHistoryFeedback = '';
  workHistoryFeedbackType: 'success' | 'error' | '' = '';

  achievementFeedback = '';
  achievementFeedbackType: 'success' | 'error' | '' = '';

  commentFeedback = '';
  commentFeedbackType: 'success' | 'error' | '' = '';

  private readonly formBuilder = inject(FormBuilder);

  readonly workHistoryForm = this.formBuilder.nonNullable.group({
    workHistory: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  readonly achievementForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
  });

  readonly commentForm = this.formBuilder.nonNullable.group({
    comment: ['', [Validators.required, Validators.maxLength(500)]],
  });

  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    this.loadProfile(id);
  }

  loadProfile(id?: string | null): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userProfileService
      .getBusinessOwnerProfile(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: BusinessOwnerProfileResponse) => {
          if (response.isSuccess && response.data) {
            this.profile = response.data;
            this.workHistoryForm.patchValue({ workHistory: response.data.workHistory ?? '' });
          } else {
            this.errorMessage = response.message || $localize`امکان دریافت اطلاعات پروفایل وجود ندارد.`;
          }
        },
        error: () => {
          this.errorMessage = $localize`دریافت اطلاعات پروفایل با خطا مواجه شد.`;
        },
      });
  }

  submitWorkHistory(): void {
    if (this.workHistoryForm.invalid) {
      this.workHistoryForm.markAllAsTouched();
      return;
    }

    const value = this.workHistoryForm.getRawValue().workHistory.trim();
    if (!value) {
      this.workHistoryFeedback = $localize`متن سوابق نمی‌تواند خالی باشد.`;
      this.workHistoryFeedbackType = 'error';
      return;
    }

    this.userProfileService.updateWorkHistory(value).subscribe({
      next: () => {
        if (this.profile) {
          this.profile.workHistory = value;
        }
        this.workHistoryFeedback = $localize`سوابق کاری با موفقیت به‌روزرسانی شد.`;
        this.workHistoryFeedbackType = 'success';
      },
      error: () => {
        this.workHistoryFeedback = $localize`به‌روزرسانی سوابق با خطا مواجه شد.`;
        this.workHistoryFeedbackType = 'error';
      },
    });
  }

  addAchievement(): void {
    if (this.achievementForm.invalid) {
      this.achievementForm.markAllAsTouched();
      return;
    }

    const name = this.achievementForm.getRawValue().name.trim();
    if (!name) {
      this.achievementFeedback = $localize`عنوان گواهی‌نامه نمی‌تواند خالی باشد.`;
      this.achievementFeedbackType = 'error';
      return;
    }

    this.userProfileService.addAchievement(name).subscribe({
      next: () => {
        const achievement: BusinessOwnerAchievement = {
          name,
          userId: this.profile?.id ?? 'me',
        };
        if (this.profile?.achievements) {
          this.profile.achievements = [achievement, ...this.profile.achievements];
        } else if (this.profile) {
          this.profile.achievements = [achievement];
        }
        this.achievementFeedback = $localize`گواهی‌نامه جدید با موفقیت ثبت شد.`;
        this.achievementFeedbackType = 'success';
        this.achievementForm.reset({ name: '' });
      },
      error: () => {
        this.achievementFeedback = $localize`ثبت گواهی‌نامه با خطا مواجه شد.`;
        this.achievementFeedbackType = 'error';
      },
    });
  }

  addComment(): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    const comment = this.commentForm.getRawValue().comment.trim();
    if (!comment) {
      this.commentFeedback = $localize`متن نظر نمی‌تواند خالی باشد.`;
      this.commentFeedbackType = 'error';
      return;
    }

    this.userProfileService.addComment(comment).subscribe({
      next: () => {
        const newComment: BusinessOwnerComment = {
          comment,
          id: Date.now(),
        };
        if (this.profile?.comments) {
          this.profile.comments = [newComment, ...this.profile.comments];
        } else if (this.profile) {
          this.profile.comments = [newComment];
        }
        this.commentFeedback = $localize`نظر جدید با موفقیت ذخیره شد.`;
        this.commentFeedbackType = 'success';
        this.commentForm.reset({ comment: '' });
      },
      error: () => {
        this.commentFeedback = $localize`ذخیره نظر با خطا مواجه شد.`;
        this.commentFeedbackType = 'error';
      },
    });
  }

  trackByAchievement(index: number, achievement: BusinessOwnerAchievement): string {
    return `${achievement.userId ?? 'user'}-${achievement.name}-${index}`;
  }

  trackByComment(index: number, comment: BusinessOwnerComment): string {
    return `${comment.id ?? index}-${comment.userId ?? 'user'}`;
  }
}

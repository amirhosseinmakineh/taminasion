import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthResponse } from '../../../../models/auth/auth-response.model';
import { ForgotPasswordRequest } from '../../../../models/auth/forgot-password-request.model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  standalone: false,
})
export class ForgotPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly forgotPasswordForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  feedbackMessage = '';
  feedbackType: 'success' | 'error' | 'info' = 'info';
  isSubmitting = false;

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { errorMessage?: string } | undefined;

    if (state?.errorMessage) {
      this.feedbackType = 'error';
      this.feedbackMessage = state.errorMessage;
    }
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  submit(): void {
    if (this.forgotPasswordForm.invalid || this.isSubmitting) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    const payload: ForgotPasswordRequest = this.forgotPasswordForm.getRawValue();
    this.isSubmitting = true;
    this.feedbackMessage = '';

    this.authService
      .forgotPassword(payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (response: AuthResponse<unknown>) => {
          if (response.isSuccess) {
            this.feedbackType = 'success';
            this.feedbackMessage = response.message || 'ایمیل بازیابی رمز عبور ارسال شد.';
            this.forgotPasswordForm.reset();
          } else {
            this.feedbackType = 'error';
            this.feedbackMessage = response.message || 'ارسال ایمیل بازیابی با مشکل مواجه شد.';
          }
        },
        error: () => {
          this.feedbackType = 'error';
          this.feedbackMessage = 'در ارتباط با سرور مشکلی رخ داده است. لطفاً دوباره تلاش کنید.';
        },
      });
  }

  clearFeedback(): void {
    this.feedbackMessage = '';
  }
}

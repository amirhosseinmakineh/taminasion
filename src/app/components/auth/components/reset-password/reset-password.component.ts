import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs';

import { AuthResponse } from '../../../../models/auth/auth-response.model';
import { ChangePasswordRequest } from '../../../../models/auth/change-password-request.model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: false,
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (password && confirmPassword && password !== confirmPassword) {
      confirmPasswordControl.setErrors({ ...(confirmPasswordControl.errors || {}), mismatch: true });
      return { mismatch: true };
    }

    if (confirmPasswordControl.errors) {
      const { mismatch, ...rest } = confirmPasswordControl.errors;
      if (mismatch) {
        const hasOtherErrors = Object.keys(rest).length > 0;
        confirmPasswordControl.setErrors(hasOtherErrors ? rest : null);
      }
    }

    return null;
  };

  protected readonly resetPasswordForm = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordsMatchValidator }
  );

  feedbackMessage = '';
  feedbackType: 'success' | 'error' | 'info' = 'info';
  isSubmitting = false;
  isCheckingToken = true;
  token: string | null = null;
  tokenIsValid = false;
  private redirectScheduled = false;
  private readonly redirectDelayMs = 1500;

  constructor() {
    this.resetPasswordForm.disable();
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
      const token = params.get('token');
      this.token = token;

      if (!token) {
        this.handleInvalidToken('توکن بازیابی یافت نشد. لطفاً دوباره تلاش کنید.');
        return;
      }

      this.verifyToken(token);
    });
  }

  get password() {
    return this.resetPasswordForm.get('password');
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }

  submit(): void {
    if (!this.tokenIsValid || this.isSubmitting) {
      return;
    }

    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const payload: ChangePasswordRequest = {
      newPassword: this.password?.value ?? '',
    };

    if (!this.token) {
      this.handleInvalidToken('توکن بازیابی معتبر نیست.');
      return;
    }

    this.isSubmitting = true;
    this.feedbackMessage = '';

    this.authService
      .changePassword(this.token, payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (response: AuthResponse<string>) => {
          if (response.isSuccess) {
            this.feedbackType = 'success';
            this.feedbackMessage = response.message || 'رمز عبور شما با موفقیت تغییر کرد.';
            this.resetPasswordForm.disable();
          } else {
            this.feedbackType = 'error';
            this.feedbackMessage = response.message || 'تغییر رمز عبور با مشکل مواجه شد.';
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

  private verifyToken(token: string): void {
    this.isCheckingToken = true;
    this.feedbackMessage = '';

    this.authService
      .verifyChangePasswordToken(token)
      .pipe(finalize(() => (this.isCheckingToken = false)))
      .subscribe({
        next: (response: AuthResponse<string>) => {
          if (response.isSuccess) {
            this.tokenIsValid = true;
            this.feedbackType = 'info';
            this.feedbackMessage = response.message || 'لطفاً رمز عبور جدید خود را وارد کنید.';
            this.resetPasswordForm.enable();
          } else {
            this.handleInvalidToken(response.message || 'توکن بازیابی منقضی شده است.');
          }
        },
        error: () => {
          this.handleInvalidToken('اعتبارسنجی توکن با مشکل مواجه شد.');
        },
      });
  }

  private handleInvalidToken(message: string): void {
    this.tokenIsValid = false;
    this.isCheckingToken = false;
    this.feedbackType = 'error';
    this.feedbackMessage = `${message} در حال انتقال به صفحه ورود...`;
    this.resetPasswordForm.disable();

    if (this.redirectScheduled) {
      return;
    }

    this.redirectScheduled = true;

    setTimeout(() => {
      void this.router.navigate(['/auth/login'], {
        state: { errorMessage: message },
      });
    }, this.redirectDelayMs);
  }
}

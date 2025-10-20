import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../services/auth.service';
import { LoginRequest } from '../../../../models/auth/login-request.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  feedbackMessage = '';
  feedbackType: 'success' | 'error' | 'info' = 'info';
  isSubmitting = false;

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submit(): void {
    if (this.loginForm.invalid || this.isSubmitting) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const payload: LoginRequest = this.loginForm.getRawValue();
    this.isSubmitting = true;
    this.feedbackMessage = '';

    this.authService
      .login(payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: response => {
          this.feedbackType = response.isSuccess ? 'success' : 'error';
          this.feedbackMessage = response.message || (response.isSuccess ? 'ورود موفقیت‌آمیز بود.' : 'ورود ناموفق بود.');
        },
        error: () => {
          this.feedbackType = 'error';
          this.feedbackMessage = 'در ورود به سیستم مشکلی رخ داده است. لطفاً دوباره تلاش کنید.';
        },
      });
  }

  clearFeedback(): void {
    this.feedbackMessage = '';
  }
}

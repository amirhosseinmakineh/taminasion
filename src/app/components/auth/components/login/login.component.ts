import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../services/auth.service';
import { AuthResponse } from '../../../../models/auth/auth-response.model';
import { LoginRequest } from '../../../../models/auth/login-request.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    isBusinessOwner: [false],
  });

  feedbackMessage = '';
  feedbackType: 'success' | 'error' | 'info' = 'info';
  isSubmitting = false;

  constructor() {
    const queryMessages = this.consumeQueryParams();
    const navigationState = this.consumeNavigationState();
    const { errorMessageFromQuery, infoMessageFromQuery } = this.consumeQueryParams();

    const errorMessage = navigationState?.errorMessage || queryMessages.errorMessage;
    const infoMessage = navigationState?.infoMessage || queryMessages.infoMessage;

    if (errorMessage) {
      this.feedbackType = 'error';
      this.feedbackMessage = errorMessage;
      this.toastService.error(this.feedbackMessage);
    } else if (infoMessage) {
      this.feedbackType = 'info';
      this.feedbackMessage = infoMessage;
      this.toastService.info(this.feedbackMessage);
    }
  }

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
        next: (response: AuthResponse<unknown>) => {
          if (response.isSuccess) {
            this.feedbackType = 'success';
            this.feedbackMessage = response.message || 'احراز هویت با موفقیت انجام شد';
            this.toastService.success(this.feedbackMessage);
            this.loginForm.reset();
            void this.router.navigate(['/business']);
          } else {
            this.authService.clearStoredToken();
            this.feedbackType = 'error';
            this.feedbackMessage = response.message || 'در فرآیند ورود مشکلی پیش آمد.';
            this.toastService.error(this.feedbackMessage);
          }
        },
        error: () => {
          this.authService.clearStoredToken();
          this.feedbackType = 'error';
          this.feedbackMessage = 'در ارتباط با سرور مشکلی رخ داده است. لطفاً دوباره تلاش کنید.';
          this.toastService.error(this.feedbackMessage);
        },
      });
  }

  clearFeedback(): void {
    this.feedbackMessage = '';
  }

  private consumeQueryParams(): { errorMessage?: string; infoMessage?: string } {
    const queryParams = this.route.snapshot.queryParamMap;
    const errorMessage = queryParams.get('errorMessage') || undefined;
    const infoMessage = queryParams.get('infoMessage') || undefined;

    if ((errorMessage || infoMessage) && typeof window !== 'undefined') {
      void this.router.navigate([], {
        relativeTo: this.route,
        replaceUrl: true,
        queryParams: {
          errorMessage: null,
          infoMessage: null,
        },
        queryParamsHandling: 'merge',
      });
    }

    return { errorMessage, infoMessage };
  }

  private consumeNavigationState(): { errorMessage?: string; infoMessage?: string } | null {
    const navigation = this.router.getCurrentNavigation();
    const stateFromNavigation = (navigation?.extras?.state as
      | { errorMessage?: string; infoMessage?: string }
      | undefined) ?? null;

    let state = stateFromNavigation;

    if (!state && typeof window !== 'undefined') {
      state = (window.history.state as { errorMessage?: string; infoMessage?: string } | null) ?? null;
    }

    if (state && typeof window !== 'undefined' && typeof window.history?.replaceState === 'function') {
      const { errorMessage, infoMessage, ...rest } = state;
      window.history.replaceState(rest, typeof document !== 'undefined' ? document.title : '');
    }

    return state;
  }

}

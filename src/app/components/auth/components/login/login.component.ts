import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../services/auth.service';
import { AuthResponse } from '../../../../models/auth/auth-response.model';
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
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    isBusinessOwner: [false],
  });

  feedbackMessage = '';
  feedbackType: 'success' | 'error' | 'info' = 'info';
  isSubmitting = false;

  constructor() {
    const navigationState = this.consumeNavigationState();
    const { errorMessageFromQuery, infoMessageFromQuery } = this.consumeQueryParams();

    if (navigationState?.errorMessage || errorMessageFromQuery) {
      this.feedbackType = 'error';
      this.feedbackMessage = navigationState?.errorMessage || errorMessageFromQuery || '';
    } else if (navigationState?.infoMessage || infoMessageFromQuery) {
      this.feedbackType = 'info';
      this.feedbackMessage = navigationState?.infoMessage || infoMessageFromQuery || '';
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
            this.loginForm.reset();
            const businessOwnerId = this.extractUserId(response.data);
            void this.router.navigate(['/business'], {
              queryParams: businessOwnerId ? { id: businessOwnerId } : undefined,
            });
          } else {
            this.authService.clearStoredToken();
            this.feedbackType = 'error';
            this.feedbackMessage = response.message || 'در فرآیند ورود مشکلی پیش آمد.';
          }
        },
        error: () => {
          this.authService.clearStoredToken();
          this.feedbackType = 'error';
          this.feedbackMessage = 'در ارتباط با سرور مشکلی رخ داده است. لطفاً دوباره تلاش کنید.';
        },
      });
  }

  clearFeedback(): void {
    this.feedbackMessage = '';
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

  private consumeQueryParams(): { errorMessageFromQuery: string | null; infoMessageFromQuery: string | null } {
    const queryParamMap = this.route.snapshot.queryParamMap;
    const errorMessageFromQuery = queryParamMap.get('errorMessage');
    const infoMessageFromQuery = queryParamMap.get('infoMessage');

    if ((errorMessageFromQuery || infoMessageFromQuery) && typeof window !== 'undefined') {
      void this.router.navigate([], {
        queryParams: { errorMessage: null, infoMessage: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }

    return { errorMessageFromQuery, infoMessageFromQuery };
  }

  private extractUserId(data: unknown): string | null {
    if (!data || typeof data !== 'object') {
      return null;
    }

    const record = data as Record<string, unknown>;
    const user = record['user'];

    if (user && typeof user === 'object') {
      const userId = (user as Record<string, unknown>)['id'];
      if (typeof userId === 'string') {
        return userId;
      }
    }

    if (typeof record['id'] === 'string') {
      return record['id'];
    }

    return null;
  }
}

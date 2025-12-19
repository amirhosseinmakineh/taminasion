import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../services/auth.service';
import { AuthResponse } from '../../../../models/auth/auth-response.model';
import { LoginRequest } from '../../../../models/auth/login-request.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { BusinessOwnerService } from '../../../../services/business-owner.service';
import { BusinessProfileStateService } from '../../../business-dashboard/state/business-profile-state.service';

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
  private readonly businessOwnerService = inject(BusinessOwnerService);
  private readonly businessProfileState = inject(BusinessProfileStateService);

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    isBusinessOwner: [false],
  });

  feedbackMessage = '';
  feedbackType: 'success' | 'error' | 'info' = 'info';
  isSubmitting = false;

  constructor() {
    const { errorMessage: errorMessageFromQuery, infoMessage: infoMessageFromQuery } =
      this.consumeQueryParams();
    const { errorMessage: errorMessageFromState, infoMessage: infoMessageFromState } =
      this.consumeNavigationState() ?? {};

    const errorMessage = errorMessageFromState || errorMessageFromQuery;
    const infoMessage = infoMessageFromState || infoMessageFromQuery;

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
    debugger;
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
            this.feedbackMessage = this.normalizeMessage(response.message);
            if (this.feedbackMessage) {
              this.toastService.success(this.feedbackMessage);
            }
            this.loginForm.reset();
            this.checkBusinessOwnerProfile();
          } else {
            this.authService.clearStoredToken();
            this.feedbackType = 'error';
            this.feedbackMessage = this.normalizeMessage(response.message);
            if (this.feedbackMessage) {
              this.toastService.error(this.feedbackMessage);
            }
          }
        },
        error: (res) => {
          this.authService.clearStoredToken();
          this.feedbackType = 'error';
          this.feedbackMessage = this.normalizeMessage(res?.error?.message ?? res?.message);
          if (this.feedbackMessage) {
            this.toastService.error(this.feedbackMessage);
          }
        },
      });
  }

  clearFeedback(): void {
    this.feedbackMessage = '';
  }

  private checkBusinessOwnerProfile(): void {
    const businessOwnerId = this.authService.userId;

    if (!businessOwnerId) {
      this.authService.clearStoredToken();
      return;
    }

    this.businessOwnerService.checkBusinessOwnerProfile(businessOwnerId).subscribe({
      next: response => {
        const message = this.normalizeMessage(response.message);

        if (response.isSuccess) {
          this.businessProfileState.completeProfile();
          void this.router.navigate(['/business/customers']);
          return;
        }

        if (message?.includes('دسترسی ندارید')) {
          if (message) {
            this.toastService.error(message);
          }
          this.authService.clearStoredToken();
          return;
        }

        if (message) {
          this.toastService.info(message);
        }
        this.businessProfileState.markProfileIncomplete();
        void this.router.navigate(['/business/profile-setup']);
      },
      error: () => {
        return;
      },
    });
  }

  private normalizeMessage(message: unknown): string {
    if (!message) {
      return '';
    }

    if (typeof message === 'string') {
      return message.trim();
    }

    if (Array.isArray(message)) {
      return message.filter(item => typeof item === 'string').join(' ').trim();
    }

    if (typeof message === 'object') {
      return JSON.stringify(message);
    }

    return String(message).trim();
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

import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../services/auth.service';
import { RegisterRequest } from '../../../../models/auth/register-request.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  protected readonly registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  feedbackMessage = '';
  feedbackType: 'success' | 'error' | 'info' = 'info';
  isSubmitting = false;

  get name() {
    return this.registerForm.get('name');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  submit(): void {
    if (this.registerForm.invalid || this.isSubmitting) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const payload: RegisterRequest = this.registerForm.getRawValue();
    this.isSubmitting = true;
    this.feedbackMessage = '';

    this.authService
      .register(payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: response => {
          if (response.isSuccess) {
            this.feedbackType = 'success';
            this.feedbackMessage = response.message || 'ثبت‌نام با موفقیت انجام شد.';
            this.registerForm.reset();
          } else {
            this.feedbackType = 'error';
            this.feedbackMessage = response.message || 'در فرآیند ثبت‌نام مشکلی پیش آمد.';
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

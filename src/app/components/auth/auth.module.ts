import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FeedbackMessageModule } from '../../shared/ui/feedback-message/feedback-message.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@NgModule({
  declarations: [RegisterComponent, LoginComponent, ForgotPasswordComponent, ResetPasswordComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FeedbackMessageModule, AuthRoutingModule],
})
export class AuthModule {}

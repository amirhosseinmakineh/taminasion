import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AuthResponse, AuthUserDto } from '../models/auth/auth-response.model';
import { LoginRequest } from '../models/auth/login-request.model';
import { RegisterRequest } from '../models/auth/register-request.model';
import { ForgotPasswordRequest } from '../models/auth/forgot-password-request.model';
import { ChangePasswordRequest } from '../models/auth/change-password-request.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:5107/api/User';

  constructor(private readonly http: HttpClient) {}

  register(payload: RegisterRequest): Observable<AuthResponse<AuthUserDto>> {
    const body = {
      email: payload.email,
      userName: payload.name,
      password: payload.password,
      phoneNumber: payload.phone,
    };

    return this.http.post<AuthResponse<AuthUserDto>>(this.baseUrl, body).pipe(
      map(response => ({
        ...response,
        data: {
          ...response.data,
          phoneNumber: payload.phone,
        },
      }))
    );
  }

  login(payload: LoginRequest): Observable<AuthResponse<{ token: string; user: any }>> {
    const url = `${this.baseUrl}/login`; // lowercase و تمیز
    return this.http.post<AuthResponse<{ token: string; user: any }>>(url, payload);
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<AuthResponse<unknown>> {
    const url = `${this.baseUrl}/ForgotPassword`;
    return this.http.post<AuthResponse<unknown>>(url, payload);
  }

  verifyChangePasswordToken(token: string): Observable<AuthResponse<string>> {
    const url = `${this.baseUrl}/CheckChangePasswordToken/${token}`;
    return this.http.get<AuthResponse<string>>(url);
  }

  changePassword(token: string, payload: ChangePasswordRequest): Observable<AuthResponse<string>> {
    const url = `${this.baseUrl}/ChangePassword/${token}`;
    const params = new HttpParams().set('password', payload.newPassword);

    return this.http.post<AuthResponse<string>>(url, null, { params });
  }

}

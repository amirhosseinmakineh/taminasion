import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

import { AuthResponse, AuthUserDto } from '../models/auth/auth-response.model';
import { LoginRequest } from '../models/auth/login-request.model';
import { RegisterRequest } from '../models/auth/register-request.model';
import { ForgotPasswordRequest } from '../models/auth/forgot-password-request.model';
import { ChangePasswordRequest } from '../models/auth/change-password-request.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly baseUrl = `${this.apiBaseUrl}/User`;
  private readonly tokenStorageKey = 'authToken';
  private readonly userIdStorageKey = 'authUserId';
  private readonly authStatusSubject = new BehaviorSubject<boolean>(this.hasStoredToken());

  readonly authStatus$ = this.authStatusSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  get userId(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(this.userIdStorageKey);
  }

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
      })),
    );
  }

  login(payload: LoginRequest): Observable<AuthResponse<{ token: string; user: any }>> {
    const url = `${this.baseUrl}/login`; // lowercase و تمیز
    return this.http.post<AuthResponse<{ token: string; user: any }>>(url, payload).pipe(
      tap(response => {
        const token = this.extractToken(response.data);
        if (response.isSuccess && token) {
          this.storeToken(token);
        }

        const userId = this.extractUserId(response.data);
        if (response.isSuccess && userId) {
          this.storeUserId(userId);
        }
      }),
    );
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

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return window.localStorage.getItem(this.tokenStorageKey);
  }

  storeToken(token: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(this.tokenStorageKey, token);
    this.authStatusSubject.next(true);
  }

  clearStoredToken(): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.removeItem(this.tokenStorageKey);
    window.localStorage.removeItem(this.userIdStorageKey);
    this.authStatusSubject.next(false);
  }

  logout(): void {
    this.clearStoredToken();
  }

  isAuthenticated(): boolean {
    return this.hasStoredToken();
  }

  private hasStoredToken(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    return !!window.localStorage.getItem(this.tokenStorageKey);
  }

  private extractToken(data: unknown): string | null {
    if (!data) {
      return null;
    }

    if (typeof data === 'string') {
      return this.extractTokenFromLoginDto(data);
    }

    if (typeof data === 'object') {
      const record = data as Record<string, unknown>;
      const possibleToken =
        record['token'] ?? record['accessToken'] ?? record['jwtToken'] ?? record['bearerToken'];

      if (typeof possibleToken === 'string') {
        return possibleToken;
      }
    }

    return null;
  }

  private extractUserId(data: unknown): string | null {
    if (typeof data === 'string') {
      return this.extractUserIdFromLoginDto(data);
    }

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

  private extractTokenFromLoginDto(data: string): string | null {
    const match = /Token\s*=\s*([^\s,}]+)/i.exec(data);
    if (match?.[1]) {
      return match[1];
    }

    if (data.includes('.') && data.split('.').length >= 3) {
      return data;
    }

    return null;
  }

  private extractUserIdFromLoginDto(data: string): string | null {
    const matches = [...data.matchAll(/Id\s*=\s*([0-9a-f-]{36})/gi)].map(match => match[1]);
    const nonZeroId = matches.find(id => id.toLowerCase() !== '00000000-0000-0000-0000-000000000000');
    return nonZeroId ?? matches[0] ?? null;
  }

  private storeUserId(userId: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.userIdStorageKey, userId);
  }
}

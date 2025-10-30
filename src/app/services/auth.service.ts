import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AuthResponse, AuthUserDto } from '../models/auth/auth-response.model';
import { LoginRequest } from '../models/auth/login-request.model';
import { RegisterRequest } from '../models/auth/register-request.model';

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

  login(payload: LoginRequest): Observable<AuthResponse<unknown>> {
    const url = `${this.baseUrl}/Login`;
    return this.http.post<AuthResponse<unknown>>(url, payload);
  }
}

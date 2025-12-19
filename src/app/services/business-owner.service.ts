import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthResponse } from '../models/auth/auth-response.model';
import { UpdateBusinessOwnerInfoDto } from '../models/business-owner/update-business-owner-info.dto';

@Injectable({ providedIn: 'root' })
export class BusinessOwnerService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly baseUrl = `${this.apiBaseUrl}/BusinessOwnerDashboard`;
  private readonly dashboardBaseUrl = `${this.apiBaseUrl}/BusinessDashboard`;

  constructor(private readonly http: HttpClient) {}

  checkBusinessOwnerProfile(businessOwnerId: string): Observable<AuthResponse<string>> {
    const url = `${this.baseUrl}`;
    const params = new HttpParams().set('userId', businessOwnerId);
    return this.http.get<AuthResponse<string>>(url, { params });
  }

  completeOwnerProfile(payload: UpdateBusinessOwnerInfoDto): Observable<AuthResponse<string>> {
    const url = `${this.dashboardBaseUrl}/CompleteOwnerProfile`;
    return this.http.post<AuthResponse<string>>(url, payload);
  }
}

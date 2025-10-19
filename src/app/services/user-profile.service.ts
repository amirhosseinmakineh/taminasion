import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BusinessOwnerProfileResponse } from '../models/user/business-owner-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private readonly baseUrl = 'http://localhost:5107/api/User';

  constructor(private readonly http: HttpClient) {}

  getBusinessOwnerProfile(userId?: string | null): Observable<BusinessOwnerProfileResponse> {
    const url = `${this.baseUrl}/BusinessOwnerProfile`;
    const params = userId ? new HttpParams().set('userId', userId) : undefined;
    return this.http.get<BusinessOwnerProfileResponse>(url, { params });
  }
}

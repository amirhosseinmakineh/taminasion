import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BusinessOwnerProfileResponse } from '../models/user/business-owner-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private readonly baseUrl = 'http://localhost:5107/api/User';

  constructor(private readonly http: HttpClient) {}

  getBusinessOwnerProfile(): Observable<BusinessOwnerProfileResponse> {
    const url = `${this.baseUrl}/BusinessOwnerProfile`;
    return this.http.get<BusinessOwnerProfileResponse>(url);
  }
}

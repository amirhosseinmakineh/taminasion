import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthResponse } from '../models/auth/auth-response.model';

@Injectable({ providedIn: 'root' })
export class BusinessOwnerService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly baseUrl = `${this.apiBaseUrl}/BusinessOwner`;

  constructor(private readonly http: HttpClient) {}

  checkBusinessOwnerProfile(businessOwnerId: string): Observable<AuthResponse<string>> {
    const url = `${this.baseUrl}/CheckBusinessOwnerProfile`;
    const params = new HttpParams().set('id', businessOwnerId);
    return this.http.get<AuthResponse<string>>(url, { params });
  }
}

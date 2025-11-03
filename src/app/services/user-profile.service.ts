import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BusinessOwnerProfileResponse } from '../models/user/business-owner-profile.model';
import { UserReservationsResponse } from '../models/user/user-reservation.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly baseUrl = `${this.apiBaseUrl}/User`;

  constructor(private readonly http: HttpClient) {}

  getBusinessOwnerProfile(id?: string | null): Observable<BusinessOwnerProfileResponse> {
    const url = `${this.baseUrl}/BusinessOwnerProfile`;
    const params = id ? new HttpParams().set('id', id) : undefined;
    return this.http.get<BusinessOwnerProfileResponse>(url, { params });
  }

  updateWorkHistory(workHistory: string): Observable<unknown> {
    const url = `${this.baseUrl}/BusinessOwnerProfile/WorkHistory`;
    return this.http.put(url, { workHistory });
  }

  addAchievement(name: string): Observable<unknown> {
    const url = `${this.baseUrl}/BusinessOwnerProfile/Achievements`;
    return this.http.post(url, { name });
  }

  addComment(comment: string): Observable<unknown> {
    const url = `${this.baseUrl}/BusinessOwnerProfile/Comments`;
    return this.http.post(url, { comment });
  }

  getUserReservations(): Observable<UserReservationsResponse> {
    const url = `${this.baseUrl}/Reservations`;
    return this.http.get<UserReservationsResponse>(url);
  }

  cancelReservation(reservationId: number): Observable<{ isSuccess: boolean; message: string }> {
    const url = `${this.baseUrl}/Reservations/${reservationId}`;
    return this.http.delete<{ isSuccess: boolean; message: string }>(url);
  }
}

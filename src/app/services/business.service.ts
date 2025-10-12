import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BusinessCity } from '../models/business/business-city.model';
import { BusinessDto } from '../models/business/business.model';
import { BusinessNeighborhood } from '../models/business/business-neighborhood.model';
import { BusinessRegion } from '../models/business/business-region.model';
import { BusinessServiceDto } from '../models/business/business-service.dto';
import { BusinessFilter } from '../models/business/business-filter.model';
import { CategoryDto } from '../models/business/category.dto';
import { BusinessDetailDto } from '../models/business/business-detail.dto';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private readonly baseUrl = 'http://localhost:5107/api/Busines';
  private readonly categoryBaseUrl = 'http://localhost:5107/api/Category';

  constructor(private http: HttpClient) {}

  // گرفتن لیست شهرها (مستقل از فیلتر)
  getCities(): Observable<BusinessCity[]> {
    return this.http.get<BusinessCity[]>(`${this.baseUrl}/Cities`);
  }

  // فیلتر اول: با cityId → دریافت مناطق + کسب‌وکار
  getRegionsAndBusinessesByCity(cityId: number): Observable<{
    regions: BusinessRegion[];
    businesses: any[];
  }> {
    return this.http.get<any>(`${this.baseUrl}?businessCityId=${cityId}`);
  }

  // فیلتر دوم: با regionId → دریافت محله‌ها + کسب‌وکار
  getNeighborhoodsAndBusinessesByRegion(regionId: number): Observable<{
    neighborhoods: BusinessNeighborhood[];
    businesses: any[];
  }> {
    return this.http.get<any>(`${this.baseUrl}?regionId=${regionId}`);
  }

  getNeighborhoodsAndBusinesses(cityId: number, regionId: number): Observable<any> {
    const url = `${this.baseUrl}?businessCityId=${cityId}&regionId=${regionId}`;
    return this.http.get<any>(url);
  }

  getAllCategories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(this.categoryBaseUrl);
  }

  getAllServices(): Observable<BusinessServiceDto[]> {
    const url = `${this.baseUrl}/GetBusinessService`;
    return this.http.get<BusinessServiceDto[]>(url);
  }

  getMaxServiceAmount(): Observable<number> {
    const url = `${this.baseUrl}/GetMaxServiceAmount`;
    return this.http.get<number>(url);
  }

  getBusinessDetail(businessId: number): Observable<BusinessDetailDto> {
    const url = `${this.baseUrl}/BusinessDetail`;
    const params = new HttpParams().set('businessId', String(businessId));
    return this.http.get<BusinessDetailDto>(url, { params });
  }

  getAllBusinesses(
    neighberHoodId: number,
    categoryId?: number,
    serviceIds?: number[],
    take = 6,
    skip = 0,
    maxAmount?: number
  ): Observable<BusinessDto[]> {
    const url = `${this.baseUrl}/Busineses`;

    let params = new HttpParams()
      .set('neighberHoodId', String(neighberHoodId))
      .set('take', String(take ?? 6))
      .set('skip', String(skip ?? 0));

    if (categoryId !== undefined && categoryId !== null) {
      params = params.set('categoryId', String(categoryId));
    }

    if (serviceIds?.length) {
      serviceIds.forEach(id => {
        params = params.append('serviceIds', String(id));
      });
    }

    if (maxAmount !== undefined && maxAmount !== null) {
      params = params.set('maxAmount', String(maxAmount));
    }

    return this.http.get<BusinessDto[]>(url, { params });
  }

  reserveServices(timeId: number, serviceIds: number[]): Observable<any> {
    const url = `${this.baseUrl}/Reserve`;
    return this.http.post(url, {
      businessOwnerTimeId: timeId,
      serviceIds,
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BusinessCity } from '../Interfaces/Businises/BusinessCity';
import { BusinessRegion } from '../Interfaces/Businises/BusinessRegion';
import { BusinessNeighborhood } from '../Interfaces/Businises/BusinessNeighberhood';
import { CategoryDto } from '../Interfaces/Businises/CategoryDto';
import { BusinessServiceDto } from '../Interfaces/Businises/BusinessServiceDto';
import { BusinessDto } from '../Interfaces/Businises/BusinessDto';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private readonly BASE_URL = 'http://localhost:5107/api/Busines';
  private readonly categoryBaseUrl = 'http://localhost:5107/api/Category';
  constructor(private http: HttpClient) {}

  // گرفتن لیست شهرها (مستقل از فیلتر)
  getCities(): Observable<BusinessCity[]> {
    return this.http.get<BusinessCity[]>(`${this.BASE_URL}/Cities`);
  }

  // فیلتر اول: با cityId → دریافت مناطق + کسب‌وکار
  getRegionsAndBusinessesByCity(cityId: number): Observable<{
    regions: BusinessRegion[];
    businesses: any[];
  }> {
    return this.http.get<any>(`${this.BASE_URL}?businessCityId=${cityId}`);
  }

  // فیلتر دوم: با regionId → دریافت محله‌ها + کسب‌وکار
  getNeighborhoodsAndBusinessesByRegion(regionId: number): Observable<{
    neighborhoods: BusinessNeighborhood[];
    businesses: any[];
  }> {
    return this.http.get<any>(`${this.BASE_URL}?regionId=${regionId}`);
  }
  getNeighborhoodsAndBusinesses(cityId: number, regionId: number): Observable<any> {
  const url = `${this.BASE_URL}?businessCityId=${cityId}&regionId=${regionId}`;
  return this.http.get<any>(url);
}

getAllCategories(): Observable<CategoryDto[]>{
  const url = `${this.categoryBaseUrl}`;
  return this.http.get<CategoryDto[]>(url);
}

getAllServices() : Observable<BusinessServiceDto[]>{
const url = `${this.BASE_URL}/GetBusinessService`;
return this.http.get<BusinessServiceDto[]>(url);
}

getAllBusineses(
  neighberHoodId: number,
  categoryId?: number,
  take: number = 6,
  skip: number = 0,
  maxAmount?: number
): Observable<BusinessDto[]> {
  const url = `${this.BASE_URL}/Busineses`;

  let params = new HttpParams()
    .set('neighberHoodId', neighberHoodId.toString())
    .set('skip', skip.toString())
    .set('take', take.toString());

  if (categoryId !== undefined) {
    params = params.set('categoryId', categoryId.toString());
  }
  if (maxAmount !== undefined) {
    params = params.set('maxAmount', maxAmount.toString());
  }

  return this.http.get<BusinessDto[]>(url, { params });
}

}

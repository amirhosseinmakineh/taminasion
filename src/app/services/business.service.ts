import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BusinessCity } from '../Interfaces/Businises/BusinessCity';
import { BusinessRegion } from '../Interfaces/Businises/BusinessRegion';
import { BusinessNeighborhood } from '../Interfaces/Businises/BusinessNeighberhood';
import { CategoryDto } from '../Interfaces/Businises/CategoryDto';
import { BusinessServiceDto } from '../Interfaces/Businises/BusinessServiceDto';
import { BusinessDto } from '../Interfaces/Businises/BusinessDto';
import { BusinessFilter } from '../Interfaces/Businises/BusinessFilter';

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
  serviceIds?: number[],
  take: number = 6,
  skip: number = 0,
  maxAmount?: number
): Observable<BusinessDto[]> {
  const url = `${this.BASE_URL}/Busineses`;

  const paramsObject: { [param: string]: string | string[] } = {
    neighberHoodId: neighberHoodId.toString(),
    skip: (skip ?? 0).toString(),
    take: (take ?? 6).toString()
  };

  if (categoryId !== undefined) {
    paramsObject['categoryId'] = categoryId.toString();
  }

  if (serviceIds && serviceIds.length) {
    paramsObject['serviceIds'] = serviceIds.map(id => id.toString());
  }
  if (maxAmount !== undefined) {
    paramsObject['maxAmount'] = maxAmount.toString();
  }

  const params = new HttpParams({ fromObject: paramsObject });

  return this.http.get<BusinessDto[]>(url, { params });
}

reserveServices(timeId: number, serviceIds: number[]): Observable<any> {
  const url = `${this.BASE_URL}/Reserve`;
  return this.http.post(url, {
    businessOwnerTimeId: timeId,
    serviceIds,
  });
}

}

import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { BusinessCity } from '../../models/business/business-city.model';
import { BusinessNeighborhood } from '../../models/business/business-neighborhood.model';
import { BusinessRegion } from '../../models/business/business-region.model';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  standalone: false,
})
export class MainPageComponent implements OnInit {
  constructor(
    private service: BusinessService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  cities: BusinessCity[] = [];
  regions: BusinessRegion[] = [];
  neighborhoods: BusinessNeighborhood[] = [];
  businesses: any[] = [];

  selectedCityId = -1;
  selectedRegionId = -1;
  selectedNeighborhoodId = -1;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCities();
    }
  }

  loadCities(): void {
    this.service.getCities().subscribe({
      next: data => {
        this.cities = data;
      },
      error: err => {
        console.error('❌ خطا در دریافت شهرها:', err);
      }
    });
  }

  onCityChange(): void {
    this.selectedRegionId = -1;
    this.selectedNeighborhoodId = -1;
    this.regions = [];
    this.neighborhoods = [];
    this.businesses = [];

    if (this.selectedCityId !== -1) {
      this.service.getRegionsAndBusinessesByCity(this.selectedCityId).subscribe({
        next: response => {
          this.regions = response.regions;
          this.businesses = response.businesses;
          console.log('✅ مناطق دریافت‌شده:', this.regions);
        },
        error: err => {
          console.error('❌ خطا در دریافت مناطق:', err);
        }
      });
    }
  }

  onRegionChange(): void {
    this.selectedNeighborhoodId = -1;
    this.neighborhoods = [];
    this.businesses = [];

    if (this.selectedRegionId !== -1 && this.selectedCityId !== -1) {
      this.service.getNeighborhoodsAndBusinesses(this.selectedCityId, this.selectedRegionId).subscribe({
        next: response => {
          this.neighborhoods = response.neighborhoods;
          this.businesses = response.businesses;
          console.log('✅ محله‌ها:', this.neighborhoods);
        },
        error: err => console.error('❌ خطا در دریافت محله‌ها:', err),
      });
    }
  }

  goToSearchPage(): void {
    let neighberHoodId = 0;
    if (this.selectedNeighborhoodId !== -1) {
      neighberHoodId = this.selectedNeighborhoodId;
    }

    // ناوبری به صفحه سرچ با Query Params
    this.router.navigate(['/business-search'], { queryParams: { neighberHoodId } });
  }
}


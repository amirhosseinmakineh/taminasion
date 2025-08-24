import { BusinessCity } from './../../Interfaces/Businises/BusinessCity';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { BusinessService } from './../../services/business.service';
import { BusinessRegion } from './../../Interfaces/Businises/BusinessRegion';
import { BusinessNeighborhood } from './../../Interfaces/Businises/BusinessNeighberhood';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-main-page',
  templateUrl: './MainPage.component.html',
  styleUrls: ['./MainPage.component.css'],
  standalone: false,
})
export class MainPageComponent implements OnInit {
  constructor(
    private service: BusinessService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}
  cities: BusinessCity[] = [];
  regions: BusinessRegion[] = [];
  neighborhoods: BusinessNeighborhood[] = [];
  businesses: any[] = [];

  selectedCityId: number = -1;
  selectedRegionId: number = -1;
  selectedNeighborhoodId: number = -1;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCities();
    }
  }

  loadCities(): void {
    this.service.getCities().subscribe({
      next: (data) => {
        this.cities = data;
      },
      error: (err) => {
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
        next: (response) => {
          this.regions = response.regions;
          this.businesses = response.businesses;
          console.log('✅ مناطق دریافت‌شده:', this.regions);
        },
        error: (err) => {
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
      next: (response) => {
        this.neighborhoods = response.neighborhoods;
        this.businesses = response.businesses;
        console.log('✅ محله‌ها:', this.neighborhoods);
      },
      error: (err) => console.error('❌ خطا در دریافت محله‌ها:', err),
    });
  }
}

GoToSearchPage(): void {
  let neighberHoodId: number = 0;
  if (this.selectedNeighborhoodId !== -1) {
    neighberHoodId = this.selectedNeighborhoodId;
  }

  // ناوبری به صفحه سرچ با Query Params
  this.router.navigate(['/business-search'], { queryParams: { neighberHoodId } });
}
}


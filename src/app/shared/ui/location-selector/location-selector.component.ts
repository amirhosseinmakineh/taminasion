import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { BusinessCity } from '../../../models/business/business-city.model';
import { BusinessNeighborhood } from '../../../models/business/business-neighborhood.model';
import { BusinessRegion } from '../../../models/business/business-region.model';
import { BusinessService } from '../../../services/business.service';

export interface LocationSelection {
  cityId: number;
  regionId: number;
  neighborhoodId: number;
}

@Component({
  selector: 'app-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.css'],
  standalone: false,
})
export class LocationSelectorComponent implements OnInit {
  @Input() buttonLabel = 'جستجو';
  @Input() enableSearchNavigation = true;
  @Input() showNeighborhood = true;
  @Input() alignment: 'horizontal' | 'vertical' = 'horizontal';

  @Output() selectionChange = new EventEmitter<LocationSelection>();
  @Output() search = new EventEmitter<LocationSelection>();

  cities: BusinessCity[] = [];
  regions: BusinessRegion[] = [];
  neighborhoods: BusinessNeighborhood[] = [];

  selectedCityId = -1;
  selectedRegionId = -1;
  selectedNeighborhoodId = -1;

  private isBrowser: boolean;

  constructor(
    private readonly businessService: BusinessService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadCities();
    }
  }

  loadCities(): void {
    this.businessService.getCities().subscribe({
      next: cities => (this.cities = cities),
      error: err => console.error('خطا در دریافت شهرها', err),
    });
  }

  onCityChange(): void {
    this.selectedRegionId = -1;
    this.selectedNeighborhoodId = -1;
    this.regions = [];
    this.neighborhoods = [];

    if (this.selectedCityId !== -1) {
      this.businessService.getRegionsAndBusinessesByCity(this.selectedCityId).subscribe({
        next: response => {
          this.regions = response.regions;
          this.emitSelection();
        },
        error: err => console.error('خطا در دریافت مناطق', err),
      });
    } else {
      this.emitSelection();
    }
  }

  onRegionChange(): void {
    this.selectedNeighborhoodId = -1;
    this.neighborhoods = [];

    if (this.selectedCityId !== -1 && this.selectedRegionId !== -1) {
      this.businessService
        .getNeighborhoodsAndBusinesses(this.selectedCityId, this.selectedRegionId)
        .subscribe({
          next: response => {
            this.neighborhoods = response.neighborhoods;
            this.emitSelection();
          },
          error: err => console.error('خطا در دریافت محله‌ها', err),
        });
    } else {
      this.emitSelection();
    }
  }

  onNeighborhoodChange(): void {
    this.emitSelection();
  }

  submit(): void {
    const selection = this.emitSelection(false);
    this.search.emit(selection);

    if (this.enableSearchNavigation) {
      const neighborhoodId = selection.neighborhoodId > 0 ? selection.neighborhoodId : 0;
      this.router.navigate(['/business-search'], {
        queryParams: { neighberHoodId: neighborhoodId },
      });
    }
  }

  private emitSelection(emitEvent: boolean = true): LocationSelection {
    const selection: LocationSelection = {
      cityId: this.selectedCityId,
      regionId: this.selectedRegionId,
      neighborhoodId: this.selectedNeighborhoodId,
    };

    if (emitEvent) {
      this.selectionChange.emit(selection);
    }

    return selection;
  }
}

import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { BusinessFilter } from '../../models/business/business-filter.model';
import { BusinessDto, BusinessDayTimeDto } from '../../models/business/business.model';
import { BusinessServiceDto } from '../../models/business/business-service.dto';
import { CategoryDto } from '../../models/business/category.dto';
import { BusinessService } from '../../services/business.service';
import { LocationSelection } from '../../shared/ui/location-selector/location-selector.component';

@Component({
  selector: 'app-business-search',
  templateUrl: './business-search.component.html',
  styleUrls: ['./business-search.component.css'],
  standalone: false,
})
export class BusinessSearchComponent implements OnInit, OnDestroy {

  // فیلتر اصلی
  filter: BusinessFilter = {
    neighberHoodId: 0,
    categoryId: 0,
    serviceIds: [],
    take: 20,
    skip: 0,
    maxAmount: 0,
  };

  // دیتاها
  categories: CategoryDto[] = [];
  businessServices: BusinessServiceDto[] = [];
  businesses: BusinessDto[] = [];
  private allBusinesses: BusinessDto[] = [];

  // انتخاب‌ها
  availableServices: BusinessServiceDto[] = [];

  // modal
  showModal = false;
  selectedBusiness: BusinessDto | null = null;
  uniqueDays: number[] = [];
  currentDayIndex = 0;
  selectedTimes: { [serviceId: number]: number } = {};

  maxServiceAmount = 0;
  minServiceAmount = 0;

  // day filter
  filterDay: number = new Date().getDay() + 1; // 1-7

  // pagination helpers
  hasMore = false;

  private readonly isBrowser: boolean;
  private queryParamsSub?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: BusinessService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.loadCategories();
    this.loadServices();

    this.service.getMaxServiceAmount().subscribe({
      next: amount => {
        this.maxServiceAmount = amount ?? 0;
        this.filter.maxAmount = this.maxServiceAmount;
        this.subscribeToQueryParams();
      },
      error: err => {
        console.error(err);
        this.maxServiceAmount = 0;
        this.filter.maxAmount = 0;
        this.subscribeToQueryParams();
      },
    });
  }

  ngOnDestroy(): void {
    this.queryParamsSub?.unsubscribe();
  }

  private subscribeToQueryParams(): void {
    this.queryParamsSub?.unsubscribe();
    this.queryParamsSub = this.route.queryParams.subscribe(params => {
      const hoodId = Number(params['neighberHoodId']) || 0;
      this.filter.neighberHoodId = hoodId;
      this.filter.skip = 0;
      this.loadBusinesses(this.filter);
    });
  }

  loadCategories(): void {
    this.service.getAllCategories().subscribe({
      next: data => this.categories = data,
      error: err => console.error(err)
    });
  }

  loadServices(): void {
    this.service.getAllServices().subscribe({
      next: data => {
        this.businessServices = data;
        // Slider should always start from zero regardless of available service prices
        this.minServiceAmount = 0;
      },
      error: err => console.error(err)
    });
  }

  loadBusinesses(filter: BusinessFilter): void {
    this.service.getAllBusinesses(
      filter.neighberHoodId,
      filter.categoryId,
      filter.serviceIds,
      filter.take,
      filter.skip,
      filter.maxAmount
    ).subscribe({
      next: data => {
        this.allBusinesses = data;
        this.hasMore = data.length === filter.take;
        this.applyDayFilter();
      },
      error: err => console.error('خطا در دریافت داده‌ها:', err)
    });
  }

  onLocationSearch(selection: LocationSelection): void {
    const neighberHoodId = selection.neighborhoodId > 0 ? selection.neighborhoodId : 0;
    this.filter.neighberHoodId = neighberHoodId;
    this.filter.skip = 0;

    if (this.isBrowser) {
      this.router.navigate([], {
        queryParams: { neighberHoodId },
        queryParamsHandling: 'merge',
      });
    }

    this.loadBusinesses(this.filter);
  }

  onCategoryChange(cat: CategoryDto, event: Event) {
    const checked = (event.target as HTMLInputElement)?.checked ?? false;
    this.filter.categoryId = checked ? cat.categoryId : 0;
    this.filter.skip = 0;
    this.loadBusinesses(this.filter);
  }

  onPriceChange(value: number | string) {
    this.filter.maxAmount = Number(value) || 0;
    this.filter.skip = 0;
    this.loadBusinesses(this.filter);
    if (this.showModal && this.selectedBusiness) {
      this.availableServices = this.businessServices.filter(s => {
        const matchesBusiness = s.businessId === this.selectedBusiness!.id;
        const matchesService =
          this.filter.serviceIds.length === 0 || this.filter.serviceIds.includes(s.serviceId);
        const matchesPrice = s.amount <= this.filter.maxAmount;
        return matchesBusiness && matchesService && matchesPrice;
      });
    }
  }

  onServiceChange(serviceId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.filter.serviceIds.push(serviceId);
    } else {
      this.filter.serviceIds = this.filter.serviceIds.filter(id => id !== serviceId);
    }
    this.filter.skip = 0;
    this.loadBusinesses(this.filter);
  }

  // pagination
  nextPage() {
    this.filter.skip += this.filter.take;
    this.loadBusinesses(this.filter);
  }

  prevPage() {
    if (this.filter.skip >= this.filter.take) {
      this.filter.skip -= this.filter.take;
      this.loadBusinesses(this.filter);
    }
  }

  private applyDayFilter() {
    this.businesses = this.allBusinesses.filter(b =>
      b.businessDayTimeDtos?.some(t => t.dayOfWeek === this.filterDay)
    );
  }

  nextFilterDay() {
    this.filterDay = (this.filterDay % 7) + 1;
    this.filter.skip = 0;
    this.applyDayFilter();
  }

  prevFilterDay() {
    this.filterDay = ((this.filterDay + 5) % 7) + 1;
    this.filter.skip = 0;
    this.applyDayFilter();
  }

  // stars
  getStars(rate: number): number[] {
    const filled = Math.round(rate);
    return Array(5).fill(0).map((_, i) => (i < filled ? 1 : 0));
  }

  /**
   * Format service price in Persian locale with "تومان" suffix.
   * Falls back to a readable message if amount is missing.
   */
  formatPrice(amount?: number): string {
    return amount != null
      ? `${amount.toLocaleString('fa-IR')} تومان`
      : 'قیمت ثبت نشده';
  }

  // modal
  openModal(business: BusinessDto) {
    this.selectedBusiness = business;
    // فقط روزهایی که بازه زمانی معتبر دارند نمایش داده می‌شوند
    this.uniqueDays = [...new Set(
      business.businessDayTimeDtos
        .filter(t => t.businessOwnerTimeId != null && (t.fromTime ?? t.from) && (t.toTime ?? t.to))
        .map(d => d.dayOfWeek)
    )];
    const idx = this.uniqueDays.indexOf(this.filterDay);
    this.currentDayIndex = idx !== -1 ? idx : 0;
    this.availableServices = this.businessServices.filter(s => {
      const matchesBusiness = s.businessId === business.id;
      const matchesService =
        this.filter.serviceIds.length === 0 || this.filter.serviceIds.includes(s.serviceId);
      const matchesPrice = s.amount <= this.filter.maxAmount;
      return matchesBusiness && matchesService && matchesPrice;
    });
    this.selectedTimes = {};
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedBusiness = null;
    this.selectedTimes = {};
  }

  getDayName(day: number): string {
    const names = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
    return names[(day - 1 + 7) % 7];
  }

  get timesForCurrentDay(): BusinessDayTimeDto[] {
    if (!this.selectedBusiness) return [];
    const day = this.uniqueDays[this.currentDayIndex];
    return this.selectedBusiness.businessDayTimeDtos.filter(t =>
      t.dayOfWeek === day &&
      t.businessOwnerTimeId != null &&
      (t.fromTime ?? t.from) &&
      (t.toTime ?? t.to)
    );
  }

  nextDay() {
    if (this.currentDayIndex < this.uniqueDays.length - 1) {
      this.currentDayIndex++;
      // reset previously selected times when switching days
      this.selectedTimes = {};
    }
  }

  prevDay() {
    if (this.currentDayIndex > 0) {
      this.currentDayIndex--;
      // clear selections so times re-load for the new day
      this.selectedTimes = {};
    }
  }

  onTimeSelect(serviceId: number, timeId: string) {
    this.selectedTimes[serviceId] = Number(timeId);
  }

  reserve(serviceId: number) {
    const timeId = this.selectedTimes[serviceId];
    if (!timeId) return;
    const time = this.timesForCurrentDay.find(t => t.businessOwnerTimeId === timeId);
    if (!time) return;
    this.service.reserveServices(timeId, [serviceId]).subscribe({
      next: () => time.isReserved = true,
      error: err => console.error('خطا در رزرو:', err)
    });
  }
}

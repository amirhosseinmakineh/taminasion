import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusinessService } from '../../services/business.service';
import { CategoryDto } from '../../Interfaces/Businises/CategoryDto';
import { BusinessServiceDto } from '../../Interfaces/Businises/BusinessServiceDto';
import { BusinessDto, BusinessDayTimeDto } from '../../Interfaces/Businises/BusinessDto';
import { isPlatformBrowser } from '@angular/common';
import { BusinessFilter } from '../../Interfaces/Businises/BusinessFilter';

@Component({
  selector: 'app-business-search',
  templateUrl: './BusinessSearch.component.html',
  styleUrls: ['./BusinessSearch.component.css'],
  standalone: false,
})
export class BusinessSearchComponent implements OnInit {

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
  BusinessServiceDto: BusinessServiceDto[] = [];
  BusinessDto: BusinessDto[] = [];

  // انتخاب‌ها
  selectedServices: number[] = [];
  availableServices: BusinessServiceDto[] = [];
  selectedCategoryId = 0;

  // pagination
  take = 20;
  skip = 0;

  // modal
  showModal = false;
  selectedBusiness: BusinessDto | null = null;
  uniqueDays: number[] = [];
  currentDayIndex = 0;
  selectedTimes: { [serviceId: number]: number } = {};

  maxServiceAmount = 0;
  minServiceAmount = 0;

  constructor(
    private route: ActivatedRoute,
    private service: BusinessService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.LoadCategories();
      this.LoadServices();

      this.route.queryParams.subscribe(params => {
        const hoodId = Number(params['neighberHoodId']) || 0;
        this.filter.neighberHoodId = hoodId;   // 🔴 مقدار مستقیم توی فیلتر ست بشه

        this.service.getMaxServiceAmount().subscribe({
          next: amount => {
            this.maxServiceAmount = amount;
            this.filter.maxAmount = amount;
            this.LoadBusinesses(this.filter);
          },
          error: err => console.error(err)
        });
      });
    }
  }

  LoadCategories() {
    this.service.getAllCategories().subscribe({
      next: data => this.categories = data,
      error: err => console.error(err)
    });
  }

  LoadServices() {
    this.service.getAllServices().subscribe({
      next: data => {
        this.BusinessServiceDto = data;
        if (data.length) {
          this.minServiceAmount = Math.min(...data.map(s => s.amount));
        }
      },
      error: err => console.error(err)
    });
  }

  LoadBusinesses(filter: BusinessFilter): void {
    console.log('sending filter >>>', filter);

    this.service.getAllBusineses(
      filter.neighberHoodId,
      filter.categoryId,
      filter.serviceIds,
      filter.take,
      filter.skip,
      filter.maxAmount
    ).subscribe({
      next: data => this.BusinessDto = data,
      error: err => console.error('خطا در دریافت داده‌ها:', err)
    });
  }

  onCategoryChange(cat: CategoryDto, event: Event) {
    const checked = (event.target as HTMLInputElement)?.checked ?? false;
    this.filter.categoryId = checked ? cat.categoryId : 0;
    this.filter.skip = 0;
    this.LoadBusinesses(this.filter);
  }

  onPriceChange(value: number) {
    this.filter.maxAmount = value;
    this.filter.skip = 0;
    this.LoadBusinesses(this.filter);
    if (this.showModal && this.selectedBusiness) {
      this.availableServices = this.BusinessServiceDto.filter(s => {
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
    this.LoadBusinesses(this.filter);
  }

  // pagination
  nextPage() {
    this.filter.skip += this.filter.take;
    this.LoadBusinesses(this.filter);
  }

  prevPage() {
    if (this.filter.skip >= this.filter.take) {
      this.filter.skip -= this.filter.take;
      this.LoadBusinesses(this.filter);
    }
  }

  // stars
  getStars(rate: number): number[] {
    const filled = Math.round(rate);
    return Array(5).fill(0).map((_, i) => (i < filled ? 1 : 0));
  }

  // modal
  openModal(business: BusinessDto) {
    this.selectedBusiness = business;
    this.uniqueDays = [...new Set(business.businessDayTimeDtos.map(d => d.dayOfWeek))];
    this.currentDayIndex = 0;
    this.availableServices = this.BusinessServiceDto.filter(s => {
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
    return this.selectedBusiness.businessDayTimeDtos.filter(t => t.dayOfWeek === day);
  }

  nextDay() {
    if (this.currentDayIndex < this.uniqueDays.length - 1) this.currentDayIndex++;
  }

  prevDay() {
    if (this.currentDayIndex > 0) this.currentDayIndex--;
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

import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusinessService } from '../../services/business.service';
import { CategoryDto } from '../../Interfaces/Businises/CategoryDto';
import { BusinessServiceDto } from '../../Interfaces/Businises/BusinessServiceDto';
import { BusinessDto, BusinessDayTimeDto } from '../../Interfaces/Businises/BusinessDto';
import { BusinessDto } from '../../Interfaces/Businises/BusinessDto';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-business-search',
  templateUrl: './BusinessSearch.component.html',
  styleUrls: ['./BusinessSearch.component.css'],
  standalone: false,
})
export class BusinessSearchComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private service: BusinessService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}
//Properties

  cityId = -1;
  regionId = -1;
  neighberHoodId = -1;
categories : CategoryDto[] = [];
selectedCategories: number[] = [];
BusinessServiceDto : BusinessServiceDto[] = [];
BusinessDto : BusinessDto[] = [];

  // pagination
  skip = 0;
  take = 6;

  // modal
  showModal = false;
  selectedBusiness: BusinessDto | null = null;
  uniqueDays: number[] = [];
  currentDayIndex = 0;
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.LoadCategories();
      this.LoadServices();

      this.route.queryParams.subscribe(params => {
        this.neighberHoodId = +params['neighberHoodId'] || 0;  // + برای تبدیل به number
        // اینجا میتونی API بزنی بر اساس neighborhoodId
        this.LoadBusineses(this.neighberHoodId);
      });
    }
  }
  LoadCategories(){
this.service.getAllCategories().subscribe({
  next: (data)=>{
    this.categories = data;
  },
  error : (err)=>{
    throw new err;
  }
})
}

LoadServices(){
  this.service.getAllServices().subscribe({
    next : (data) => {
      this.BusinessServiceDto = data
    },
    error : (err)=>{
      throw new err
    }
  })
}

  LoadBusineses(neighberHoodId: number, categoryId?: number): void {
    this.service.getAllBusineses(neighberHoodId, categoryId, this.take, this.skip).subscribe({
      next: (data) => {
        this.BusinessDto = data;
      },
      error: (err) => {
        console.error('خطا در دریافت داده‌ها:', err);
      }
    });
  }

  // category filter
  onCategoryChange(cat: CategoryDto, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedCategories = [cat.id];
    } else {
      this.selectedCategories = [];
    }

    this.skip = 0;
    const categoryId = this.selectedCategories.length ? this.selectedCategories[0] : undefined;
    this.LoadBusineses(this.neighberHoodId, categoryId);
  }

  // pagination handlers
  nextPage() {
    this.skip += this.take;
    const categoryId = this.selectedCategories.length ? this.selectedCategories[0] : undefined;
    this.LoadBusineses(this.neighberHoodId, categoryId);
  }

  prevPage() {
    if (this.skip >= this.take) {
      this.skip -= this.take;
      const categoryId = this.selectedCategories.length ? this.selectedCategories[0] : undefined;
      this.LoadBusineses(this.neighberHoodId, categoryId);
    }
  }

  // star helpers
  getStars(rate: number): number[] {
    const filled = Math.round(rate);
    return Array(5)
      .fill(0)
      .map((_, i) => (i < filled ? 1 : 0));
  }

  // modal handlers
  openModal(business: BusinessDto) {
    this.selectedBusiness = business;
    this.uniqueDays = [
      ...new Set(business.businessDayTimeDtos.map((d) => d.dayOfWeek)),
    ];
    this.currentDayIndex = 0;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedBusiness = null;
  }

  getDayName(day: number): string {
    const names = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
    return names[(day - 1 + 7) % 7];
  }

  get timesForCurrentDay(): BusinessDayTimeDto[] {
    if (!this.selectedBusiness) return [];
    const day = this.uniqueDays[this.currentDayIndex];
    return this.selectedBusiness.businessDayTimeDtos.filter(
      (t) => t.dayOfWeek === day
    );
  }

  nextDay() {
    if (this.currentDayIndex < this.uniqueDays.length - 1) {
      this.currentDayIndex++;
    }
  }

  prevDay() {
    if (this.currentDayIndex > 0) {
      this.currentDayIndex--;
    }
  }

  reserve(time: BusinessDayTimeDto) {
    // TODO: call reserve API
    time.isReserved = true;
  }

}


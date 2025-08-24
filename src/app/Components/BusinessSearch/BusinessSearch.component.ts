import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusinessService } from '../../services/business.service';
import { CategoryDto } from '../../Interfaces/Businises/CategoryDto';
import { BusinessServiceDto } from '../../Interfaces/Businises/BusinessServiceDto';
import { BusinessDto } from '../../Interfaces/Businises/BusinessDto';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-business-search',
  templateUrl: './BusinessSearch.component.html',
  styleUrls: ['./BusinessSearch.component.css'],
  standalone: false,
})
export class BusinessSearchComponent implements OnInit {
  @Input() business?: { rate: number | null };

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
  onCategoryChange(cat: CategoryDto, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedCategories.push(cat.id);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== cat.id);
    }

    console.log('انتخاب شده‌ها:', this.selectedCategories);
  }

LoadBusineses(neighberHoodId: number): void {
  this.service.getAllBusineses(neighberHoodId,0,6).subscribe({
    next: (data) => {
      this.BusinessDto = data;
    },
    error: (err) => {
      console.error('خطا در دریافت داده‌ها:', err);
    }
  });
}

}


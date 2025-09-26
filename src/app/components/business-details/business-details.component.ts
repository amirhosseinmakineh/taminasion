import { Component } from '@angular/core';

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.css'],
  standalone: false,
})
export class BusinessDetailsComponent {
  activeTab: 'staff' | 'experience' | 'certificates' | 'comments' = 'staff';

  staff: string[] = ['آرایشگر الف', 'آرایشگر ب'];
  experiences: string[] = [];
  certificates: string[] = [];
  comments: string[] = ['بسیار عالی', 'خدمات خوب و باکیفیت'];
}

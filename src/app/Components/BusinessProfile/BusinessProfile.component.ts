import { Component } from '@angular/core';

@Component({
  selector: 'app-business-profile',
  templateUrl: './BusinessProfile.component.html',
  styleUrls: ['./BusinessProfile.component.css'],
  standalone: false,
})
export class BusinessProfileComponent {
  activeTab: 'experience' | 'certificates' | 'comments' = 'experience';

  experiences: string[] = ['۵ سال سابقه کار در سالن الف'];
  certificates: string[] = [];
  comments: string[] = ['بسیار حرفه‌ای و خوش برخورد'];
}

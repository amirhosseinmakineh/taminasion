import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent {
  options = [
    { title: 'اطلاعات کسب‌وکار', description: 'ویرایش نام، آدرس و جزئیات سالن.' },
    { title: 'ساعات کاری', description: 'تنظیم روزها و شیفت‌های کاری.' },
    { title: 'قوانین کنسلی', description: 'شرایط لغو و جریمه‌ها.' },
    { title: 'تنظیمات پیامک', description: 'متن و الگوی پیام‌های اطلاع‌رسانی.' },
    { title: 'نقش‌ها و دسترسی‌ها', description: 'مدیریت سطح دسترسی اعضای تیم.' },
  ];
}

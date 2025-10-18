import { Component } from '@angular/core';

interface ProfileTab {
  id: string;
  label: string;
}

@Component({
  selector: 'app-business-owner-profile',
  templateUrl: './business-owner-profile.component.html',
  styleUrls: ['./business-owner-profile.component.css'],
  standalone: false,
})
export class BusinessOwnerProfileComponent {
  isDarkMode = false;
  activeTab = 'about';

  readonly tabs: ProfileTab[] = [
    { id: 'about', label: 'درباره من' },
    { id: 'experience', label: 'سابقه کاری' },
    { id: 'certificates', label: 'مدارک و افتخارات' },
    { id: 'booking', label: 'نوبت‌دهی' },
    { id: 'salon-info', label: 'اطلاعات سالن' },
    { id: 'reviews', label: 'نظرات' },
  ];

  readonly bioParagraphs: string[] = [
    'من یک آرایشگر حرفه‌ای با بیش از ۷ سال تجربه در زمینه رنگ، کوتاهی و احیای مو هستم. تمرکزم روی خلق استایلیه که به شخصیت و ظاهر شما بخوره، نه صرفا پیروی از مد.',
    'به روز بودن در تکنیک‌ها، استفاده از مواد باکیفیت و وقت‌شناسی جزو اصول کاری منه. یه آرایش خوب فقط ظاهر رو تغییر نمیده — اعتماد به نفس می‌سازه.',
    'اگه دنبال یه تجربه دل‌نشین، دقیق و حرفه‌ای هستید، خوشحال می‌شم کنارتون باشم. ✨',
  ];

  readonly achievements: string[] = ['وقت‌شناسی', 'دقت بالا', 'تخصص در رنگ'];

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }
}

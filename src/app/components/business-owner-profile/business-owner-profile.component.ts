import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

import { UserProfileService } from '../../services/user-profile.service';
import {
  BusinessOwnerAchievement,
  BusinessOwnerProfile,
} from '../../models/user/business-owner-profile.model';

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
export class BusinessOwnerProfileComponent implements OnInit {
  isDarkMode = false;
  activeTab = 'about';
  loading = true;
  error?: string;
  profile?: BusinessOwnerProfile;

  tabs: ProfileTab[] = [
    { id: 'about', label: 'درباره من' },
    { id: 'experience', label: 'سابقه کاری' },
    { id: 'certificates', label: 'مدارک و افتخارات' },
    { id: 'booking', label: 'نوبت‌دهی' },
    { id: 'salon-info', label: 'اطلاعات سالن' },
    { id: 'reviews', label: 'نظرات' },
  ];

  bioParagraphs: string[] = [];
  achievements: string[] = [];

  readonly defaultBioParagraphs: string[] = [
    'من یک آرایشگر حرفه‌ای با بیش از ۷ سال تجربه در زمینه رنگ، کوتاهی و احیای مو هستم. تمرکزم روی خلق استایلیه که به شخصیت و ظاهر شما بخوره، نه صرفا پیروی از مد.',
    'به روز بودن در تکنیک‌ها، استفاده از مواد باکیفیت و وقت‌شناسی جزو اصول کاری منه. یه آرایش خوب فقط ظاهر رو تغییر نمیده — اعتماد به نفس می‌سازه.',
    'اگه دنبال یه تجربه دل‌نشین، دقیق و حرفه‌ای هستید، خوشحال می‌شم کنارتون باشم. ✨',
  ];

  readonly defaultBanner =
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1350&q=80';
  readonly defaultProfileImage =
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80';
  private readonly imageBaseUrl = 'http://localhost:5107/Images';

  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const userId =
      this.route.snapshot.paramMap.get('userId') ??
      this.route.snapshot.queryParamMap.get('userId');

    this.userProfileService
      .getBusinessOwnerProfile(userId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: response => {
          if (!response.isSuccess || !response.data) {
            this.error = response.message || 'اطلاعات پروفایل یافت نشد.';
            return;
          }

          this.profile = response.data;
          this.bioParagraphs = this.extractBioParagraphs(response.data.aboutMe);
          this.achievements = this.extractAchievements(response.data.achievements);
          this.setupTabs();
        },
        error: () => {
          this.error = 'خطا در برقراری ارتباط با سرور.';
        },
      });
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  get bannerImage(): string {
    return this.buildImageUrl(this.profile?.banner) ?? this.defaultBanner;
  }

  get profileImage(): string {
    return this.buildImageUrl(this.profile?.imageName) ?? this.defaultProfileImage;
  }

  get commentsCount(): number {
    const businessComments = this.profile?.businessInfo?.comments?.length ?? 0;
    const profileComments = this.profile?.comments?.length ?? 0;
    return Math.max(businessComments, profileComments);
  }

  get takingTurnsCount(): number {
    return this.profile?.takingTurns?.length ?? 0;
  }

  private setupTabs(): void {
    const nameLabel = this.profile?.name?.trim()
      ? `درباره ${this.profile.name}`
      : 'درباره من';
    const workHistoryLabel = this.profile?.workHistory?.trim()
      ? 'سوابق کاری'
      : 'سوابق کاری (ثبت نشده)';
    const businessNameLabel = this.profile?.businessInfo?.businessName?.trim()
      ? `اطلاعات ${this.profile.businessInfo.businessName}`
      : 'اطلاعات سالن';
    const achievementsCount = this.profile?.achievements?.length ?? 0;

    this.tabs = [
      { id: 'about', label: nameLabel },
      { id: 'experience', label: workHistoryLabel },
      { id: 'certificates', label: `افتخارات (${achievementsCount})` },
      { id: 'booking', label: `نوبت‌دهی (${this.takingTurnsCount})` },
      { id: 'salon-info', label: businessNameLabel },
      { id: 'reviews', label: `نظرات (${this.commentsCount})` },
    ];
  }

  private extractBioParagraphs(aboutMe: string | null): string[] {
    if (aboutMe) {
      const paragraphs = aboutMe
        .split(/\r?\n/)
        .map(paragraph => paragraph.trim())
        .filter(Boolean);
      if (paragraphs.length) {
        return paragraphs;
      }
    }
    return [...this.defaultBioParagraphs];
  }

  private extractAchievements(
    achievements: BusinessOwnerAchievement[] | null | undefined,
  ): string[] {
    if (!achievements?.length) {
      return [];
    }

    return achievements
      .map(achievement => achievement.name?.trim())
      .filter((name): name is string => !!name);
  }

  trackByTab(_: number, tab: ProfileTab): string {
    return tab.id;
  }

  trackByParagraph(index: number): number {
    return index;
  }

  trackByAchievement(index: number, achievement: string): string {
    return `${achievement}-${index}`;
  }

  private buildImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath) {
      return null;
    }
    if (/^https?:\/\//i.test(imagePath)) {
      return imagePath;
    }
    return `${this.imageBaseUrl}/${imagePath}`;
  }
}

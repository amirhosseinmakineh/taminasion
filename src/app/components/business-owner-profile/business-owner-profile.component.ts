import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

import { UserProfileService } from '../../services/user-profile.service';
import { BusinessOwnerProfile } from '../../models/user/business-owner-profile.model';

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

  tabs: ProfileTab[] = [];

  bioParagraphs: string[] = [];

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
    const businessOwnerId =
      this.route.snapshot.paramMap.get('id') ??
      this.route.snapshot.queryParamMap.get('id') ??
      this.route.snapshot.paramMap.get('userId') ??
      this.route.snapshot.queryParamMap.get('userId');

    this.userProfileService
      .getBusinessOwnerProfile(businessOwnerId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: response => {
          if (!response.isSuccess || !response.data) {
            this.error = response.message || 'اطلاعات پروفایل یافت نشد.';
            return;
          }

          this.profile = response.data;
          this.bioParagraphs = this.extractBioParagraphs(response.data.aboutMe);
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
    const businessNameLabel = this.profile?.businessInfo?.businessName?.trim()
      ? `اطلاعات ${this.profile.businessInfo.businessName}`
      : 'اطلاعات سالن';
    const tabs: ProfileTab[] = [{ id: 'about', label: nameLabel }];

    if (this.takingTurnsCount > 0) {
      tabs.push({ id: 'booking', label: `نوبت‌دهی (${this.takingTurnsCount})` });
    }

    if (this.profile?.businessInfo) {
      tabs.push({ id: 'salon-info', label: businessNameLabel });
    }

    tabs.push({ id: 'reviews', label: `نظرات (${this.commentsCount})` });

    this.tabs = tabs;

    if (!tabs.some(tab => tab.id === this.activeTab)) {
      this.activeTab = tabs[0]?.id ?? '';
    }
  }

  private extractBioParagraphs(aboutMe: string | null): string[] {
    if (!aboutMe) {
      return [];
    }

    return aboutMe
      .split(/\r?\n/)
      .map(paragraph => paragraph.trim())
      .filter(Boolean);
  }

  trackByTab(_: number, tab: ProfileTab): string {
    return tab.id;
  }

  trackByParagraph(index: number): number {
    return index;
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

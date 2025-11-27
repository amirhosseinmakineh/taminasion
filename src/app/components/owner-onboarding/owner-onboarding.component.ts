import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OnboardingService } from '../../services/onboarding.service';
import { Router } from '@angular/router';

interface BusinessInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  logo?: File | null;
}

interface WorkingHours {
  days: string[];
  start: string;
  end: string;
}

interface ServiceOption {
  label: string;
  value: string;
  selected: boolean;
}

@Component({
  selector: 'app-owner-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './owner-onboarding.component.html',
  styleUrls: ['./owner-onboarding.component.css']
})
export class OwnerOnboardingComponent {
  step = 1;
  readonly totalSteps = 4;

  business: BusinessInfo = {
    name: '',
    phone: '',
    address: '',
    city: '',
    logo: null,
  };

  hours: WorkingHours = {
    days: ['شنبه', 'یکشنبه', 'دوشنبه'],
    start: '09:00',
    end: '18:00',
  };

  services: ServiceOption[] = [
    { label: 'کوتاهی', value: 'haircut', selected: true },
    { label: 'رنگ مو', value: 'hair-color', selected: false },
    { label: 'ناخن', value: 'nails', selected: false },
    { label: 'میکاپ', value: 'makeup', selected: false },
    { label: 'مژه', value: 'lashes', selected: false },
  ];

  constructor(private onboardingService: OnboardingService, private router: Router) {}

  get progressLabel(): string {
    return `${this.step}/${this.totalSteps}`;
  }

  goToPreviousStep(): void {
    this.step = Math.max(1, this.step - 1);
  }

  goToNextStep(): void {
    if (this.canProceed()) {
      this.step = Math.min(this.totalSteps, this.step + 1);
    }
  }

  toggleDay(day: string): void {
    this.hours.days = this.hours.days.includes(day)
      ? this.hours.days.filter(d => d !== day)
      : [...this.hours.days, day];
  }

  toggleService(option: ServiceOption): void {
    option.selected = !option.selected;
  }

  canProceed(): boolean {
    if (this.step === 1) {
      return Boolean(this.business.name && this.business.phone && this.business.address && this.business.city);
    }

    if (this.step === 2) {
      return this.hours.days.length > 0 && Boolean(this.hours.start && this.hours.end);
    }

    if (this.step === 3) {
      return this.services.some(service => service.selected);
    }

    return true;
  }

  get selectedServicesSummary(): string {
    const labels = this.services.filter(service => service.selected).map(service => service.label);
    return labels.join('، ') || 'فعلاً سرویسی انتخاب نشده';
  }

  handleLogoChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.business.logo = target.files?.[0] ?? null;
  }

  submit(): void {
    // Mock submission for now
    // eslint-disable-next-line no-console
    console.log('اطلاعات آن‌بوردینگ', {
      business: this.business,
      hours: this.hours,
      services: this.services.filter(service => service.selected).map(service => service.value),
    });
    this.onboardingService.completeOnboarding();
    this.router.navigate(['/app/dashboard']);
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessProfileStateService } from '../../state/business-profile-state.service';
import { BusinessService } from '../../../../services/business.service';
import { BusinessCity } from '../../../../models/business/business-city.model';
import { BusinessRegion } from '../../../../models/business/business-region.model';
import { BusinessNeighborhood } from '../../../../models/business/business-neighborhood.model';

@Component({
  selector: 'app-business-profile-setup',
  standalone: true,
  templateUrl: './business-profile-setup.component.html',
  styleUrls: ['./business-profile-setup.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class BusinessProfileSetupComponent implements OnInit {
  submitting = false;
  currentStep = 1;

  readonly steps = [
    { id: 1, label: 'اطلاعات کاربری' },
    { id: 2, label: 'اطلاعات کسب‌وکار و موقعیت' },
    { id: 3, label: 'زمان‌بندی خدمات' }
  ];

  readonly totalSteps = this.steps.length;

  profileForm: FormGroup;

  cities: BusinessCity[] = [];
  regions: BusinessRegion[] = [];
  neighborhoods: BusinessNeighborhood[] = [];

  dayOptions = [
    { id: 1, label: 'شنبه' },
    { id: 2, label: 'یکشنبه' },
    { id: 3, label: 'دوشنبه' },
    { id: 4, label: 'سه‌شنبه' },
    { id: 5, label: 'چهارشنبه' },
    { id: 6, label: 'پنجشنبه' },
    { id: 7, label: 'جمعه' },
  ];

  timeOptions = [
    { id: 1, label: '۰۸:۰۰ - ۱۰:۰۰' },
    { id: 2, label: '۱۰:۰۰ - ۱۲:۰۰' },
    { id: 3, label: '۱۲:۰۰ - ۱۴:۰۰' },
    { id: 4, label: '۱۴:۰۰ - ۱۶:۰۰' },
    { id: 5, label: '۱۶:۰۰ - ۱۸:۰۰' },
    { id: 6, label: '۱۸:۰۰ - ۲۰:۰۰' },
  ];

  achievementText = '';

  constructor(
    private fb: FormBuilder,
    private profileState: BusinessProfileStateService,
    private router: Router,
    private businessService: BusinessService
  ) {
    this.profileForm = this.fb.group({
      imageName: ['', [Validators.required]],
      bannerImageName: ['', [Validators.required]],
      family: ['', [Validators.required]],
      aboutMe: ['', [Validators.required, Validators.minLength(10)]],
      age: [null, [Validators.required, Validators.min(1)]],
      city: this.fb.group({
        id: [null, [Validators.required]],
        name: ['', [Validators.required]]
      }),
      region: this.fb.group({
        id: [null, [Validators.required]],
        regionName: ['', [Validators.required]]
      }),
      neighborhood: this.fb.group({
        id: [null, [Validators.required]],
        neighborhoodName: ['', [Validators.required]]
      }),
      business: this.fb.group({
        businessLogo: ['', [Validators.required]],
        businessName: ['', [Validators.required]],
        businessOwnerName: ['', [Validators.required]],
        description: ['', [Validators.required]],
        achevmentNames: this.fb.control<string[]>([], [Validators.required]),
        businessDayTimeDtos: this.fb.array([]),
      }),
      dayIds: this.fb.control<number[]>([], [Validators.required]),
      timeIds: this.fb.control<number[]>([], [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadCities();
    this.disableRegionControl();
    this.disableNeighborhoodControl();
  }

  get businessDayTimeDtos(): FormArray {
    return this.profileForm.get('business.businessDayTimeDtos') as FormArray;
  }

  get isRegionDisabled(): boolean {
    return this.profileForm.get('region')?.disabled ?? true;
  }

  get isNeighborhoodDisabled(): boolean {
    return this.profileForm.get('neighborhood')?.disabled ?? true;
  }

  get achievementTags(): string[] {
    return (this.profileForm.get('business.achevmentNames')?.value as string[]) ?? [];
  }

  private loadCities(): void {
    this.businessService.getCities().subscribe(cities => {
      this.cities = cities;
    });
  }

  onCityChange(cityId: string | null | undefined): void {
    const selectedCity = this.cities.find(city => String(city.id) === cityId);
    const cityGroup = this.profileForm.get('city');
    const regionGroup = this.profileForm.get('region');
    const neighborhoodGroup = this.profileForm.get('neighborhood');

    cityGroup?.patchValue({
      id: selectedCity?.id ?? null,
      name: selectedCity?.name ?? ''
    });

    regionGroup?.reset();
    neighborhoodGroup?.reset();
    this.regions = [];
    this.neighborhoods = [];

    if (!selectedCity) {
      this.disableRegionControl();
      this.disableNeighborhoodControl();
      return;
    }

    this.enableRegionControl();

    this.businessService.getRegionsAndBusinessesByCity(selectedCity.id).subscribe(response => {
      this.regions = response.regions ?? [];
    });
  }

  onRegionChange(regionId: string | null | undefined): void {
    const selectedRegion = this.regions.find(region => String(region.id) === regionId);
    const regionGroup = this.profileForm.get('region');
    const neighborhoodGroup = this.profileForm.get('neighborhood');
    const selectedCityId = this.profileForm.get('city.id')?.value as number | null;

    regionGroup?.patchValue({
      id: selectedRegion?.id ?? null,
      regionName: selectedRegion?.regionName ?? ''
    });

    neighborhoodGroup?.reset();
    this.neighborhoods = [];

    if (!selectedRegion || !selectedCityId) {
      this.disableNeighborhoodControl();
      return;
    }

    this.enableNeighborhoodControl();

    this.businessService.getNeighborhoodsAndBusinesses(selectedCityId, selectedRegion.id).subscribe(response => {
      this.neighborhoods = response.neighborhoods ?? [];
    });
  }

  onNeighborhoodChange(neighborhoodId: string | null | undefined): void {
    const selectedNeighborhood = this.neighborhoods.find(item => String(item.id) === neighborhoodId);
    const neighborhoodGroup = this.profileForm.get('neighborhood');

    neighborhoodGroup?.patchValue({
      id: selectedNeighborhood?.id ?? null,
      neighborhoodName: selectedNeighborhood?.neighborhoodName ?? ''
    });
  }

  toggleSelection(controlName: 'dayIds' | 'timeIds', id: number): void {
    const control = this.profileForm.get(controlName);
    if (!control) {
      return;
    }

    const currentValue = new Set(control.value as number[]);
    if (currentValue.has(id)) {
      currentValue.delete(id);
    } else {
      currentValue.add(id);
    }

    control.setValue(Array.from(currentValue));
    control.markAsDirty();
    control.markAsTouched();
    this.syncBusinessDayTimes();
  }

  updateAchievements(value: string): void {
    this.achievementText = value;
    const achievementList = value
      .split(/\n|,/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
    this.profileForm.get('business.achevmentNames')?.setValue(achievementList);
    this.profileForm.get('business.achevmentNames')?.markAsDirty();
  }

  onLogoSelected(event: Event): void {
    const fileName = this.extractFileName(event);
    this.profileForm.get('business.businessLogo')?.setValue(fileName);
    this.profileForm.get('business.businessLogo')?.markAsTouched();
  }

  onImageSelected(event: Event): void {
    const fileName = this.extractFileName(event);
    this.profileForm.get('imageName')?.setValue(fileName);
    this.profileForm.get('imageName')?.markAsTouched();
  }

  onBannerSelected(event: Event): void {
    const fileName = this.extractFileName(event);
    this.profileForm.get('bannerImageName')?.setValue(fileName);
    this.profileForm.get('bannerImageName')?.markAsTouched();
  }

  private syncBusinessDayTimes(): void {
    const days = this.profileForm.get('dayIds')?.value as number[];
    const times = this.profileForm.get('timeIds')?.value as number[];

    this.businessDayTimeDtos.clear();

    if (!days?.length || !times?.length) {
      this.businessDayTimeDtos.markAsTouched();
      this.businessDayTimeDtos.markAsDirty();
      return;
    }

    days.forEach(day => {
      times.forEach(time => {
        this.businessDayTimeDtos.push(
          this.fb.group({
            dayOfWeek: [day],
            fromTime: [''],
            toTime: [''],
            isReserved: [false],
            businessOwnerDayId: [day],
            businessOwnerTimeId: [time]
          })
        );
      });
    });

    this.businessDayTimeDtos.markAsTouched();
    this.businessDayTimeDtos.markAsDirty();
  }

  goToNextStep(): void {
    if (!this.isStepValid(this.currentStep)) {
      this.markStepTouched(this.currentStep);
      return;
    }

    this.currentStep = Math.min(this.currentStep + 1, this.totalSteps);
  }

  goToPreviousStep(): void {
    this.currentStep = Math.max(1, this.currentStep - 1);
  }

  goToStep(stepId: number): void {
    if (stepId < this.currentStep) {
      this.currentStep = stepId;
      return;
    }

    if (stepId === this.currentStep) {
      return;
    }

    if (this.isStepValid(this.currentStep)) {
      this.currentStep = stepId;
    } else {
      this.markStepTouched(this.currentStep);
    }
  }

  isStepValid(stepId: number): boolean {
    switch (stepId) {
      case 1:
        return (
          (this.profileForm.get('imageName')?.valid ?? false) &&
          (this.profileForm.get('bannerImageName')?.valid ?? false) &&
          (this.profileForm.get('family')?.valid ?? false) &&
          (this.profileForm.get('age')?.valid ?? false) &&
          (this.profileForm.get('aboutMe')?.valid ?? false)
        );
      case 2:
        return (
          Boolean(this.profileForm.get('city.id')?.value) &&
          Boolean(this.profileForm.get('region.id')?.value) &&
          Boolean(this.profileForm.get('neighborhood.id')?.value) &&
          (this.profileForm.get('business.businessLogo')?.valid ?? false) &&
          (this.profileForm.get('business.businessName')?.valid ?? false) &&
          (this.profileForm.get('business.businessOwnerName')?.valid ?? false) &&
          (this.profileForm.get('business.description')?.valid ?? false) &&
          (this.profileForm.get('business.achevmentNames')?.valid ?? false)
        );
      case 3:
        return (
          (this.profileForm.get('dayIds')?.valid ?? false) &&
          (this.profileForm.get('timeIds')?.valid ?? false) &&
          this.businessDayTimeDtos.length > 0
        );
      default:
        return this.profileForm.valid;
    }
  }

  canVisitStep(stepId: number): boolean {
    if (stepId <= this.currentStep) {
      return true;
    }

    if (stepId === this.currentStep + 1) {
      return this.isStepValid(this.currentStep);
    }

    if (stepId === this.currentStep + 2) {
      return this.isStepValid(this.currentStep) && this.isStepValid(this.currentStep + 1);
    }

    return false;
  }

  submitProfile(): void {
    const allStepsValid = [1, 2, 3].every(stepId => this.isStepValid(stepId));

    if (!allStepsValid || this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const businessGroup = this.profileForm.get('business') as FormGroup | null;
    const cityGroup = this.profileForm.get('city') as FormGroup | null;
    const regionGroup = this.profileForm.get('region') as FormGroup | null;
    const neighborhoodGroup = this.profileForm.get('neighborhood') as FormGroup | null;

    const payload = {
      ...this.profileForm.getRawValue(),
      business: {
        ...(businessGroup?.getRawValue?.() ?? {}),
        city: cityGroup?.getRawValue?.(),
        region: regionGroup?.getRawValue?.(),
        neighborhood: neighborhoodGroup?.getRawValue?.(),
      },
    };

    // eslint-disable-next-line no-console
    console.log('اطلاعات نهایی پروفایل کسب‌وکار', payload);

    this.submitting = true;

    setTimeout(() => {
      this.profileState.completeProfile();
      this.submitting = false;
      this.router.navigate(['/business/customers']);
    }, 400);
  }

  private extractFileName(event: Event): string {
    const input = event.target as HTMLInputElement;
    return input.files?.[0]?.name ?? '';
  }

  private disableRegionControl(): void {
    this.profileForm.get('region')?.reset();
    this.profileForm.get('region')?.disable();
  }

  private enableRegionControl(): void {
    this.profileForm.get('region')?.enable();
  }

  private disableNeighborhoodControl(): void {
    this.profileForm.get('neighborhood')?.reset();
    this.profileForm.get('neighborhood')?.disable();
  }

  private enableNeighborhoodControl(): void {
    this.profileForm.get('neighborhood')?.enable();
  }

  private markStepTouched(stepId: number): void {
    if (stepId === 1) {
      this.profileForm.get('imageName')?.markAsTouched();
      this.profileForm.get('bannerImageName')?.markAsTouched();
      this.profileForm.get('family')?.markAsTouched();
      this.profileForm.get('age')?.markAsTouched();
      this.profileForm.get('aboutMe')?.markAsTouched();
    }

    if (stepId === 2) {
      this.profileForm.get('city')?.markAllAsTouched();
      this.profileForm.get('region')?.markAllAsTouched();
      this.profileForm.get('neighborhood')?.markAllAsTouched();
      this.profileForm.get('business')?.markAllAsTouched();
    }

    if (stepId === 3) {
      this.profileForm.get('dayIds')?.markAllAsTouched();
      this.profileForm.get('timeIds')?.markAllAsTouched();
      this.businessDayTimeDtos.markAllAsTouched();
    }
  }
}

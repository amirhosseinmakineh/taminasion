import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessProfileStateService } from '../../state/business-profile-state.service';

@Component({
  selector: 'app-business-profile-setup',
  templateUrl: './business-profile-setup.component.html',
  styleUrls: ['./business-profile-setup.component.css']
})
export class BusinessProfileSetupComponent {
  submitting = false;

  profileForm = this.fb.group({
    businessName: ['', [Validators.required]],
    ownerName: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    category: ['', [Validators.required]],
    address: ['', [Validators.required]],
    logo: ['']
  });

  categories = ['Barbershop', 'Salon', 'Beauty', 'Spa', 'Clinic'];

  constructor(
    private fb: FormBuilder,
    private profileState: BusinessProfileStateService,
    private router: Router
  ) {}

  submitProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.submitting = true;

    setTimeout(() => {
      this.profileState.completeProfile();
      this.submitting = false;
      this.router.navigate(['/business/customers']);
    }, 400);
  }
}

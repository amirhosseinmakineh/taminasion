import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OwnerAppLayoutComponent } from './owner-app-layout.component';
import { DashboardHomeComponent } from './pages/dashboard-home.component';
import { CustomersPageComponent } from './pages/customers-page.component';
import { StaffPageComponent } from './pages/staff-page.component';
import { FinancePageComponent } from './pages/finance-page.component';
import { VideoMarketingPageComponent } from './pages/video-marketing-page.component';
import { InventoryPageComponent } from './pages/inventory-page.component';
import { SettingsPageComponent } from './pages/settings-page.component';
import { OnboardingGuard } from '../../guards/onboarding.guard';

const routes: Routes = [
  {
    path: '',
    component: OwnerAppLayoutComponent,
    canActivate: [OnboardingGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardHomeComponent },
      { path: 'customers', component: CustomersPageComponent },
      { path: 'staff', component: StaffPageComponent },
      { path: 'finance', component: FinancePageComponent },
      { path: 'video-marketing', component: VideoMarketingPageComponent },
      { path: 'inventory', component: InventoryPageComponent },
      { path: 'settings', component: SettingsPageComponent },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    OwnerAppLayoutComponent,
    DashboardHomeComponent,
    CustomersPageComponent,
    StaffPageComponent,
    FinancePageComponent,
    VideoMarketingPageComponent,
    InventoryPageComponent,
    SettingsPageComponent,
  ],
})
export class OwnerAppModule {}

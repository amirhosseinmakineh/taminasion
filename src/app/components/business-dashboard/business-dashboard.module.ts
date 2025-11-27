import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BusinessDashboardRoutingModule } from './business-dashboard-routing.module';
import { BusinessDashboardLayoutComponent } from './layout/business-dashboard-layout.component';
import { BusinessProfileSetupComponent } from './pages/business-profile-setup/business-profile-setup.component';
import { CustomersPageComponent } from './pages/customers-page/customers-page.component';
import { EmployeesPageComponent } from './pages/employees-page/employees-page.component';
import { AccountingPageComponent } from './pages/accounting-page/accounting-page.component';
import { VideoMarketingPageComponent } from './pages/video-marketing-page/video-marketing-page.component';
import { EquipmentPageComponent } from './pages/equipment-page/equipment-page.component';

@NgModule({
  declarations: [
    BusinessDashboardLayoutComponent,
    BusinessProfileSetupComponent,
    CustomersPageComponent,
    EmployeesPageComponent,
    AccountingPageComponent,
    VideoMarketingPageComponent,
    EquipmentPageComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, BusinessDashboardRoutingModule]
})
export class BusinessDashboardModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessDashboardLayoutComponent } from './layout/business-dashboard-layout.component';
import { BusinessProfileSetupComponent } from './pages/business-profile-setup/business-profile-setup.component';
import { CustomersPageComponent } from './pages/customers-page/customers-page.component';
import { EmployeesPageComponent } from './pages/employees-page/employees-page.component';
import { AccountingPageComponent } from './pages/accounting-page/accounting-page.component';
import { VideoMarketingPageComponent } from './pages/video-marketing-page/video-marketing-page.component';
import { EquipmentPageComponent } from './pages/equipment-page/equipment-page.component';
import { BusinessProfileGuard } from './guards/business-profile.guard';

const routes: Routes = [
  {
    path: '',
    component: BusinessDashboardLayoutComponent,
    canActivate: [BusinessProfileGuard],
    canActivateChild: [BusinessProfileGuard],
    children: [
      { path: 'profile-setup', component: BusinessProfileSetupComponent },
      { path: 'customers', component: CustomersPageComponent },
      { path: 'employees', component: EmployeesPageComponent },
      { path: 'accounting', component: AccountingPageComponent },
      { path: 'video-marketing', component: VideoMarketingPageComponent },
      { path: 'equipment', component: EquipmentPageComponent },
      { path: '', pathMatch: 'full', redirectTo: 'profile-setup' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessDashboardRoutingModule {}

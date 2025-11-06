import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Import the standalone BusinessDashboardComponent
import { BusinessDashboardComponent } from '../business-dashboard/business-dashboard.component';
import { LayoutHeaderModule } from '../../shared/ui/layout-header/layout-header.module';

// Define routes for the component
const routes: Routes = [{ path: '', component: BusinessDashboardComponent }];

@NgModule({
  // BusinessDashboardComponent is imported but NOT declared
  imports: [
    CommonModule,
    LayoutHeaderModule,  // Import LayoutHeaderModule for the header
    RouterModule.forChild(routes),  // Configure routing
    BusinessDashboardComponent,  // Import standalone component here
  ],
})
export class BusinessDashboardModule {}

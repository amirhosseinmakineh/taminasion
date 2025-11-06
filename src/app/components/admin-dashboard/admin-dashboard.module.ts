import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';  // Import the standalone component
import { LayoutHeaderModule } from '../../shared/ui/layout-header/layout-header.module';

const routes: Routes = [{ path: '', component: AdminDashboardComponent }];

@NgModule({
  imports: [CommonModule, LayoutHeaderModule, RouterModule.forChild(routes), AdminDashboardComponent],  // Import it here
})
export class AdminDashboardModule {}

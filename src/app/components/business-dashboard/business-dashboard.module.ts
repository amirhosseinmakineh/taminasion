import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessDashboardComponent } from './business-dashboard.component';
import { LayoutHeaderModule } from '../../shared/ui/layout-header/layout-header.module';

const routes: Routes = [{ path: '', component: BusinessDashboardComponent }];

@NgModule({
  declarations: [BusinessDashboardComponent],
  imports: [CommonModule, LayoutHeaderModule, RouterModule.forChild(routes)],
})
export class BusinessDashboardModule {}

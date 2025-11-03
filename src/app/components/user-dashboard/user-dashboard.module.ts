import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UserDashboardComponent } from './user-dashboard.component';
import { LayoutHeaderModule } from '../../shared/ui/layout-header/layout-header.module';

const routes: Routes = [{ path: '', component: UserDashboardComponent }];

@NgModule({
  declarations: [UserDashboardComponent],
  imports: [CommonModule, LayoutHeaderModule, RouterModule.forChild(routes)],
})
export class UserDashboardModule {}

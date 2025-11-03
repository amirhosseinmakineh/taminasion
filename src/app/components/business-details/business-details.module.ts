import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { BusinessDetailsComponent } from './business-details.component';
import { LayoutHeaderModule } from '../../shared/ui/layout-header/layout-header.module';

const routes: Routes = [{ path: '', component: BusinessDetailsComponent }];

@NgModule({
  declarations: [BusinessDetailsComponent],
  imports: [CommonModule, ReactiveFormsModule, LayoutHeaderModule, RouterModule.forChild(routes)],
})
export class BusinessDetailsModule {}

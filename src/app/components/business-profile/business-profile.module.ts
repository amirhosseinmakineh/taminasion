import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { BusinessProfileComponent } from './business-profile.component';
import { LayoutHeaderModule } from '../../shared/ui/layout-header/layout-header.module';

const routes: Routes = [{ path: '', component: BusinessProfileComponent }];

@NgModule({
  declarations: [BusinessProfileComponent],
  imports: [CommonModule, ReactiveFormsModule, LayoutHeaderModule, RouterModule.forChild(routes)],
})
export class BusinessProfileModule {}

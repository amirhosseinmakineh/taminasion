import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessOwnerProfileComponent } from './business-owner-profile.component';

const routes: Routes = [{ path: '', component: BusinessOwnerProfileComponent }];

@NgModule({
  declarations: [BusinessOwnerProfileComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class BusinessOwnerProfileModule {}

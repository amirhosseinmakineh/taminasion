import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessProfileComponent } from './BusinessProfile.component';

const routes: Routes = [{ path: '', component: BusinessProfileComponent }];

@NgModule({
  declarations: [BusinessProfileComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class BusinessProfileModule {}

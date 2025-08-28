import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessDetailsComponent } from './BusinessDetails.component';

const routes: Routes = [{ path: '', component: BusinessDetailsComponent }];

@NgModule({
  declarations: [BusinessDetailsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class BusinessDetailsModule {}

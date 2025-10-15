import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BusinessSearchComponent } from './business-search.component';
import { LayoutHeaderModule } from '../../shared/ui/layout-header/layout-header.module';
import { LocationSelectorModule } from '../../shared/ui/location-selector/location-selector.module';
import { RateStarsPipe } from '../../shared/ui/pipes/rate-stars.pipe';

const routes: Routes = [{ path: '', component: BusinessSearchComponent }];

@NgModule({
  declarations: [BusinessSearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    RateStarsPipe,
    LayoutHeaderModule,
    LocationSelectorModule,
    RouterModule.forChild(routes),
  ]
})
export class BusinessSearchModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { BusinessSearchComponent } from './BusinessSearch.component';
import { RateStarsPipe } from '../../Shared/Ui/pips/rate-stars.pipe';

const routes: Routes = [{ path: '', component: BusinessSearchComponent }];

@NgModule({
  declarations: [BusinessSearchComponent],
  imports: [CommonModule, HttpClientModule, RateStarsPipe, RouterModule.forChild(routes)]
})
export class BusinessSearchModule {}

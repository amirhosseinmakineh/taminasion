import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BusinessSearchComponent } from './BusinessSearch.component';
import { RateStarsPipe } from '../../Shared/Ui/pips/rate-stars.pipe';

const routes: Routes = [{ path: '', component: BusinessSearchComponent }];

@NgModule({
  declarations: [BusinessSearchComponent],
  imports: [CommonModule, FormsModule, RateStarsPipe, RouterModule.forChild(routes)]
})
export class BusinessSearchModule {}

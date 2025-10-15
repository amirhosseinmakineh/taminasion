import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { LayoutHeaderModule } from '../../shared/ui/layout-header/layout-header.module';
import { LocationSelectorModule } from '../../shared/ui/location-selector/location-selector.module';

import { MainPageComponent } from './main-page.component';

const routes: Routes = [{ path: '', component: MainPageComponent }];

@NgModule({
  declarations: [MainPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    LayoutHeaderModule,
    LocationSelectorModule,
  ],
  exports: [MainPageComponent]
})
export class MainPageModule {}

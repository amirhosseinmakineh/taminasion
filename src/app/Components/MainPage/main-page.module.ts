import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './MainPage.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [{ path: '', component: MainPageComponent }];

@NgModule({
  declarations: [MainPageComponent],
  imports: [CommonModule, FormsModule, SharedModule, RouterModule.forChild(routes)],
  exports: [MainPageComponent]
})
export class MainPageModule {}

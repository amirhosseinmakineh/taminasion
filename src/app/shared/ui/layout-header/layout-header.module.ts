import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LayoutHeaderComponent } from './layout-header.component';

@NgModule({
  declarations: [LayoutHeaderComponent],
  imports: [CommonModule, RouterModule],
  exports: [LayoutHeaderComponent],
})
export class LayoutHeaderModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LocationSelectorComponent } from './location-selector.component';

@NgModule({
  declarations: [LocationSelectorComponent],
  imports: [CommonModule, FormsModule],
  exports: [LocationSelectorComponent],
})
export class LocationSelectorModule {}

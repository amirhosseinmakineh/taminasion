import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RateStarsPipe } from './ui/pips/RateStars.pip';

@NgModule({
  declarations: [],
  imports: [CommonModule, RateStarsPipe],
  exports: [CommonModule, RateStarsPipe]
})
export class SharedModule {}

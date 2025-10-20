import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FeedbackMessageComponent } from './feedback-message.component';

@NgModule({
  declarations: [FeedbackMessageComponent],
  imports: [CommonModule],
  exports: [FeedbackMessageComponent],
})
export class FeedbackMessageModule {}

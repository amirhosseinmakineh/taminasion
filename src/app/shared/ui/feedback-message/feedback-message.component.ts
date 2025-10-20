import { Component, EventEmitter, Input, Output } from '@angular/core';

type FeedbackType = 'success' | 'error' | 'info';

@Component({
  selector: 'app-feedback-message',
  templateUrl: './feedback-message.component.html',
  styleUrls: ['./feedback-message.component.css'],
  standalone: false,
})
export class FeedbackMessageComponent {
  @Input() type: FeedbackType = 'info';
  @Input() message = '';
  @Input() dismissible = true;

  @Output() closed = new EventEmitter<void>();

  get icon(): string {
    switch (this.type) {
      case 'success':
        return '✔';
      case 'error':
        return '✖';
      default:
        return 'ℹ';
    }
  }

  onClose(): void {
    this.closed.emit();
  }
}

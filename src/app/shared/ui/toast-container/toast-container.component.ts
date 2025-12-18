import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';

import { ToastMessage, ToastService } from '../../services/toast.service';

interface ActiveToast extends ToastMessage {
  timeout?: Subscription;
}

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.css'],
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: ActiveToast[] = [];
  private subscription?: Subscription;

  constructor(private readonly toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toasts$.subscribe(toast => {
      const timeout = timer(4000).subscribe(() => this.dismiss(toast.id));
      this.toasts = [...this.toasts, { ...toast, timeout }];
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.toasts.forEach(t => t.timeout?.unsubscribe());
  }

  dismiss(id: number): void {
    const toast = this.toasts.find(t => t.id === id);
    toast?.timeout?.unsubscribe();
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}

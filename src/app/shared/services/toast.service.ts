import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';
export interface ToastMessage {
  type: ToastType;
  text: string;
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSubject = new Subject<ToastMessage>();
  private counter = 0;

  get toasts$(): Observable<ToastMessage> {
    return this.toastsSubject.asObservable();
  }

  success(text: string): void {
    this.publish('success', text);
  }

  error(text: string): void {
    this.publish('error', text);
  }

  info(text: string): void {
    this.publish('info', text);
  }

  private publish(type: ToastType, text: string): void {
    const trimmed = text?.trim();
    if (!trimmed) {
      return;
    }

    this.toastsSubject.next({ type, text: trimmed, id: ++this.counter });
  }
}

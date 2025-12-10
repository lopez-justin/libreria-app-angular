import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Toast {
  id?: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  icon?: string;
}

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-toast.html',
  styleUrl: './notification-toast.css'
})
export class NotificationToast {
  @Input() position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';
  @Input() maxToasts: number = 3;
  @Input() autoCloseDelay: number = 5000;
  
  @Output() toastClosed = new EventEmitter<Toast>();

  toasts: Toast[] = [];
  private toastIdCounter = 0;

  show(toast: Toast): number {
    const newToast: Toast = {
      ...toast,
      id: ++this.toastIdCounter,
      duration: toast.duration ?? this.autoCloseDelay
    };

    if (this.toasts.length >= this.maxToasts) {
      this.remove(this.toasts[0].id!);
    }

    this.toasts.push(newToast);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.remove(newToast.id!);
      }, newToast.duration);
    }

    return newToast.id!;
  }

  success(title: string, message: string, duration?: number): number {
    return this.show({
      type: 'success',
      title,
      message,
      duration,
      icon: 'bi-check-circle-fill'
    });
  }

  error(title: string, message: string, duration?: number): number {
    return this.show({
      type: 'error',
      title,
      message,
      duration,
      icon: 'bi-exclamation-circle-fill'
    });
  }

  warning(title: string, message: string, duration?: number): number {
    return this.show({
      type: 'warning',
      title,
      message,
      duration,
      icon: 'bi-exclamation-triangle-fill'
    });
  }

  info(title: string, message: string, duration?: number): number {
    return this.show({
      type: 'info',
      title,
      message,
      duration,
      icon: 'bi-info-circle-fill'
    });
  }

  remove(toastId: number): void {
    const toast = this.toasts.find(t => t.id === toastId);
    if (toast) {
      this.toastClosed.emit(toast);
    }
    this.toasts = this.toasts.filter(t => t.id !== toastId);
  }

  clearAll(): void {
    this.toasts.forEach(toast => {
      this.toastClosed.emit(toast);
    });
    this.toasts = [];
  }

  getToastClass(toast: Toast): string {
    return `toast-${toast.type}`;
  }

  getIconClass(toast: Toast): string {
    return toast.icon || this.getDefaultIcon(toast.type);
  }

  private getDefaultIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'success': 'bi-check-circle-fill',
      'error': 'bi-exclamation-circle-fill',
      'warning': 'bi-exclamation-triangle-fill',
      'info': 'bi-info-circle-fill'
    };
    return icons[type] || 'bi-info-circle-fill';
  }

  getPositionClass(): string {
    return `position-${this.position}`;
  }
}
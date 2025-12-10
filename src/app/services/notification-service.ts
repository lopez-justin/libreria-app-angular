import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notifications$ = this.notificationSubject.asObservable();

  // Métodos para mostrar notificaciones
  success(title: string, message: string, duration?: number): void {
    this.notificationSubject.next({
      type: 'success',
      title,
      message,
      duration: duration || 5000
    });
  }

  error(title: string, message: string, duration?: number): void {
    this.notificationSubject.next({
      type: 'error',
      title,
      message,
      duration: duration || 5000
    });
  }

  warning(title: string, message: string, duration?: number): void {
    this.notificationSubject.next({
      type: 'warning',
      title,
      message,
      duration: duration || 5000
    });
  }

  info(title: string, message: string, duration?: number): void {
    this.notificationSubject.next({
      type: 'info',
      title,
      message,
      duration: duration || 5000
    });
  }
}
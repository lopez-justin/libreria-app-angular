import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css'
})
export class ConfirmModalComponent {
  @Input() title: string = 'Confirmar acción';
  @Input() message: string = '¿Estás seguro de que quieres realizar esta acción?';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Input() type: 'danger' | 'warning' | 'info' | 'success' = 'info';
  @Input() visible: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  get modalClass(): string {
    return `modal-${this.type}`;
  }

  get confirmButtonClass(): string {
    const baseClass = 'btn-modern';
    switch (this.type) {
      case 'danger': return `${baseClass} btn-danger`;
      case 'warning': return `${baseClass} btn-warning`;
      case 'success': return `${baseClass} btn-success`;
      default: return `${baseClass} btn-primary`;
    }
  }

  onConfirm(): void {
    this.confirm.emit();
    this.close();
  }

  onCancel(): void {
    this.cancel.emit();
    this.close();
  }

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  getIconClass(): string {
  switch (this.type) {
    case 'danger': return 'bi bi-exclamation-triangle-fill';
    case 'warning': return 'bi bi-exclamation-circle-fill';
    case 'success': return 'bi bi-check-circle-fill';
    default: return 'bi bi-info-circle-fill';
  }
}
}
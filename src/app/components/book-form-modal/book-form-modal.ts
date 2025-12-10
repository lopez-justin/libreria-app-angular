import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookForm } from '../book-form/book-form';

@Component({
  selector: 'app-book-form-modal',
  standalone: true,
  imports: [CommonModule, BookForm],
  templateUrl: './book-form-modal.html',
  styleUrl: './book-form-modal.css'
})
export class BookFormModal {
  @Output() close = new EventEmitter<void>();
  visible: boolean = true;

  onClose(): void {
    this.visible = false;
    this.close.emit();
  }

  onBookCreated(): void {
    this.onClose();
  }

  onFormCanceled(): void {
    this.onClose();
  }
}
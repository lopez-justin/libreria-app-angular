import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book } from '../../../models/book';

@Component({
  selector: 'app-edit-book-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-book-modal.html',
  styleUrls: ['./edit-book-modal.css']
})
export class EditBookModalComponent {
  @Input() book: Book | null = null;
  @Input() isVisible: boolean = false;
  @Output() saveBook = new EventEmitter<Book>();
  @Output() closeModal = new EventEmitter<void>();

  editedBook: Book | null = null;

  conditions = [
    { value: 'excelente', label: 'Excelente' },
    { value: 'bueno', label: 'Bueno' },
    { value: 'regular', label: 'Regular' },
    { value: 'malo', label: 'Malo' }
  ];

  types = [
    { value: 'venta', label: 'Venta' },
    { value: 'donacion', label: 'Donación' }
  ];

  categories = [
    { id: 1, name: 'Literatura' },
    { id: 2, name: 'Infantil' },
    { id: 3, name: 'Ciencia Ficción' },
    { id: 4, name: 'Autoayuda' }
  ];

  ngOnChanges(): void {
    if (this.book && this.isVisible) {
      this.editedBook = { ...this.book };
    }
  }

  onSave(): void {
    if (this.editedBook) {
      this.saveBook.emit(this.editedBook);
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  isValid(): boolean {
    if (!this.editedBook) return false;
    
    return !!this.editedBook.title?.trim() && 
           !!this.editedBook.author?.trim() &&
           !!this.editedBook.isbn?.trim() &&
           !!this.editedBook.description?.trim() &&
           !!this.editedBook.location?.trim() &&
           (this.editedBook.type === 'donacion' || 
            (this.editedBook.type === 'venta' && this.editedBook.price! > 0));
  }

  onTypeChange(): void {
    if (this.editedBook?.type === 'donacion') {
      this.editedBook.price = undefined;
    }
  }
}
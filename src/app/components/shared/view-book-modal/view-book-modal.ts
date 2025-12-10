import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../models/book';

@Component({
  selector: 'app-view-book-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-book-modal.html',
  styleUrls: ['./view-book-modal.css']
})
export class ViewBookModalComponent {
  @Input() book: Book | null = null;
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<unknown>();

  closeBookModal(): void {
    this.isVisible = false;
  }

  showPrice(): boolean {
    return this.book?.type === 'venta' && !!this.book?.price;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES');
  }

  getConditionText(condition: string): string {
    const conditions: {[key: string]: string} = {
      'excelente': 'Excelente',
      'bueno': 'Bueno',
      'regular': 'Regular',
      'malo': 'Malo'
    };
    return conditions[condition] || condition;
  }

  getTypeText(type: string): string {
    return type === 'venta' ? 'Venta' : 'Donación';
  }
}

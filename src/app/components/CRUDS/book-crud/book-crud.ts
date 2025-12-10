import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Book } from '../../../models/book';
import { BookService } from '../../../services/book-service';
import { DataTable, ColumnConfig } from '../../shared/data-table/data-table';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal';
import { ViewBookModalComponent } from '../../shared/view-book-modal/view-book-modal';
import { EditBookModalComponent } from '../../shared/edit-book-modal/edit-book-modal';

@Component({
  selector: 'app-book-crud',
  standalone: true,
  imports: [
    CommonModule, 
    DataTable, 
    ConfirmModalComponent,
    ViewBookModalComponent,
    EditBookModalComponent
  ],
  templateUrl: './book-crud.html',
  styleUrl: './book-crud.css'
})
export class BookCrud implements OnInit {
  books: Book[] = [];
  selectedBook: Book | null = null;
  bookToDelete: Book | null = null;
  
  showViewModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  
  loading: boolean = false;

  columns: ColumnConfig[] = [
    { 
      key: 'imageUrl', 
      header: 'Portada', 
      type: 'image',
      width: '100px'
    },
    { 
      key: 'title', 
      header: 'Título', 
      sortable: true,
      width: '250px'
    },
    { 
      key: 'author', 
      header: 'Autor', 
      sortable: true 
    },
    { 
      key: 'type', 
      header: 'Tipo', 
      sortable: true,
      type: 'badge',
      format: (value: string) => value === 'venta' ? 'Venta' : 'Donación'
    },
    { 
      key: 'price', 
      header: 'Precio', 
      sortable: true,
      type: 'number',
      format: (value: number) => {
        if (value === null || value === undefined || value === 0) return 'Gratis';
        return `$${value.toLocaleString('es-ES')}`;
      }
    },
    { 
      key: 'condition', 
      header: 'Condición', 
      sortable: true,
      type: 'badge',
      format: (value: string) => {
        const conditions: { [key: string]: string } = {
          'excelente': 'Excelente',
          'bueno': 'Bueno',
          'regular': 'Regular',
          'malo': 'Malo'
        };
        return conditions[value] || value;
      }
    },
    { 
      key: 'active', 
      header: 'Estado', 
      sortable: true,
      type: 'badge',
      format: (value: boolean) => value ? 'Activo' : 'Inactivo'
    }
  ];

  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks().subscribe({
      next: (data: Book[]) => {
        this.books = data.map(book => ({
          ...book,
          typeClass: this.getTypeClass(book.type),
          conditionClass: this.getConditionClass(book.condition),
          activeClass: this.getActiveClass(book.active)
        }));
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading books:', error);
        this.loading = false;
        alert('Error al cargar los libros. Por favor, intente nuevamente.');
      }
    });
  }

  getTypeClass(type: string): string {
    return type === 'venta' ? 'bg-primary' : 'bg-success';
  }

  getConditionClass(condition: string): string {
    const conditionClasses: { [key: string]: string } = {
      'excelente': 'bg-success',
      'bueno': 'bg-info',
      'regular': 'bg-warning',
      'malo': 'bg-danger'
    };
    return conditionClasses[condition] || 'bg-secondary';
  }

  getActiveClass(active: boolean): string {
    return active ? 'bg-success' : 'bg-danger';
  }

  onViewDetails(book: Book): void {
    console.log('Ver libro:', book);
    this.selectedBook = book;
    this.showViewModal = true;
  }

  onEditBook(book: Book): void {
    console.log('Editar libro:', book);
    this.selectedBook = { ...book };
    this.showEditModal = true;
  }

  onDeleteBook(book: Book): void {
    console.log('Eliminar libro:', book);
    this.bookToDelete = book;
    this.showDeleteModal = true;
  }

  openNewBook(): void {
    this.router.navigate(['/book-form']);
  }

  onSaveBook(updatedBook: Book): void {
    if (!updatedBook.id) {
      alert('Error: El libro no tiene ID');
      return;
    }

    this.bookService.updateBook(updatedBook).subscribe({
      next: () => {
        this.loadBooks();
        this.closeEditModal();
        alert('¡Libro actualizado exitosamente!');
      },
      error: (error: any) => {
        console.error('Error al actualizar libro:', error);
        alert('Error al actualizar el libro. Por favor, intente nuevamente.');
      }
    });
  }

  confirmDelete(): void {
  if (this.bookToDelete && this.bookToDelete.id) {
    const bookTitle = this.bookToDelete.title;
    
    const id = this.bookToDelete.id;
    
    console.log('Eliminando con ID:', id, 'Tipo:', typeof id);
    
    this.bookService.deleteBook(id).subscribe({
      next: () => {
        this.loadBooks();
        this.closeDeleteModal();
        alert(`"${bookTitle}" eliminado correctamente`);
      },
      error: (error: any) => {
        console.error('Error deleting book:', error);
        
        if (error.status) {
          console.error('Status:', error.status);
          console.error('Error body:', error.error);
        }
        
        alert('Error al eliminar el libro. Por favor, intente nuevamente.');
      }
    });
  }
}

  cancelModal(): void {
    this.closeDeleteModal();
  }

  closeViewModal(): void {
    this.showViewModal = false;
    setTimeout(() => {
      this.selectedBook = null;
    }, 300);
  }

  closeEditModal(): void {
    this.showEditModal = false;
    setTimeout(() => {
      this.selectedBook = null;
    }, 300);
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    setTimeout(() => {
      this.bookToDelete = null;
    }, 300);
  }
}
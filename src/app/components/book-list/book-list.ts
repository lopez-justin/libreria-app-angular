import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Book } from '../../models/book';
import { User } from '../../models/user';
import { BookService } from '../../services/book-service';
import { BookCardComponent } from '../shared/book-card/book-card';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal';
import { BookFormModal } from '../book-form-modal/book-form-modal';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, BookCardComponent, ConfirmModalComponent, BookFormModal, RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css'
})
export class BookList implements OnInit {
  books: Book[] = [];
  users: User[] = [];
  filteredBooks: Book[] = [];
  selectedBook: Book | null = null;
  
  showDeleteModal: boolean = false;
  showContactModal: boolean = false;
  showNewBookModal: boolean = false;

  constructor(
    private BookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.BookService.getActiveBooks().subscribe({
      next: (data: Book[]) => {
        this.books = data;
        this.filteredBooks = data;
      },
      error: (error: any) => {
        console.error('Error loading books:', error);
      }
    });
  }

  getUserById(userId: number): User | undefined {
    return this.users.find(user => user.id === userId);
  }

  onViewDetails(book: Book): void {
    if (book.id) {
      this.router.navigate(['/book-details', book.id]);
    }
  }

  onAddToWishlist(book: Book): void {
    console.log('Agregado a favoritos:', book.title);
  }

  onRemoveFromWishlist(book: Book): void {
    console.log('Removido de favoritos:', book.title);
  }

  onDeleteBook(book: Book): void {
    this.selectedBook = book;
    this.showDeleteModal = true;
  }

  openNewBookModal(): void {
    this.showNewBookModal = true;
  }

  closeNewBookModal(): void {
    this.showNewBookModal = false;
    this.loadBooks();
  }

  confirmDelete(): void {
    if (this.selectedBook) {
      console.log('Eliminando libro:', this.selectedBook);
      alert(`"${this.selectedBook.title}" eliminado correctamente`);
      this.showDeleteModal = false;
      this.selectedBook = null;
      this.loadBooks();
    }
  }


  cancelModal(): void {
    this.showDeleteModal = false;
    this.showContactModal = false;
    this.selectedBook = null;
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Book } from '../../../models/book';
import { FavoritesServiceService } from '../../../services/favorites-service';
import { BookCardComponent } from '../../shared/book-card/book-card';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, BookCardComponent, ConfirmModalComponent],
  templateUrl: './favorite-crud.html',
  styleUrl: './favorite-crud.css'
})
export class Favorites implements OnInit {
  favoriteBooks: Book[] = [];
  showClearModal: boolean = false;

  constructor(
    private favoritesService: FavoritesServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoriteBooks = this.favoritesService.getFavorites();
  }

  get favoritesCount(): number {
    return this.favoriteBooks.length;
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
    this.favoriteBooks = this.favoriteBooks.filter(fav => fav.id !== book.id);
  }

  onClearFavorites(): void {
    this.showClearModal = true;
  }

  confirmClearFavorites(): void {
    this.favoritesService.clearFavorites();
    this.favoriteBooks = [];
    this.showClearModal = false;
    alert('Todos los favoritos han sido eliminados');
  }

  cancelClearFavorites(): void {
    this.showClearModal = false;
  }

  onBackToCatalog(): void {
    this.router.navigate(['/book-list']);
  }
}
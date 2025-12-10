import { Injectable } from '@angular/core';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class FavoritesServiceService {
  private storageKey = 'library_favorites';

  constructor() { }

  getFavorites(): Book[] {
    const favoritesJson = localStorage.getItem(this.storageKey);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  }

  addToFavorites(book: Book): void {
    const favorites = this.getFavorites();
    
    if (!favorites.some(fav => fav.id === book.id)) {
      favorites.push(book);
      localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    }
  }

  removeFromFavorites(bookId: number): void {
    const favorites = this.getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== bookId);
    localStorage.setItem(this.storageKey, JSON.stringify(updatedFavorites));
  }

  isFavorite(bookId: number): boolean {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.id === bookId);
  }

  getFavoritesCount(): number {
    return this.getFavorites().length;
  }

  clearFavorites(): void {
    localStorage.removeItem(this.storageKey);
  }
}
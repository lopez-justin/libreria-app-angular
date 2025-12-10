import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../models/book';
import { User } from '../../../models/user';
import { FavoritesServiceService } from '../../../services/favorites-service';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css'
})
export class BookCardComponent implements OnInit {
  @Input() book!: Book;
  @Input() user?: User;
  @Input() showActions: boolean = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showFavoriteIndicator: boolean = true;
  
  @Output() viewDetails = new EventEmitter<Book>();
  @Output() addToWishlist = new EventEmitter<Book>();
  @Output() removeFromWishlist = new EventEmitter<Book>();

  isFavorite: boolean = false;

  constructor(private favoritesService: FavoritesServiceService) {}

  ngOnInit(): void {
    this.checkIfFavorite();
  }

  checkIfFavorite(): void {
    if (this.book.id) {
      this.isFavorite = this.favoritesService.isFavorite(this.book.id);
    }
  }

  get conditionClass(): string {
    const conditionClasses: { [key: string]: string } = {
      'excelente': 'condition-excellent',
      'bueno': 'condition-good',
      'regular': 'condition-regular',
      'malo': 'condition-bad'
    };
    return conditionClasses[this.book.condition] || 'condition-regular';
  }

  get priceDisplay(): string {
    if (this.book.type === 'donacion') {
      return 'Gratis';
    }
    return `$${this.book.price?.toLocaleString()}`;
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.book);
  }


  onToggleFavorite(): void {
  if (this.book.id) {
    if (this.isFavorite) {
      this.favoritesService.removeFromFavorites(this.book.id);
      this.removeFromWishlist.emit(this.book); 
    } else {
      this.favoritesService.addToFavorites(this.book);
      this.addToWishlist.emit(this.book); 
    }
    this.isFavorite = !this.isFavorite;
  }
}

  get favoriteButtonClass(): string {
    return this.isFavorite ? 'btn-danger' : 'btn-outline-secondary';
  }

  get favoriteIconClass(): string {
    return this.isFavorite ? 'bi-heart-fill' : 'bi-heart';
  }
}
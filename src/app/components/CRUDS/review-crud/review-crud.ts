import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Review } from '../../../models/review';
import { ReviewService } from '../../../services/review-service';

@Component({
  selector: 'app-review-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, DecimalPipe],
  templateUrl: './review-crud.html',
  styleUrl: './review-crud.css'
})
export class ReviewCrud implements OnChanges {

  @Input() bookId: number | null = null;

  reviews: Review[] = [];
  loading = false;

  newReview: Review = {
    id: undefined,
    bookId: 0,
    userId: 1,
    rating: 1,
    comment: '',
    createdAt: '',
    active: true
  };

  constructor(private reviewService: ReviewService) {}

  ngOnChanges(): void {
    if (this.bookId) {
      this.newReview.bookId = this.bookId;
      this.loadReviews();
    }
  }

  loadReviews(): void {
    if (!this.bookId) return;

    this.loading = true;

    this.reviewService.getReviewsByBook(this.bookId).subscribe({
      next: (data: Review[]) => {
        this.reviews = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('⚠ Error cargando reseñas');
      }
    });
  }

  addReview(): void {
    if (!this.bookId) return;

    if (!this.newReview.comment.trim()) {
      alert('⚠ El comentario no puede estar vacío');
      return;
    }

    this.newReview.bookId = this.bookId;
    this.newReview.createdAt = new Date().toISOString();

    this.reviewService.createReview(this.newReview).subscribe({
      next: (created: Review) => {
        this.reviews.push(created);

        this.newReview = {
          id: undefined,
          bookId: this.bookId!,
          userId: 1,
          rating: 1,
          comment: '',
          createdAt: '',
          active: true
        };
      },
      error: () => alert('⚠ Error al agregar reseña')
    });
  }

  deleteReview(id: number | undefined): void {
    if (!id) return;

    if (!confirm('¿Eliminar esta reseña?')) return;

    this.reviewService.deleteReview(id).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== id);
      },
      error: () => alert('⚠ Error eliminando reseña')
    });
  }
}

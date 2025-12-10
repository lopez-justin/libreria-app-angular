import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Book } from '../../models/book';
import { Category } from '../../models/category';
import { BookService } from '../../services/book-service';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal';
import {CategoryService} from '../../services/category-service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css'
})
export class BookForm implements OnInit {
  @Output() bookCreated = new EventEmitter<void>();
  @Output() formCanceled = new EventEmitter<void>();
  @Input() isModal: boolean = false;
  bookForm!: FormGroup;
  categories: Category[] = [];
  loading: boolean = false;
  showCancelModal: boolean = false;

  // Opciones para los selects
  conditions = [
    { value: 'excelente', label: 'Excelente - Como nuevo' },
    { value: 'bueno', label: 'Bueno - Leves señales de uso' },
    { value: 'regular', label: 'Regular - Marcas visibles' },
    { value: 'malo', label: 'Malo - Desgastado pero usable' }
  ];

  // TIPOS como radio buttons (NO como array de objetos)
  // Estos son para el template HTML
  typeOptions = [
    { value: 'donacion', label: 'Donación', icon: 'bi-gift', color: 'success' },
    { value: 'venta', label: 'En Venta', icon: 'bi-cash-coin', color: 'primary' }
  ];

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      author: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]+$/)]],
      categoryId: ['', Validators.required],
      condition: ['', Validators.required],
      type: ['donacion', Validators.required], // ← Valor por defecto: 'donacion'
      price: [null],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      imageUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      location: ['', [Validators.required, Validators.minLength(3)]],
      active: [true]
    });

    this.bookForm.get('type')?.valueChanges.subscribe(type => {
      this.onTypeChange(type);
    });

    this.onTypeChange(this.bookForm.get('type')?.value);
  }

  onTypeChange(type: string): void {
    const priceControl = this.bookForm.get('price');

    if (type === 'venta') {
      // Para venta:
      priceControl?.enable();
      priceControl?.setValidators([Validators.required, Validators.min(1), Validators.max(1000)]);
    } else {
      // Para donación:
      priceControl?.disable();
      priceControl?.clearValidators();
      priceControl?.setValue(null);
    }

    priceControl?.updateValueAndValidity();
  }

  // load categories from service
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
        alert('Error al cargar las categorías. Intenta nuevamente.');
      }
    });
  }

  get f() { return this.bookForm.controls; }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;

    const formData: Book = {
      ...this.bookForm.value,
      userId: 1,
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.bookService.createBook(formData).subscribe({
      next: (book: Book) => {
        this.loading = false;
        alert(`¡Libro "${book.title}" agregado exitosamente!`);
        this.bookCreated.emit();
        if (!this.router) {
          this.bookForm.reset({ type: 'donacion' });
        } else {
          this.router.navigate(['/book-list']);
        }
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Error creating book:', error);
        alert('Error al agregar el libro. Intenta nuevamente.');
      }
    });
  }

  onCancel(): void {
    if (this.bookForm.dirty && !this.isModal) {
      this.showCancelModal = true;
    } else {
      this.cancelForm();
    }
  }

  confirmCancel(): void {
    this.formCanceled.emit();
    this.showCancelModal = false;
    if (this.router) {
      this.router.navigate(['/book-list']);
    }
  }

  cancelCancel(): void {
    this.showCancelModal = false;
  }

  cancelForm(): void {
    this.formCanceled.emit();
    if (this.router) {
      this.router.navigate(['/book-list']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.bookForm.controls).forEach(key => {
      const control = this.bookForm.get(key);
      control?.markAsTouched();
    });
  }

  get imagePreview(): string {
    return this.bookForm.get('imageUrl')?.value || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400';
  }

  isTypeSelected(typeValue: string): boolean {
    return this.bookForm.get('type')?.value === typeValue;
  }
}

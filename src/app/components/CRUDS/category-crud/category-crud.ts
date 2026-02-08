import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category-service';
import { Category } from '../../../models/category';
import { BookService } from '../../../services/book-service';
import { Book } from '../../../models/book';

@Component({
  selector: 'app-category-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './category-crud.html',
  styleUrls: ['./category-crud.css']
})
export class CategoryCrud {
  categories: Category[] = [];
  books: Book[] = [];
  searchTerm: string = '';

  // Formularios reactivos
  categoryForm: FormGroup;
  editForm: FormGroup;

  // Modal states
  showCreateModal = false;
  showEditModal = false;
  showBooks = false;

  editingCategory?: Category;

  constructor(
    private categoryService: CategoryService,
    private bookService: BookService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],

    });

    this.editForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],

    });

    this.loadCategories();
  }

  get filteredCategories(): Category[] {
    return this.searchTerm
      ? this.categories.filter(c =>
          c.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      : this.categories;
  }

  private findCategoryOnServer(id: number | undefined): Promise<Category | undefined> {
  // devuelve la categoría tal cual la tiene el servidor (o undefined)
  return new Promise((resolve) => {
    this.categoryService.getCategories().subscribe({
      next: (list) => {
        const found = list.find(c => String(c.id) === String(id));
        resolve(found);
      },
      error: () => resolve(undefined)
    });
  });
}

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => alert('Error cargando categorías: ' + err.message)
    });
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.categoryForm.reset({ icon: 'book', active: true });
  }

  createCategory(): void {
    if (this.categoryForm.valid) {
      const newCategory: Category = this.categoryForm.value;
      this.categoryService.createCategory(newCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.closeCreateModal();
        },
        error: (err: any) => alert('Error creando categoría: ' + err.message)
      });
    }
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.editForm.patchValue(category);
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingCategory = undefined;
  }

async saveEdit(): Promise<void> {
  if (this.editForm.valid && this.editingCategory) {
    // buscar la categoría en el servidor para obtener su id
    const serverCat = await this.findCategoryOnServer(this.editingCategory.id);
    if (!serverCat) {
      alert('No se encontró la categoría en el servidor. No se pudo actualizar.');
      return;
    }

    const updated: Category = {
      ...serverCat, // empezamos desde lo que devolvió el servidor
      ...this.editForm.value
    };

    //usamos el id tal cual lo devolvió el servidor
    this.categoryService.updateCategory((serverCat as any).id, updated).subscribe({
      next: () => {
        this.loadCategories();
        this.closeEditModal();
      },
      error: (err: any) => alert('Error editando categoría: ' + err.message)
    });
  }
}



  deleteCategory(category: Category): void {
  if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) return;

  // encontrar la categoría en el servidor primero
  this.categoryService.getCategories().subscribe({
    next: (list) => {
      const found = list.find(c => String(c.id) === String(category.id));
      if (!found) {
        alert('No se encontró la categoría en el servidor. No se pudo eliminar.');
        return;
      }

      this.categoryService.deleteCategory((found as any).id).subscribe({
        next: () => this.loadCategories(),
        error: (err: any) => alert('Error eliminando categoría: ' + err.message)
      });
    },
    error: (err: any) => alert('Error verificando categoría en el servidor: ' + err.message)
  });
}

viewBooks(category: Category): void {
  this.bookService.getBooks().subscribe({
    next: (allBooks) => {
      this.books = allBooks.filter(b => String(b.categoryId) === String(category.id));
      this.showBooks = true;
    },
    error: (err: any) => alert('Error cargando libros: ' + err.message)
  });
}

  closeBooks(): void {
    this.showBooks = false;
    this.books = [];
  }
}



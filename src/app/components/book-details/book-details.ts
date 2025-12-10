import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Book} from '../../models/book';
import {Transaction} from '../../models/transaction';
import {BookService} from '../../services/book-service';
import {TransactionService} from '../../services/transaction-service';

// Importar el crud de las reseñas o review
import {ReviewCrud} from '../CRUDS/review-crud/review-crud';

@Component({
  selector: 'app-book-details',
  standalone: true,

  // ReviewCrud
  imports: [
    CommonModule,
    ReviewCrud
  ],

  templateUrl: './book-details.html',
  styleUrl: './book-details.css'
})
export class BookDetails implements OnInit {

  // DATOS DEL LIBRO
  book: Book | null = null;

  // ESTADOS DE CARGA Y ERRORES
  loading: boolean = true;
  showContactModal: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    console.log('BookDetails iniciado');

    // Obtiene el ID del libro desde la URL
    this.route.params.subscribe(params => {
      console.log('Params recibidos:', params);

      const bookIdStr = params['id'];
      console.log('ID string:', bookIdStr);

      if (bookIdStr) {
        const bookId = parseInt(bookIdStr, 10);
        console.log('📖 ID convertido a number:', bookId);

        if (isNaN(bookId)) {
          this.errorMessage = 'ID de libro inválido';
          this.loading = false;
          return;
        }

        this.loadBookDetails(bookId);
      } else {
        this.errorMessage = 'No se encontró ID de libro en la URL';
        this.loading = false;
      }
    });
  }

  // Llama a BookService para obtener los detalles del libro
  loadBookDetails(bookId: number): void {
    console.log('Cargando libro ID:', bookId);

    this.loading = true;
    this.errorMessage = '';

    this.bookService.getBookById(bookId).subscribe({
      next: (book: Book) => {
        console.log('Libro cargado:', book);
        this.book = book;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando libro:', error);

        if (error.status === 404) {
          this.errorMessage = 'El libro no fue encontrado';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifica que json-server esté corriendo en puerto 3000';
        } else {
          this.errorMessage = 'Error al cargar el libro';
        }

        this.loading = false;
      }
    });
  }

  // Traduce valores de condición del libro a texto legible
  getConditionText(condition: string): string {
    const conditions: { [key: string]: string } = {
      'excelente': 'Excelente - Como nuevo',
      'bueno': 'Bueno - Leves señales de uso',
      'regular': 'Regular - Marcas visibles pero legible',
      'malo': 'Malo - Desgastado pero usable'
    };
    return conditions[condition] || condition;
  }

  // Devuelve clases CSS para etiqueta visual de la condición del libro
  getConditionClass(condition: string): string {
    const conditionClasses: { [key: string]: string } = {
      'excelente': 'bg-success text-white',
      'bueno': 'bg-info text-white',
      'regular': 'bg-warning text-dark',
      'malo': 'bg-danger text-white'
    };
    return conditionClasses[condition] || 'bg-secondary text-white';
  }

  // Agregar a favoritos (pendiente implementación real)
  onAddToFavorites(): void {
    if (this.book) {
      alert(`"${this.book.title}" agregado a favoritos`);
      // Aquí integrar con el componente de Favoritos
    }
  }

  // CREATE - Crear transacción cuando el usuario solicita libro
  onRequestBook(): void {
    if (!this.book) return;

    // Simulamos un usuario solicitante (en un caso real vendría de autenticación)
    const currentUserId = 2; // Usuario actual que solicita
    const currentUserName = 'Carlos Rodríguez';

    // Obtener datos del propietario (simplificado - en producción se consultaría el servicio de usuarios)
    const ownerNames: { [key: number]: string } = {
      1: 'María González',
      2: 'Carlos Rodríguez',
      3: 'Ana Martínez',
      4: 'David López'
    };

    const newTransaction: Transaction = {
      bookId: Number(this.book.id),
      bookTitle: this.book.title,
      bookImageUrl: this.book.imageUrl,
      requesterId: currentUserId,
      requesterName: currentUserName,
      ownerId: this.book.userId,
      ownerName: ownerNames[this.book.userId] || 'Usuario',
      type: this.book.type,
      price: this.book.price,
      status: 'pendiente',
      requestDate: new Date().toISOString().split('T')[0],
      message: `Solicitud para ${this.book.type === 'venta' ? 'comprar' : 'recibir como donación'} el libro "${this.book.title}"`
    };

    this.transactionService.createTransaction(newTransaction).subscribe({
      next: (transaction) => {
        console.log('Transacción creada:', transaction);
        alert(`¡Solicitud enviada! Se ha creado una solicitud para "${this.book?.title}". El propietario revisará tu petición.`);
      },
      error: (error) => {
        console.error('Error al crear transacción:', error);
        alert('Error al enviar la solicitud. Intenta nuevamente.');
      }
    });
  }

  // Regresa a la lista de libros
  onBack(): void {
    this.router.navigate(['/book-list']);
  }
}

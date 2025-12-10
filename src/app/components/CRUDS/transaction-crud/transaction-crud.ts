import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Transaction } from '../../../models/transaction';
import { TransactionService } from '../../../services/transaction-service';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal';

@Component({
  selector: 'app-transaction-crud',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent],
  templateUrl: './transaction-crud.html',
  styleUrl: './transaction-crud.css'
})
export class TransactionCrud implements OnInit {

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  transactionToDelete: Transaction | null = null;
  transactionToUpdate: Transaction | null = null;

  showDeleteModal: boolean = false;
  showStatusModal: boolean = false;
  newStatus: 'aceptada' | 'rechazada' = 'aceptada';

  loading: boolean = false;
  searchTerm: string = '';
  statusFilter: string = 'todos';

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar transacciones:', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.transactions];

    if (this.statusFilter !== 'todos') {
      result = result.filter(t => t.status === this.statusFilter);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(t =>
        t.bookTitle.toLowerCase().includes(term) ||
        t.requesterName.toLowerCase().includes(term) ||
        t.ownerName.toLowerCase().includes(term)
      );
    }

    this.filteredTransactions = result;
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.applyFilters();
  }

  onStatusFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.statusFilter = select.value;
    this.applyFilters();
  }

  onChangeStatus(transaction: Transaction, status: 'aceptada' | 'rechazada'): void {
    this.transactionToUpdate = transaction;
    this.newStatus = status;
    this.showStatusModal = true;
  }

  confirmStatusChange(): void {
    if (!this.transactionToUpdate) return;

    this.transactionService.updateTransactionStatus(
      this.transactionToUpdate.id!,
      this.newStatus
    ).subscribe({
      next: () => {
        this.loadTransactions();
        this.closeStatusModal();
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        this.closeStatusModal();
      }
    });
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.transactionToUpdate = null;
  }

  onDeleteTransaction(transaction: Transaction): void {
    this.transactionToDelete = transaction;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.transactionToDelete?.id) return;

    this.transactionService.deleteTransaction(this.transactionToDelete.id).subscribe({
      next: () => {
        this.loadTransactions();
        this.cancelDeleteModal();
      },
      error: (err) => {
        console.error('Error al eliminar transacción:', err);
        this.cancelDeleteModal();
      }
    });
  }

  cancelDeleteModal(): void {
    this.showDeleteModal = false;
    this.transactionToDelete = null;
  }

  // Helpers para estilos
  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pendiente': 'bg-warning text-dark',
      'aceptada': 'bg-success',
      'rechazada': 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
  }

  getStatusText(status: string): string {
    const texts: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'aceptada': 'Aceptada',
      'rechazada': 'Rechazada'
    };
    return texts[status] || status;
  }

  getTypeClass(type: string): string {
    return type === 'venta' ? 'bg-primary' : 'bg-info';
  }

  getTypeText(type: string): string {
    return type === 'venta' ? 'Venta' : 'Donación';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}


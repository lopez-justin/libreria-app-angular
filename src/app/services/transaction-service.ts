import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000/transactions';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  updateTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${transaction.id}`, transaction);
  }

  updateTransactionStatus(id: number, status: 'pendiente' | 'aceptada' | 'rechazada'): Observable<Transaction> {
    const responseDate = status !== 'pendiente' ? new Date().toISOString().split('T')[0] : undefined;
    return this.http.patch<Transaction>(`${this.apiUrl}/${id}`, { status, responseDate });
  }

  deleteTransaction(id: number): Observable<Transaction> {
    return this.http.delete<Transaction>(`${this.apiUrl}/${id}`);
  }

  // Obtener transacciones por usuario solicitante
  getTransactionsByRequester(requesterId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}?requesterId=${requesterId}`);
  }

  // Obtener transacciones pendientes
  getPendingTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}?status=pendiente`);
  }
}


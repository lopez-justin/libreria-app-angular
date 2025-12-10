import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = "http://localhost:3000/books";

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${book.id}`, book);
  }

  deleteBook(id: number | string): Observable<Book> {
  return this.http.delete<Book>(`${this.apiUrl}/${id}`);
  }

  getActiveBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl).pipe(
      map(books => books.filter(b => b.active === true))
    );
  }

  searchBooks(param: string): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl).pipe(
      map(books => books.filter(b => 
        b.title.toLowerCase().includes(param.toLowerCase()) ||
        b.author.toLowerCase().includes(param.toLowerCase())
      ))
    );
  }
}
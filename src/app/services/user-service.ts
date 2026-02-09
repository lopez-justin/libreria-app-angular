import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiBaseUrl}/User`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  update(user: User): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${user.id}`, user);
  }

  deactivate(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  delete(id: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/${id}`);
  }
}

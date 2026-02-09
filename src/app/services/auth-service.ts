import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {jwtDecode} from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = `${environment.apiBaseUrl}/Auth`;


  constructor(private http: HttpClient, private router: Router) {}


  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password });
  }

  register(name: string, email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, { name, email, password });
  }

  saveToken(token: string): void {
    localStorage.setItem("token", token);
  }


  getToken(): string | null {
    return localStorage.getItem("token");
  }


  logout(): void {
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserIdFromToken() {
    const token = this.getToken();
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded['userId'] || null;
  }

  getEmailFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded['email'] || null;
  }

  getNameFromEmail(): string | null {
    const email = this.getEmailFromToken();
    if (!email) return null;
    return email.split('@')[0];
  }

}

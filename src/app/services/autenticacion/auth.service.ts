import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private token: string = '';
  private username: string = '';
  private userId: number = 0;
  private role: string = '';

  constructor() {
    this.loadSessionData();
  }

  private loadSessionData() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const storedToken = sessionStorage.getItem('token');
      const storedUsername = sessionStorage.getItem('username');

      this.token = storedToken ? storedToken : '';
      this.username = storedUsername ? storedUsername : '';

      if (this.token) {
        try {
          const decodedToken: any = jwtDecode(this.token);
          this.userId = decodedToken.userId || 0;
          this.role = decodedToken.role || '';
        } catch (error) {
          console.error('Error decoding the JWT token', error);
        }
      }
    }
  }

  public getToken(): string {
    return this.token;
  }

  public getUsername(): string {
    return this.username;
  }

  public getUserId(): number {
    return this.userId;
  }

  public getRole(): string {
    return this.role;
  }

  public isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
  }
}

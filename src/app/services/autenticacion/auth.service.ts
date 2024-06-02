import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private tokenSubject = new BehaviorSubject<string>('');
  private usernameSubject = new BehaviorSubject<string>('');
  private userIdSubject = new BehaviorSubject<number>(0);
  private roleSubject = new BehaviorSubject<string>('');

  token$ = this.tokenSubject.asObservable();
  username$ = this.usernameSubject.asObservable();
  userId$ = this.userIdSubject.asObservable();
  role$ = this.roleSubject.asObservable();

  constructor() {
    this.loadSessionData();
  }

  private loadSessionData() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const storedToken = sessionStorage.getItem('token');
      const storedUsername = sessionStorage.getItem('username');
      const storedUserId = sessionStorage.getItem('userId');
      const storedRole = sessionStorage.getItem('role');

      const token = storedToken ? storedToken : '';
      const username = storedUsername ? storedUsername : '';
      const userId = storedUserId ? parseInt(storedUserId, 10) : 0;
      const role = storedRole ? storedRole : '';

      this.tokenSubject.next(token);
      this.usernameSubject.next(username);
      this.userIdSubject.next(userId);
      this.roleSubject.next(role);

      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          this.userIdSubject.next(decodedToken.userId || userId);
          this.roleSubject.next(decodedToken.role || role);
        } catch (error) {
          console.error('Error decoding the JWT token', error);
        }
      }
    }
  }

  public getToken(): string {
    return this.tokenSubject.getValue();
  }

  public getUsername(): string {
    return this.usernameSubject.getValue();
  }

  public getUserId(): number {
    return this.userIdSubject.getValue();
  }

  public getRole(): string {
    return this.roleSubject.getValue();
  }

  public logout(): void {
    if (this.isBrowser()) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('role');
      this.tokenSubject.next('');
      this.usernameSubject.next('');
      this.userIdSubject.next(0);
      this.roleSubject.next('');
    }
  }

  public isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
  }

  public setSessionData(token: string, username: string, userId: number, role: string): void {
    if (this.isBrowser()) {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('userId', userId.toString());
      sessionStorage.setItem('role', role);
      this.tokenSubject.next(token);
      this.usernameSubject.next(username);
      this.userIdSubject.next(userId);
      this.roleSubject.next(role);
    }
  }
}

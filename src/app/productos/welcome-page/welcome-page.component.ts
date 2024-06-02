import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-welcome-page',
  standalone: true,
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})

export class WelcomePageComponent implements OnInit {
  token: string = '';
  username: string = '';
  userId: number = 0;
  role: string = ''; // Agregar el rol

  ngOnInit(): void {
    if (this.isBrowser()) {
      const storedToken = sessionStorage.getItem('token');
      const storedUsername = sessionStorage.getItem('username');
      const storedRole = sessionStorage.getItem('role'); // Obtener el rol

      this.token = storedToken ? storedToken : '';
      this.username = storedUsername ? storedUsername : '';
      this.role = storedRole ? storedRole : ''; // Asignar el rol

      if (this.token) {
        try {
          const decodedToken: any = jwtDecode(this.token);
          this.userId = decodedToken.userId || 0;
        } catch (error) {
          console.error('Error decodificando el token JWT', error);
        }
      }
    } else {
      console.error('sessionStorage no está disponible.');
    }
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
  }
}

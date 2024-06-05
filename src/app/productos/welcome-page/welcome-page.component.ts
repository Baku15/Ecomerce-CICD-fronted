import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../services/autenticacion/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {MatGridListModule} from '@angular/material/grid-list';

import { ActivatedRoute, RouterModule } from '@angular/router';


@Component({
  selector: 'app-welcome-page',
  standalone: true,
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css'],
  imports: [MatGridListModule,RouterModule]
})

export class WelcomePageComponent implements OnInit {
  username: string = '';
  userId: number = 0;
  role: string = '';
  token: string = '';
  private authSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSubscription.add(this.authService.username$.subscribe(username => this.username = username));
    this.authSubscription.add(this.authService.userId$.subscribe(userId => this.userId = userId));
    this.authSubscription.add(this.authService.role$.subscribe(role => this.role = role));
    this.authSubscription.add(this.authService.token$.subscribe(token => this.token = token));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}

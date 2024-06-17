import { Component, OnDestroy, OnInit, Signal, computed } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../services/autenticacion/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../services/productos/producto.service';
import { MaterialModule } from '../material-module';
import { Producto } from '../model/producto.interface';

export type MenuItem = {
  icon: string;
  label: string;
  route: string;
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatTooltipModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    MatCheckboxModule,
    FormsModule,
    CommonModule,
    MaterialModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})

export class SidebarComponent implements OnInit {
  opened: boolean = true;
  id: number = 0;
  collapsed = signal(true);
  sidenavwidth = computed(() => (this.collapsed() ? '65px' : '250px'));
  profilepicsize = computed(() => (this.collapsed() ? '32' : '100'));

  menuItem1: MenuItem = { icon: 'home', label: 'Home', route: '/' };
  menuItems: Signal<MenuItem[]> = signal([
    { icon: 'home', label: 'Home', route: '/' },
    { icon: 'folder', label: 'Files', route: '/files' },
    { icon: 'settings', label: 'Settings', route: '/settings' },
  ]);

  role: string = '';
  private authSubscription: Subscription = new Subscription();
  lowStockProducts: Producto[] = [];
  lowStockCount: number = 0;
  showNotificationPanel: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private productService: ProductoService
  ) {}

  ngOnInit(): void {
    this.authSubscription.add(this.authService.role$.subscribe(role => {
      this.role = role;
      if (this.role === 'EMPLEADO') {
        this.loadLowStockNotifications();
      }
    }));
    this.route.queryParams.subscribe((params) => {
      this.id = params['number'];
    });
  }

  openSideNav() {
    this.opened = !this.opened;
  }

  irperfil() {
    this.router.navigate(['/admin/perfil-user'], {
      queryParams: { number: this.id },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  loadLowStockNotifications() {
    const userId = this.authService.getUserId();
    this.productService.getLowStockProductsByUserId(userId).subscribe(
      (products: Producto[]) => {
        this.lowStockProducts = products;
        this.lowStockCount = products.length;
              console.log('Low stock products:', products); // Log the received data

      },
      (error) => {
        console.error('Error al cargar productos con stock bajo:', error);
      }
    );
  }

  toggleNotificationPanel() {
    this.showNotificationPanel = !this.showNotificationPanel;
  }

  closeNotificationPanel() {
    this.showNotificationPanel = false;
  }

  removeNotification(productId: number) {
    this.lowStockProducts = this.lowStockProducts.filter(product => product.id !== productId);
    this.lowStockCount = this.lowStockProducts.length;
  }
}

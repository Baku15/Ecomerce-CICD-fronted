import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { SalesService } from '../../services/ventas/sales.service';
import { Sale } from '../../model/sales.model';
import { Chart, registerables, ChartType } from 'chart.js';
import { MaterialModule } from '../../material-module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PlatformService } from '../../services/platform.service';
import { AuthService } from '../../services/autenticacion/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './sales-dashboard.component.html',
  styleUrl: './sales-dashboard.component.css'
})


export class SalesDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('salesChart') salesChartRef!: ElementRef;

  sales: Sale[] = [];
  dataSource = new MatTableDataSource<Sale>(this.sales);
  displayedColumns: string[] = ['id', 'saleDate', 'productName', 'quantity', 'price', 'total'];

  totalSales: number = 0;
  totalRevenue: number = 0;
  topProducts: any[] = [];
  salesChart: any;
  chartType: ChartType = 'bar';

  private authSubscription: Subscription = new Subscription();

  constructor(
    private salesService: SalesService,
    private renderer: Renderer2,
    private authService: AuthService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.authSubscription.add(this.authService.userId$.subscribe(userId => {
      if (userId !== 0) {
        this.loadSalesData(userId);
      } else {
        console.error('Error: User ID is 0');
      }
    }));
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      this.createSalesChart();
    }
  }

  loadSalesData(userId: number) {
    this.salesService.getSalesByUserId(userId).subscribe(
      (data: Sale[]) => {
        console.log('Ventas recibidas:', data);
        this.sales = Array.isArray(data) ? data : [];
        this.dataSource.data = this.sales;
        this.calculateSummary();
        if (typeof window !== 'undefined') {
          this.updateSalesChart();
        }
      },
      error => {
        console.error('Error al cargar las ventas:', error);
      }
    );
  }

  calculateSummary() {
    this.totalSales = this.sales.length;
    this.totalRevenue = this.sales.reduce((sum, sale) => sum + sale.precio * sale.cantidad, 0);

    const productSales = this.sales.reduce((acc: { [key: string]: number }, sale) => {
      const productName = sale.productoNombre || `Producto ${sale.productoId}`;
      if (!acc[productName]) {
        acc[productName] = 0;
      }
      acc[productName] += sale.cantidad;
      return acc;
    }, {});

    this.topProducts = Object.entries(productSales).map(([name, quantity]) => ({ name, quantity })).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  }

  createSalesChart() {
    const canvas = this.renderer.selectRootElement(this.salesChartRef.nativeElement);
    this.salesChart = new Chart(canvas, {
      type: this.chartType,
      data: {
        labels: this.topProducts.map(p => p.name),
        datasets: [{
          label: 'Top Products',
          data: this.topProducts.map(p => p.quantity),
          backgroundColor: this.chartType === 'bar' ? 'rgba(54, 162, 235, 0.2)' : [
            'rgba(54, 162, 235, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: this.chartType === 'bar' ? 'rgba(54, 162, 235, 1)' : [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: this.chartType === 'bar' ? {
          y: {
            beginAtZero: true,
            type: 'linear'
          }
        } : {},
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const label = context.dataset.label || '';
                return `${label}: ${context.raw}`;
              }
            }
          }
        }
      }
    });
  }

  updateSalesChart() {
    if (this.salesChart) {
      this.salesChart.destroy();
      this.createSalesChart();
    }
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Sale } from '../../model/sales.model';
import { SalesService } from '../../services/ventas/sales.service';
import { AuthService } from '../../services/autenticacion/auth.service';
import { Chart, registerables, ChartType } from 'chart.js';
import { Producto } from '../../model/producto.interface';
import { Categoria } from '../../model/categoria.interface';
import { ProductoService } from '../../services/productos/producto.service';
import { CategoriasService } from '../../services/categorias/categorias.service';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material-module';
import { MatNativeDateModule } from '@angular/material/core';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { error } from 'console';

@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, ReactiveFormsModule, MaterialModule, MatNativeDateModule],
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.css']
})

export class SalesDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('salesChart') salesChartRef!: ElementRef;
  @ViewChild('revenueChart') revenueChartRef!: ElementRef;
  @ViewChild('categoryChart') categoryChartRef!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  sales: Sale[] = [];
  dataSource = new MatTableDataSource<Sale>(this.sales);
  displayedColumns: string[] = ['id', 'saleDate', 'productName', 'quantity', 'price', 'total'];

  totalSales: number = 0;
  totalRevenue: number = 0;
  topProducts: any[] = [];
  salesChart: any;
  revenueChart: any;
  categoryChart: any;
  chartType: ChartType = 'bar';

  startDate: Date | null = null;
  endDate: Date | null = null;

  products: Producto[] = [];
  selectedProductId: number | null = null;

  categories: Categoria[] = [];
  selectedCategoryId: number | null = null;

  searchControl: FormControl = new FormControl();
  pageSize: number = 10;
  currentPage: number = 0;

  priceRange: number = 1000;
  quantityRange: number = 500;
  sortColumn: string = 'fechaVenta';
  sortOrder: string = 'asc';

  constructor(
    private salesService: SalesService,
    private authService: AuthService,
    private productoService: ProductoService,
    private categoriaService: CategoriasService,
    private snackBar: MatSnackBar
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadSalesData();
    this.loadProducts();
    this.loadCategories();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        this.currentPage = 0;
        return this.searchSales(value);
      })
    ).subscribe(
      data => {
        this.sales = data.result.content;
        this.dataSource.data = this.sales;
        this.paginator.length = data.result.totalElements;
        this.calculateSummary();
        this.updateSalesChart();
        this.updateRevenueChart();
        this.updateCategoryChart();
      },
      error => {
        console.error('Error al buscar las ventas:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.createSalesChart();
    this.createRevenueChart();
    this.createCategoryChart();
  }

  loadSalesData() {
    const userId = this.authService.getUserId();
    if (userId !== 0) {
      this.salesService.getSalesPaginated(userId, this.currentPage, this.pageSize, this.sortColumn, this.sortOrder).subscribe(
        data => {
          this.sales = data.result.content;
          this.dataSource.data = this.sales;
          this.paginator.length = data.result.totalElements;
          this.calculateSummary();
          this.updateSalesChart();
          this.updateRevenueChart();
          this.updateCategoryChart();
        },
        error => {
          console.error('Error al cargar las ventas:', error);
        }
      );
    } else {
      console.error('Error: User ID is 0');
    }
  }

  loadProducts() {
    this.productoService.getAllProducts().subscribe(
      (data: Producto[]) => {
        this.products = data;
      },
      error => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  loadCategories() {
    this.categoriaService.getAllCategorias().subscribe(
      (data: Categoria[]) => {
        this.categories = data;
      },
      error => {
        console.error('Error al cargar categorías:', error);
      }
    );
  }

  searchSales(query: string) {
    const userId = this.authService.getUserId();
    if (userId !== 0) {
      return this.salesService.searchSales(userId, query, this.currentPage, this.pageSize, this.sortColumn, this.sortOrder);
    } else {
      console.error('Error: User ID is 0');
      return of({ result: { content: [], totalElements: 0 } });
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applySearch();
  }

  applySearch() {
    const query = this.searchControl.value;
    if (query.trim() !== '') {
      this.searchSales(query).subscribe(
        data => {
          this.sales = data.result.content;
          this.dataSource.data = this.sales;
          this.paginator.length = data.result.totalElements;
          this.calculateSummary();
          this.updateSalesChart();
          this.updateRevenueChart();
          this.updateCategoryChart();
        },
        error => {
          console.error('Error al buscar las ventas:', error);
        }
      );
    } else {
      this.loadSalesData();
    }
  }

  applyDateFilter() {
    const userId = this.authService.getUserId();
    if (userId !== 0 && this.startDate && this.endDate) {
      const startDateString = this.startDate.toISOString();
      const endDateString = this.endDate.toISOString();

      this.salesService.getSalesByUserIdAndDateRange(userId, startDateString, endDateString).subscribe(
        (data: Sale[]) => {
          this.sales = Array.isArray(data) ? data : [];
          this.dataSource.data = this.sales;
          this.calculateSummary();
          this.updateSalesChart();
          this.updateRevenueChart();
          this.updateCategoryChart();
        },
        error => {
          console.error('Error al cargar las ventas:', error);
        }
      );
    } else {
      console.error('Error: User ID is 0 or dates are not selected');
    }
  }

  applyProductFilter() {
    const userId = this.authService.getUserId();
    if (userId !== 0 && this.selectedProductId !== null) {
      this.salesService.getSalesByUserIdAndProductId(userId, this.selectedProductId).subscribe(
        (data: Sale[]) => {
          this.sales = Array.isArray(data) ? data : [];
          this.dataSource.data = this.sales;
          this.calculateSummary();
          this.updateSalesChart();
          this.updateRevenueChart();
          this.updateCategoryChart();
        },
        error => {
          console.error('Error al cargar las ventas:', error);
        }
      );
    } else {
      console.error('Error: User ID is 0 or product is not selected');
    }
  }

  clearProductFilter() {
    this.selectedProductId = null;
    this.loadSalesData();
  }

  applyCategoryFilter() {
    const userId = this.authService.getUserId();
    if (userId !== 0 && this.selectedCategoryId !== null) {
      this.salesService.getSalesByUserIdAndCategoryId(userId, this.selectedCategoryId).subscribe(
        (data: Sale[]) => {
          this.sales = Array.isArray(data) ? data : [];
          this.dataSource.data = this.sales;
          this.calculateSummary();
          this.updateSalesChart();
          this.updateRevenueChart();
          this.updateCategoryChart();
        },
        error => {
          console.error('Error al cargar las ventas:', error);
        }
      );
    } else {
      console.error('Error: User ID is 0 or category is not selected');
    }
  }

  clearCategoryFilter() {
    this.selectedCategoryId = null;
    this.loadSalesData();
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
    const canvas = this.salesChartRef.nativeElement;
    this.salesChart = new Chart(canvas, {
      type: this.chartType,
      data: {
        labels: this.topProducts.map(p => p.name),
        datasets: [{
          label: 'Top Productos',
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

  createRevenueChart() {
    const canvas = this.revenueChartRef.nativeElement;
    this.revenueChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.sales.map(sale => sale.fechaVenta),
        datasets: [{
          label: 'Ingresos',
          data: this.sales.map(sale => sale.precio * sale.cantidad),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            type: 'linear'
          }
        },
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

createCategoryChart() {
    const canvas = this.categoryChartRef.nativeElement;
    const categorySales = this.sales.reduce((acc: { [key: string]: number }, sale) => {
      const category = this.categories.find(cat => cat.idCategoria === sale.productoId);
      const categoryName = category ? category.categoria : 'Desconocida';
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += sale.cantidad;
      return acc;
    }, {});

    const sortedCategorySales = Object.entries(categorySales).map(([name, quantity]) => ({ name, quantity })).sort((a, b) => b.quantity - a.quantity);

    this.categoryChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: sortedCategorySales.map(c => c.name),
        datasets: [{
          label: 'Ventas por Categoría',
          data: sortedCategorySales.map(c => c.quantity),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            type: 'linear'
          }
        },
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

  updateRevenueChart() {
    if (this.revenueChart) {
      this.revenueChart.destroy();
      this.createRevenueChart();
    }
  }

  updateCategoryChart() {
    if (this.categoryChart) {
      this.categoryChart.destroy();
      this.createCategoryChart();
    }
  }

  exportSalesToCsv() {
    const options = {
      headers: ['ID', 'Fecha de Venta', 'Producto', 'Cantidad', 'Precio', 'Total']
    };
    const data = this.sales.map(sale => ({
      ID: sale.id,
      'Fecha de Venta': new Date(sale.fechaVenta).toLocaleDateString(),
      Producto: sale.productoNombre,
      Cantidad: sale.cantidad,
      Precio: sale.precio.toFixed(2),
      Total: (sale.precio * sale.cantidad).toFixed(2)
    }));
    new Angular5Csv(data, 'Ventas', options);
  }

  exportSalesToPdf() {
    const doc = new jsPDF();
    doc.text('Reporte de Ventas', 14, 16);
    const autoTableOptions = {
      head: [['ID', 'Fecha', 'Producto', 'Cantidad', 'Precio', 'Total']],
      body: this.sales.map(sale => [
        sale.id,
        new Date(sale.fechaVenta).toLocaleDateString(),
        sale.productoNombre || `Producto ${sale.productoId}`,
        sale.cantidad,
        sale.precio.toFixed(2),
        (sale.precio * sale.cantidad).toFixed(2)
      ]),
      startY: 20
    };
    autoTable(doc, autoTableOptions);
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.text(`Total de Ventas: ${this.totalSales}`, 14, finalY + 10);
    doc.text(`Ingresos Totales: ${this.totalRevenue.toFixed(2)}`, 14, finalY + 20);
    doc.save('reporte_de_ventas.pdf');
  }

  showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }
}

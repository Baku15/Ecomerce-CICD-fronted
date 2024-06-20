import { Routes } from '@angular/router';
import { AuthGuard } from './services/autenticacion/auth.guard';
import { AuthEmployeeGuard } from './services/autenticacion/auth-employee.guard';
import { AuthCompradorGuard } from './services/autenticacion/auth-comprador.guard';
import { AuthAdminGuard } from './services/autenticacion/auth-admin.guard';

import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';
import { ShoppingCartComponent } from './carrito-compras/carrito-compras.component';
import { EditarperfilComponent } from './editar-perfil/editar-perfil.component';
import { LoginComponent } from './login/login.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { UserlistComponent } from './userlist/userlist.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DetalleuserComponent } from './detalleuser/detalleuser.component';
import { RecoverpasswordComponent } from './recoverpassword/recoverpassword.component';
import { MarcaComponent } from './productos/marca/marca.component';
import { CategoriaProductoComponent } from './productos/categoria-producto/categoria-producto.component';
import { RegistroProductosComponent } from './productos/registro-productos/registro-productos.component';
import { ProductoFormComponent } from './productos/producto-form/producto-form.component';
import { UpdateProductoComponent } from './productos/update-producto/update-producto.component';
import { RegistroEmpleadoComponent } from './registro-empleado/registro-empleado.component';
import { ListaMarcasComponent } from './productos/lista-marcas/lista-marcas.component';
import { WelcomePageComponent } from './productos/welcome-page/welcome-page.component';
import { ProductoDetailComponent } from './productos/producto-detail/producto-detail.component';
import { VerComentariosComponent } from './productos/ver-comentarios/ver-comentarios.component';
import { SalesDashboardComponent } from './ventas/sales-dashboard/sales-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro-usuario', component: RegistroUsuarioComponent },
  { path: 'recoveraccount', component: RecoverpasswordComponent },
  {
    path: 'admin',
    component: SidebarComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'categoria', component: CategoriaProductoComponent, canActivate: [AuthEmployeeGuard] },
      { path: 'editar-perfil', component: EditarperfilComponent, canActivate: [AuthEmployeeGuard] },
      { path: 'menu-principal', component: MenuPrincipalComponent, canActivate: [AuthEmployeeGuard] },
      { path: 'perfil-user', component: PerfilUsuarioComponent, canActivate: [AuthEmployeeGuard] },
      { path: 'lista-productos', component: RegistroProductosComponent},
      { path: 'welcome-page', component: WelcomePageComponent, },
      { path: 'nuevo-producto', component: ProductoFormComponent, canActivate: [AuthEmployeeGuard] },
      { path: 'registro-producto/:id/edit', component: ProductoFormComponent, canActivate: [AuthEmployeeGuard] },
      { path: 'userlist', component: UserlistComponent, canActivate: [AuthAdminGuard] },
      { path: 'producto/:productoId', component: UpdateProductoComponent, canActivate: [AuthEmployeeGuard] },
      { path: 'detalleuser', component: DetalleuserComponent, canActivate: [AuthEmployeeGuard] },
      { path: 'marca', component: MarcaComponent, canActivate: [AuthEmployeeGuard] },
      { path: 'registroempleado', component: RegistroEmpleadoComponent, canActivate: [AuthAdminGuard] },
      { path: 'lista-marcas', component: ListaMarcasComponent, canActivate: [AuthEmployeeGuard] },
      { path: 'carritoCompras', component: ShoppingCartComponent, canActivate: [AuthCompradorGuard] },
      { path: 'comments/:id', component: ProductoDetailComponent},
      { path: 'ver-comentarios/:productoId', component: VerComentariosComponent},
      { path: 'sales-dashboard', component: SalesDashboardComponent, canActivate: [AuthEmployeeGuard] },
    ],
  },
  { path: 'superadmin', component: SidebarComponent, children: [] },
];


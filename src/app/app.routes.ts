import { Routes } from '@angular/router';
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';
// import { CarritoComprasComponent } from './carrito-compras/carrito-compras.component';
import CarritoComprasComponent from './carrito-compras/carrito-compras.component';
// import { CatalogoComponent } from './catalogo/catalogo.component';
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

export const routes: Routes = [
  //Login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro-usuario', component: RegistroUsuarioComponent },
  { path: 'recoveraccount', component: RecoverpasswordComponent },
  //Para el user Admin
  {
    path: 'admin',
    component: SidebarComponent,
    children: [
      // { path: 'catalogo', component: CatalogoComponent},
      { path: 'categoria', component: CategoriaProductoComponent },
      { path: 'editar-perfil', component: EditarperfilComponent },
      { path: 'menu-principal', component: MenuPrincipalComponent },
      { path: 'perfil-user', component: PerfilUsuarioComponent },
      { path: 'lista-productos', component: RegistroProductosComponent },
      { path: 'nuevo-producto', component: ProductoFormComponent },
      { path: 'registro-producto/:id/edit', component: ProductoFormComponent },
      { path: 'userlist', component: UserlistComponent },
      { path: 'producto/:productoId', component: UpdateProductoComponent },
      { path: 'detalleuser', component: DetalleuserComponent },
      { path: 'marca', component: MarcaComponent },
      { path: 'registroempleado', component: RegistroEmpleadoComponent },
      { path: 'lista-marcas', component: ListaMarcasComponent },
      { path: 'carritoCompras', component: CarritoComprasComponent },
    ],
  },
  //Para el user SuperAdmin
  { path: 'superadmin', component: SidebarComponent, children: [] },
];

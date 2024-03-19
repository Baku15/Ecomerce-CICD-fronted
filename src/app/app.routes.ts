import { Routes } from '@angular/router';
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';
import { carritocomprasComponent } from './carrito-compras/carrito-compras.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { CategoriaProductoComponent } from './categoria-producto/categoria-producto.component';
import { EditarperfilComponent } from './editar-perfil/editar-perfil.component';
import { LoginComponent } from './login/login.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { RegistroProductosComponent } from './registro-productos/registro-productos.component';

export const routes: Routes = [
    { path: 'registro-usuario', component: RegistroUsuarioComponent},
    { path: 'carrito-compras', component: carritocomprasComponent},
    { path: 'catalogo', component: CatalogoComponent},
    { path: 'categoria', component: CategoriaProductoComponent},
    { path: 'editar-perfil', component: EditarperfilComponent},
    { path: 'login', component: LoginComponent},
    { path: 'menu-principal', component: MenuPrincipalComponent},
    { path: 'perfil-user', component: PerfilUsuarioComponent},
    { path: 'registro-producto', component: RegistroProductosComponent},
];

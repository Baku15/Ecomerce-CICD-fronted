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
import { ProductoFormComponent} from './producto-form/producto-form.component';
import { UserlistComponent } from './userlist/userlist.component';
import { SidebarComponent } from './sidebar/sidebar.component';


export const routes: Routes = [   

    //Login
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent},
    { path: 'registro-usuario', component: RegistroUsuarioComponent},
    //Para el user Admin
    { path: 'admin', component: SidebarComponent,
        children:[
            { path: 'carrito-compras', component: carritocomprasComponent},
            { path: 'catalogo', component: CatalogoComponent},
            { path: 'categoria', component: CategoriaProductoComponent},
            { path: 'editar-perfil', component: EditarperfilComponent},
            { path: 'menu-principal', component: MenuPrincipalComponent},
            { path: 'perfil-user', component: PerfilUsuarioComponent},
            { path: 'registro-producto', component: RegistroProductosComponent},
            { path: 'producto-form', component: ProductoFormComponent},
            { path: 'registro-producto/:id/edit', component: ProductoFormComponent},
            { path: 'userlist', component: UserlistComponent},
        ]
    },
    //Para el user SuperAdmin
    { path: 'superadmin', component: SidebarComponent,
        children:[
        ]
    },
];

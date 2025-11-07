import { Routes } from '@angular/router';
import {Layout} from './core/components/layout/layout';
import {authGuard} from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'home',
    component: Layout,
    children: [
      {
        path: 'customers',
        title: 'Clientes',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./modules/customers/pages/customers/customers').then(m => m.Customers),
      },
      {
        path: 'stores',
        title: 'Tiendas',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./modules/stores/pages/stores/stores').then(m => m.Stores),
      },
      {
        path: 'products',
        title: 'Productos',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./modules/products/pages/products/products').then(m => m.Products),
      },
      {
        path: 'online-shop',
        title: 'Tienda Online',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./modules/online-store/pages/store/store').then(m => m.Store),
      },
      {
        path: '',
        redirectTo: 'customers',
        pathMatch: 'full',
      },
    ]
  },
  {
    path: 'login',
    title: 'Inicio de sesión',
    loadComponent: () =>
      import('./modules/auth/pages/login/login').then(m => m.Login),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  }

];

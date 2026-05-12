import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// project import
import { HomePageComponent } from './demo/home-page/home-page.component';
import { AdminComponent } from './theme/layout/admin/admin.component'; // Import your admin layout
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    children: [
      {
        path: '',
        redirectTo: 'home-page',
        pathMatch: 'full'
      },
      {
        path: 'home-page',
        loadComponent: () => import('./demo/home-page/home-page.component').then((c) => c.HomePageComponent)
      }
    ]
  },
  {
    path: 'auth',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/auth-signin/auth-signin.component').then((c) => c.AuthSigninComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/pages/authentication/auth-signup/auth-signup.component').then((c) => c.AuthSignupComponent)
      }
    ]
  },
  {
    path: '',
    component: AdminComponent, // This is your main layout with sidebar
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component').then((c) => c.DashboardComponent)
      },
      {
        path: 'basic',
        loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'forms',
        loadComponent: () => import('./demo/pages/form-element/form-element').then((c) => c.FormElement)
      },
      {
        path: 'tables',
        loadComponent: () => import('./demo/pages/tables/tbl-bootstrap/tbl-bootstrap.component').then((c) => c.TblBootstrapComponent)
      },
      {
        path: 'apexchart',
        loadComponent: () => import('./demo/pages/core-chart/apex-chart/apex-chart.component').then((c) => c.ApexChartComponent)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/extra/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

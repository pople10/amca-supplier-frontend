import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { AuthGuard } from './core/guard/auth.guard';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';
import { DashboardComponent } from './views/pages/dashboard/dashboard.component';
import { GeneralComponent } from './views/pages/general/general.component';
import { AdministrationComponent } from './views/pages/administration/administration.component';
import { ExportAuthorizationComponent } from './views/pages/export-authorization/export-authorization.component';
import { NoLinkPageComponent } from './views/pages/no-link-pages/no-link-page.component';
import { BuyerComponent } from './views/pages/buyer/buyer/buyer.component';
import { NonAuthGuard } from './core/guard/non-auth.guard';
import { SupplierComponent } from './views/pages/supplier/supplier.component';
import { ForumComponent } from './views/pages/forum/forum.component';


const routes: Routes = [
  { path:'', loadChildren: () => import('./views/pages/public-pages/public-pages.module').then(m => m.PublicPagesModule) },
  { canActivate:[NonAuthGuard],path:'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component : DashboardComponent,
        loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
        data : {
          role : ["admin","supplier","buyer","buyer_expert"]
        }
      },
      {
        path: 'general',
        component : GeneralComponent,
        loadChildren: () => import('./views/pages/general/general.module').then(m => m.GeneralModule),
        data : {
          role : ["admin","supplier","buyer","buyer_expert"]
        }
      },
      {
        path: 'forum',
        component : ForumComponent,
        loadChildren: () => import('./views/pages/forum/forum.module').then(m => m.ForumModule),
        data : {
          role : ["admin","buyer","buyer_expert"]
        }
      },
      {
        path: 'buyer',
        component : BuyerComponent,
        loadChildren: () => import('./views/pages/buyer/buyer/buyer.module').then(m => m.BuyerModule),
        data : {
          role : ["buyer","buyer_expert"]
        }
      },
      {
        path: 'supplier',
        component : SupplierComponent,
        loadChildren: () => import('./views/pages/supplier/supplier.module').then(m => m.SupplierModule),
        data : {
          role : ["supplier"]
        }
      },
      {
        path: 'admin',
        component : AdministrationComponent,
        loadChildren: () => import('./views/pages/administration/administration.module').then(m => m.AdministrationModule),
        data : {
          role : ["admin"]
        }
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'error',
    component: ErrorPageComponent,
    data: {
      'type': "Erreur",
      'title': 'Page inéxistante',
      'desc': 'La page que vous cherchez n\'éxiste pas'
    }
  },
  {
    path: 'access-denied',
    component: ErrorPageComponent,
    data: {
      'type': "Access Denied",
      'title': 'Access Denied',
      'desc': "You don't have permission to this page"
    }
  },
  {
    path: 'error/:type',
    component: ErrorPageComponent
  },
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

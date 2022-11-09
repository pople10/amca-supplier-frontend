import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { BuyerComponent } from './buyer.component';
import { CommentsComponent } from './comments/comments.component';
import { SupplierComponent } from './supplier/supplier.component';
import { SuppliersRequestsComponent } from './suppliers-requests/suppliers-requests.component';
import { SuppliersComponent } from './suppliers/suppliers/suppliers.component';

const routes: Routes = [
  {
    path: '',
    component: BuyerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'suppliers',
        pathMatch: 'full'
      },
      {
        path: 'suppliers',
        component : SuppliersComponent,
        data : {
          role : ["buyer","buyer_expert"]
        }
      },
      {
        path: 'suppliers/:id',
        component : SupplierComponent,
        data : {
          role : ["buyer","buyer_expert"]
        }
      },
      {
        path: 'suppliers/requests/list',
        component : SuppliersRequestsComponent,
        data : {
          role : ["buyer_expert"]
        }
      },
      {
        path: 'rates',
        component : CommentsComponent,
        data : {
          role : ["buyer","buyer_expert"]
        }
      },
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyerRoutingModule { }

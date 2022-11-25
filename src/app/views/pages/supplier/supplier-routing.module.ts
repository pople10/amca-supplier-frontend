import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { MyDataComponent } from './my-data/my-data.component';
import { SupplierComponent } from './supplier.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'mine',
        pathMatch: 'full'
      },
      {
        path: 'mine',
        component : MyDataComponent,
        data : {
          role : ["supplier"]
        }
      }
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }

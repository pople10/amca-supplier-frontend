import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";


import { FeahterIconModule } from '../../../core/feather-icon/feather-icon.module';

import { NgbAccordionModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { NgSelectModule } from '@ng-select/ng-select';


// ngx-quill
import { QuillModule } from 'ngx-quill';

// angular-archwizard
import { ArchwizardModule } from 'angular-archwizard';

import { AdministrationComponent } from "./administration.component";

import { Routes, RouterModule } from '@angular/router';

import { MatStepperModule } from "@angular/material/stepper";

import { CdkStepperModule } from '@angular/cdk/stepper';


import { NgxCsvParserModule } from 'ngx-csv-parser';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { TranslateModule } from "@ngx-translate/core";

import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { MatIconModule } from '@angular/material/icon';

import { NgbNavModule, NgbPaginationModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { HistoryComponent } from './history/history.component';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { AddBuyerComponent } from './add-buyer/add-buyer.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AdminsComponent } from './admins/admins.component';
import { ShowUserDataComponent } from './show-user-data/show-user-data.component';

import {MatDialogModule} from '@angular/material/dialog';
import { SupplierFormComponent } from './supplier-form/supplier-form.component';
import { SuppliersComponent } from './suppliers/suppliers.component';




const routes: Routes = [
  {
    path: '',
    canActivate:[AuthGuard],
    component: AdministrationComponent,
    children: [
      {
        path: '',
        redirectTo: 'history',
        pathMatch: 'full'
      },
      {
        path: 'history',
        component : HistoryComponent,
        data : {
          role : ["admin"]
        }
      },
      {
        path: 'buyers',
        component : AddBuyerComponent,
        data : {
          role : ["admin"]
        }
      },
      {
        path: 'admins',
        component : AdminsComponent,
        data : {
          role : ["admin"]
        }
      },
      {
        path: 'suppliers',
        component : SuppliersComponent,
        data : {
          role : ["admin"]
        }
      }
    ]
  }
]

@NgModule({
  declarations: [
    AdministrationComponent,
    HistoryComponent,
    AddBuyerComponent,
    AdminsComponent,
    ShowUserDataComponent,
    SupplierFormComponent,
    SuppliersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FeahterIconModule,
    QuillModule.forRoot(), // ngx-quill
    ArchwizardModule, // angular-archwizard
    NgxMaskModule.forRoot({ validation: true }), // Ngx-mask
    NgSelectModule,
    MatStepperModule,
    CdkStepperModule,
    MatInputModule,
    NgxCsvParserModule,
    MatSnackBarModule,
    TranslateModule,
    NgxPaginationModule,
    MatIconModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbPaginationModule,
    NgbCollapseModule,
    MatCheckboxModule,
    MatDialogModule
  ]
})
export class AdministrationModule { }

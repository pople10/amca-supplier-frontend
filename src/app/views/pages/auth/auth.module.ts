import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {TranslateModule} from "@ngx-translate/core";
import { NgxMaskModule } from 'ngx-mask';
import { FeahterIconModule } from '../../../core/feather-icon/feather-icon.module';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NgSelectModule } from '@ng-select/ng-select';
import { ResetComponent } from './reset/reset.component';
import { SupplierRegisterComponent } from './supplier-register/supplier-register.component';
import { MatInputModule } from '@angular/material/input';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatStepperModule } from '@angular/material/stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { ArchwizardModule } from 'angular-archwizard';
import { QuillModule } from 'ngx-quill';
import { NgbCollapseModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'login/:lang',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'reset',
        component: ResetComponent
      },
      {
        path: 'reset/:vkey',
        component: ResetComponent
      },
      {
        path: 'register/supplier',
        component: SupplierRegisterComponent
      }
    ]
  },
]

@NgModule({
  declarations: [LoginComponent, RegisterComponent, AuthComponent, ResetComponent, SupplierRegisterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    TranslateModule,
    NgxMaskModule.forRoot({ validation: true}),
    FeahterIconModule,
    MatSnackBarModule,
    NgSelectModule,
    FeahterIconModule,
    QuillModule.forRoot(), // ngx-quill
    ArchwizardModule, // angular-archwizard
    NgxMaskModule.forRoot({ validation: true}), // Ngx-mask
    NgSelectModule,
    MatStepperModule,
    CdkStepperModule,
    MatInputModule,
    DropzoneModule,
    NgxCsvParserModule,
    MatSnackBarModule,
    TranslateModule,
    MatIconModule,
    NgxPaginationModule,
    SweetAlert2Module.forRoot(),
    NgbNavModule,
    NgbPaginationModule,
    NgbCollapseModule,
    NgbTooltipModule,
  ]
})
export class AuthModule { }

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
      }
    ]
  },
]

@NgModule({
  declarations: [LoginComponent, RegisterComponent, AuthComponent, ResetComponent],
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
    NgSelectModule
  ]
})
export class AuthModule { }

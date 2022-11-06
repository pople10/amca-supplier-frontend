import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportAuthorizationComponent } from './export-authorization.component';
import { NewExportAuthorizationComponent } from './new-export-authorization/new-export-authorization.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatStepperModule } from '@angular/material/stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { MatInputModule } from '@angular/material/input';
import { ArchwizardModule } from 'angular-archwizard';
import { DropzoneConfigInterface, DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { TranslateModule } from '@ngx-translate/core';


const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*',
  maxFiles : 1
};

const routes: Routes = [
  {
    path: '',
    component: ExportAuthorizationComponent,
    children: [
      {
        path: '',
        redirectTo: 'export-authorization',
        pathMatch: 'full'
      },
      {
        path: 'new-export-authorization',
        component: NewExportAuthorizationComponent
      }     
    ]
  }
]
@NgModule({
  declarations: [ExportAuthorizationComponent,NewExportAuthorizationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ArchwizardModule,
    NgSelectModule,
    MatStepperModule,
    CdkStepperModule,
    MatInputModule,
    TranslateModule
  ],
  providers : [
    {
      provide: DROPZONE_CONFIG,
      useValue:DEFAULT_DROPZONE_CONFIG
    },
  ]
})
export class ExportAuthorizationModule { }

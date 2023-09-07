
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
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import { ForumComponent } from './forum.component';
import { ForumAllComponent } from './forum-all/forum-all.component';
import { ForumUserComponent } from './forum-user/forum-user.component';
import { LayoutModule } from '../../layout/layout.module';



const routes: Routes = [
  {
    path: '',
    canActivate:[AuthGuard],
    component: ForumComponent,
    children: [
      {
        path: 'post/:id',
        component : ForumAllComponent,
        data : {
          role : ["admin","buyer","buyer_expert"]
        }
      },
      {
        path: '',
        component : ForumUserComponent,
        data : {
          role : ["admin","buyer","buyer_expert"]
        }
      },
    ]
  }
]

@NgModule({
  declarations: [
    ForumAllComponent,
    ForumUserComponent,
    ForumComponent
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
    MatDialogModule,
    LayoutModule
  ]
})
export class ForumModule { }




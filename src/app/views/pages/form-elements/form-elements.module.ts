import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FeahterIconModule } from '../../../core/feather-icon/feather-icon.module';

// ngx-quill
import { QuillModule } from 'ngx-quill';

// angular-archwizard
import { ArchwizardModule } from 'angular-archwizard';


import { FormElementsComponent } from './form-elements.component';
import { BasicElementsComponent } from './basic-elements/basic-elements.component';
import { EditorsComponent } from './editors/editors.component';
import { WizardComponent } from './wizard/wizard.component';
import { StarRatingComponent } from './star-rating/star-rating.component';

import {MatTooltipModule} from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: FormElementsComponent,
    children: [
      {
        path: '',
        redirectTo: 'basic-elements',
        pathMatch: 'full'
      },
      {
        path: 'basic-elements',
        component: BasicElementsComponent
      },
      {
        path: 'editors',
        component: EditorsComponent
      },
      {
        path: 'wizard',
        component: WizardComponent
      }
    ]
  }
]

@NgModule({
  declarations: [FormElementsComponent, BasicElementsComponent, EditorsComponent, WizardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FeahterIconModule,
    QuillModule.forRoot(), // ngx-quill
    ArchwizardModule, // angular-archwizard
    MatTooltipModule,
    MatButtonModule
  ]
})
export class FormElementsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyerRoutingModule } from './buyer-routing.module';
import { BuyerComponent } from './buyer.component';
import { SuppliersComponent } from './suppliers/suppliers/suppliers.component';

import { NgbDropdownModule, NgbCollapseModule, NgbPaginationModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import { SupplierComponent } from './supplier/supplier.component';
import { NgbAccordionModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

import { FeahterIconModule } from '../../../../core/feather-icon/feather-icon.module';
import { SuppliersRequestsComponent } from './suppliers-requests/suppliers-requests.component';
import { StarRatingComponent } from '../../form-elements/star-rating/star-rating.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatDividerModule} from '@angular/material/divider';
import { CommentsComponent } from './comments/comments.component';

import {MatSelectModule} from '@angular/material/select';




@NgModule({
  declarations: [BuyerComponent, SuppliersComponent, SupplierComponent, SuppliersRequestsComponent,StarRatingComponent, CommentsComponent],
  imports: [
    CommonModule,
    BuyerRoutingModule,
    NgbDropdownModule,
    MatCardModule,
    NgbCollapseModule,
    TranslateModule,
    MatIconModule,
    NgbAccordionModule,
    NgbTooltipModule,
    NgbNavModule,
    NgxPaginationModule,
    NgbNavModule,
    NgbPaginationModule,
    FormsModule,
    FeahterIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDividerModule,
    MatSelectModule
  ]
})
export class BuyerModule { }

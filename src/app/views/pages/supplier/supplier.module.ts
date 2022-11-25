import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierComponent } from './supplier.component';
import { MyDataComponent } from './my-data/my-data.component';
import { NgbAccordionModule, NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { BuyerModule } from '../buyer/buyer/buyer.module';
import { StarRatingComponent } from '../form-elements/star-rating/star-rating.component';


@NgModule({
  declarations: [SupplierComponent, MyDataComponent],
  imports: [
    CommonModule,
    SupplierRoutingModule,
    NgbDropdownModule,
    MatCardModule,
    NgbCollapseModule,
    TranslateModule,
    MatIconModule,
    NgbAccordionModule,
    NgbTooltipModule,
    NgbNavModule,
    NgxPaginationModule,
    NgbPaginationModule,
    FormsModule,
    FeahterIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDividerModule
  ]
})
export class SupplierModule { }

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



@NgModule({
  declarations: [BuyerComponent, SuppliersComponent, SupplierComponent, SuppliersRequestsComponent],
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
    FeahterIconModule
  ]
})
export class BuyerModule { }

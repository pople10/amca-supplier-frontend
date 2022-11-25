import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgbDropdownModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import {TranslateModule} from "@ngx-translate/core";

// Ng-ApexCharts
import { NgApexchartsModule } from "ng-apexcharts";

// Ng2-charts
import { ChartsModule } from 'ng2-charts';

import { DashboardComponent } from './dashboard.component';

import {MatCardModule} from "@angular/material/card";
import { StatsElementComponent } from './stats-element/stats-element.component';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
]

@NgModule({
  declarations: [DashboardComponent, StatsElementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    FeahterIconModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    ChartsModule,
    MatIconModule,
    TranslateModule,
    MatCardModule
  ]
})
export class DashboardModule { }

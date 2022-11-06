import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PublicPagesComponent } from './public-pages.component';
import { HomeComponent } from './home/home.component';
import {HomeCategorieComponent} from "./home-categorie/home-categorie.component";
import { PublicNavbarComponent } from './public-navbar/public-navbar.component';
import { NgbDropdownModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import { HomeArtistComponent } from './home-artist/home-artist.component';
import { HomePrizeComponent } from './home-prize/home-prize.component';


const routes: Routes = [
  {
    path: '',
    component: PublicPagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'Accueil',
        pathMatch: 'full'
      },
      {
        path: 'Accueil',
        component: HomeComponent
      },
      {
        path: 'categorie',
        component: HomeCategorieComponent
      },
      {
        path: 'artist',
        component: HomeArtistComponent
      },
      {
        path: 'prize-award',
        component: HomePrizeComponent
      },
      {
        path: 'export-authorization',
        component: HomeArtistComponent
      },
    ]
  },
]

@NgModule({
  declarations: [PublicPagesComponent, HomeComponent, PublicNavbarComponent, HomeCategorieComponent, HomeArtistComponent, HomePrizeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbDropdownModule,
    NgbCollapseModule,
    MatCardModule,
    MatIconModule,
    TranslateModule
  ]
})
export class PublicPagesModule { }

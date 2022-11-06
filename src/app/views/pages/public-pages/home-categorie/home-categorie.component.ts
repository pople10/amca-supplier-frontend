import { Component, OnInit } from '@angular/core';
import {LanguageService} from "../../../../services/language/language.service";


@Component({
  selector: 'app-home-categorie',
  templateUrl: './home-categorie.component.html',
  styleUrls: ['./home-categorie.component.scss']
})
export class HomeCategorieComponent implements OnInit {

  constructor(public languageService:LanguageService) { }

  ngOnInit(): void {
  }

}

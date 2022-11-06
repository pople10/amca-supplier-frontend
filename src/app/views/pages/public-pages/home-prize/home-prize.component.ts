import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-home-prize',
  templateUrl: './home-prize.component.html',
  styleUrls: ['./home-prize.component.scss']
})
export class HomePrizeComponent implements OnInit {

  constructor(public languageService:LanguageService) { }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language/language.service';
import { AlertifyService } from 'src/app/services/shared/alertify.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  thisYear: number = new Date().getFullYear();

  constructor(public languageService: LanguageService) { }

  ngOnInit(): void {

  }

}

import { Component, OnInit } from '@angular/core';
import { LanguageService } from './services/language/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'nobleui-angular';

  public constructor(private languageService:LanguageService)
  {
    this.languageService.initLanguage();
  }

  ngOnInit(): void {
  }

}

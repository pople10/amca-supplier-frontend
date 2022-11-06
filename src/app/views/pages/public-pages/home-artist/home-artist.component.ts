import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-home-artist',
  templateUrl: './home-artist.component.html',
  styleUrls: ['./home-artist.component.scss']
})
export class HomeArtistComponent implements OnInit {

  constructor(public languageService:LanguageService) { }

  ngOnInit(): void {
  }

}

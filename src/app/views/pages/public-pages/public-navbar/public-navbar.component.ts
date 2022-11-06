import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-public-navbar',
  templateUrl: './public-navbar.component.html',
  styleUrls: ['./public-navbar.component.scss']
})
export class PublicNavbarComponent implements OnInit {

  userDetails:any=null;
  img:string="assets/images/default_user.png";

  constructor(public domSanitizer: DomSanitizer,private languageService: LanguageService,private authService:AuthService) { }

  ngOnInit(): void {
    if(localStorage.getItem("userData") != null){
      this.userDetails = JSON.parse(localStorage.getItem("userData"));
      this.img=this.userDetails?.img;
    }
  }

  changeLanguage(language){
    this.languageService.setLanguage(language);
  }

  getCurrentLanguage(){
    return localStorage.getItem("userLanguage") ?? "fr";
  }

}

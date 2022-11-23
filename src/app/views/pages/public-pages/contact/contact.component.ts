import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  constructor(public languageService: LanguageService) { }

  ngOnInit(): void {
    this.setHeight();
    window.addEventListener("resize",()=>{
      this.setHeight();
    });
  }

  setHeight()
  {
    let contactEmail = document.getElementById("emailContact");
    let locationContact = document.getElementById("locationContact")
    if(!contactEmail||!locationContact)
      return;
    contactEmail.style.height=locationContact.offsetHeight+"px";
  }
}

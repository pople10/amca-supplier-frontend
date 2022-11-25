import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public static callbacks = [];

  private keyLanguage = 'userLanguage';
  private _userLanguage = '';

  public supportedLanguages = ['fr', 'ar'];

  constructor(private translate: TranslateService, @Inject(DOCUMENT) private document: Document) {
    this.initLanguage();
    this.translate.use(this._userLanguage);
    this.document.documentElement.lang = this._userLanguage;
  }

  changeStyle(lang)
  {
    /*setTimeout(()=>{
      if(!this.document.getElementsByTagName("body")[0])
        return;
      if(lang=="ar")
      {
        this.document.getElementsByTagName("body")[0].style.textAlign="right";
        this.document.getElementsByTagName("body")[0].style.direction="rtl";
      }
      else
      {
        this.document.getElementsByTagName("body")[0].style.textAlign="left";
        this.document.getElementsByTagName("body")[0].style.direction="ltr";
      }
    },200);*/
  }

  initLanguage(){
    const value = localStorage.getItem(this.keyLanguage);
    if(value != null){
      this._userLanguage = value;
    }else{
      const browserLanguage = navigator.language.split('-')[0];
      this._userLanguage = 'fr';
      if(this.supportedLanguages.includes(browserLanguage)){
        this._userLanguage = browserLanguage;
        localStorage.setItem(this.keyLanguage, browserLanguage);
      }
    }
    this.changeStyle(this._userLanguage);
  }

  setLanguage(language){
    this._userLanguage = language;
    localStorage.setItem(this.keyLanguage, this._userLanguage);
    this.translate.use(this._userLanguage);
    this.document.documentElement.lang = this._userLanguage;
    this.changeStyle(language);
    for(let i of LanguageService.callbacks)
    {
      i(this._userLanguage);
    }
  }

  get userLanguage(){
    return this._userLanguage;
  }

  getAvailableLanguage(){
    return this.supportedLanguages;
  }


}

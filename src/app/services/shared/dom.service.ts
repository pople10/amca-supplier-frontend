import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DOMService {

  constructor() { }

  copyToClipboard(str:string){
    const tempInput = document.createElement('input');
    tempInput.value = str;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }
}

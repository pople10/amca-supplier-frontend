import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  checkIfHasArguments(object:object,args:string[])
  {
      if(typeof object!="object")
        return false;
      for(let argument of args)
      {
        let tmp = object[argument];
        if(tmp===undefined||tmp===null)
          return false;
      }
      return true;
  }

  isFileImage(file) {
    return file && file['type'].split('/')[0] === 'image';
  }
}

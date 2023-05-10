import { Injectable } from '@angular/core';
import { ENV } from 'src/env';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  getPhotoPath(name):string{
    if(!name)
      name = "default.png";
    return `${ENV['backend-api-base-url']}/api/file/photo/${name}`;
  }
}

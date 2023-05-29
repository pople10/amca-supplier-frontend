import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENV } from 'src/env';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http:HttpClient) { }

  getPhotoPath(name):string{
    if(!name)
      return null;
    return `${ENV['backend-api-base-url']}/api/file/photo/${name}`;
  }

  uploadFile(data):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'text/plain'); 
    return this.http.post(`${ENV["backend-api-base-url"]}/api/file/upload/attachement`,data, { headers,responseType: 'text' });
  }
}

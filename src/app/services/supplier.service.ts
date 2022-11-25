import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENV } from 'src/env';
import { GenericPageable } from '../entities/generic-pageable';


@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private http:HttpClient) { }


  getMyData():Observable<any>
  {
      return this.http.get<any>(`${ENV["backend-api-base-url"]}/api/supplier/mine`);
  }
}

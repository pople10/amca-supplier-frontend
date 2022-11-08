import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnumModel } from 'src/app/entities/shared/EnumModel';
import { ENV } from 'src/env';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http:HttpClient) { }

  getSupplierConsts() :Observable<EnumModel[]> {
    return this.http.get<EnumModel[]>(`${ENV["backend-api-base-url"]}/enum/supplier`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENV } from 'src/env';
import { GenericPageable } from '../entities/generic-pageable';
import { Specification } from '../entities/Specification';

@Injectable({
  providedIn: 'root'
})
export class BuyerService {

  constructor(private http:HttpClient) { }

  getAllSuppliers():Observable<any[]>
  {
      return this.http.get<any[]>(`${ENV["backend-api-base-url"]}/api/buyer/suppliers`);
  }

  getSupplierById(id:number):Observable<any>
  {
      return this.http.get<any>(`${ENV["backend-api-base-url"]}/api/buyer/suppliers/${id}`);
  }

  getSuppliersWithPageAndSize(page:number,size:number,specification:Specification):Observable<GenericPageable<any>>
  {
    return this.http.post<GenericPageable<any>>(`${ENV["backend-api-base-url"]}/api/buyer/suppliers/page?page=${page}&size=${size}`,specification);
  }

  getApproveRequestsWithPageAndSize(page:number,size:number):Observable<GenericPageable<any>>
  {
    return this.http.get<GenericPageable<any>>(`${ENV["backend-api-base-url"]}/api/buyer/request/page?page=${page}&size=${size}`);
  }

  getSocialReasons():Observable<string[]>
  {
    return this.http.get<string[]>(`${ENV["backend-api-base-url"]}/api/buyer/suppliers/socialReason`);

  }

  approveRequest(id:number)
  {
    return this.http.put(`${ENV["backend-api-base-url"]}/api/buyer/request/${id}`,{});

  }
}

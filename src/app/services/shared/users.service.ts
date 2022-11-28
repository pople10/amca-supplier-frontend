import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from 'src/app/entities/auth/user-response';
import { BuyerRequest } from 'src/app/entities/BuyerRequest';
import { GenericPageable } from 'src/app/entities/generic-pageable';
import { SupplierRequest } from 'src/app/entities/SupplierRequest';
import { UserChatResponse } from 'src/app/entities/UserChatResponse';
import { UserRequest } from 'src/app/entities/UserRequest';
import { ENV } from 'src/env';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  createUserBuyer(data: any) {
    return this.http.post<any>(`${ENV["backend-api-base-url"]}/api/user/buyer`, data, {
      headers: new HttpHeaders().set('Content-type', 'application/json'),
    });  }
  createUser(data:any){
    return this.http.post<any>(`${ENV["backend-api-base-url"]}/api/user`, data, {
      headers: new HttpHeaders().set('Content-type', 'application/json'),
    });
  }
  updateUser(data:any,ref:string)
  {
    return this.http.put<any>(`${ENV["backend-api-base-url"]}/api/user/${ref}`, data, {
      headers: new HttpHeaders().set('Content-type', 'application/json'),
    });
  }
  getUser(ref:string):Observable<any>
  {
    return this.http.get<any>(`${ENV["backend-api-base-url"]}/api/user/${ref}`);
  }

  getUserWithPageAndSize(page: number, size: number) {
    return this.http.get<GenericPageable<UserResponse>>(`${ENV["backend-api-base-url"]}/api/user/page?page=${page}&size=${size}`);
  }

  deleteUser(refToDelete: string) {
    return this.http.delete<any>(`${ENV["backend-api-base-url"]}/api/user/${refToDelete}`);
  }

  lockUser(refToDelete: string) {
    return this.http.delete<any>(`${ENV["backend-api-base-url"]}/api/user/lock/${refToDelete}`);
  }

  unlockUser(refToDelete: string) {
    return this.http.put<any>(`${ENV["backend-api-base-url"]}/api/user/reactive/${refToDelete}`,{});
  }

  getSuppliersWithPageAndSize(page:number,size:number):Observable<GenericPageable<any>>
  {
    return this.http.get<GenericPageable<any>>(`${ENV["backend-api-base-url"]}/api/user/suppliers?page=${page}&size=${size}`);
  }

  getBuyersWithPageAndSize(page:number,size:number):Observable<GenericPageable<any>>
  {
    return this.http.get<GenericPageable<any>>(`${ENV["backend-api-base-url"]}/api/user/buyers?page=${page}&size=${size}`);
  }

  getAdminsWithPageAndSize(page:number,size:number):Observable<GenericPageable<any>>
  {
    return this.http.get<GenericPageable<any>>(`${ENV["backend-api-base-url"]}/api/user/admins?page=${page}&size=${size}`);
  }

  getSupplierById(id:number):Observable<SupplierRequest>
  {
    return this.http.get<SupplierRequest>(`${ENV["backend-api-base-url"]}/api/user/supplier/${id}`);
  }

  getBuyerById(id:number):Observable<BuyerRequest>
  {
    return this.http.get<BuyerRequest>(`${ENV["backend-api-base-url"]}/api/user/buyer/${id}`);
  }

  updateSupplierById(request:SupplierRequest,id:number):Observable<SupplierRequest>
  {
    return this.http.put<SupplierRequest>(`${ENV["backend-api-base-url"]}/api/user/supplier/${id}`,request);
  }

  updateBuyerById(request:BuyerRequest,id:number):Observable<BuyerRequest>
  {
    return this.http.put<BuyerRequest>(`${ENV["backend-api-base-url"]}/api/user/buyer/${id}`,request);
  }

  updateAdminById(request:UserRequest,id:number):Observable<UserRequest>
  {
    return this.http.put<UserRequest>(`${ENV["backend-api-base-url"]}/api/user/admin/${id}`,request);
  }

  createUserAdmin(data: any){
    return this.http.post<any>(`${ENV["backend-api-base-url"]}/api/user/admin`, data, {
      headers: new HttpHeaders().set('Content-type', 'application/json'),
    });
  }

  toggleBuyerExpert(id:number,expert:boolean)
  {
    return this.http.put<UserRequest>(`${ENV["backend-api-base-url"]}/api/user/buyer/${id}/expert/toggle`,{'expert':expert});
  }

  getUsersByKeyword(keyword:string)
  {
    return this.http.get<UserChatResponse[]>(`${ENV["backend-api-base-url"]}/api/user/${keyword}`);
  }

  constructor(private http:HttpClient) { }
}

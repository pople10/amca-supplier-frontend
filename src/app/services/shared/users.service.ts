import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericPageable } from 'src/app/entities/generic-pageable';
import { ENV } from 'src/env';

@Injectable({
  providedIn: 'root'
})
export class anyService {
  getRoles(ref: string) {
    return this.http.get<any>(`${ENV["backend-api-base-url"]}/account/admin/${ref}/roles`);
  }
  createUser(data:any){
    return this.http.post<any>(`${ENV["backend-api-base-url"]}/authentication/create-user`, data, {
      headers: new HttpHeaders().set('Content-type', 'application/json'),
    });
  }
  updateUser(data:any,ref:string)
  {
    return this.http.put<any>(`${ENV["backend-api-base-url"]}/account/admin/${ref}`, data, {
      headers: new HttpHeaders().set('Content-type', 'application/json'),
    });
  }
  getUser(ref:string):Observable<any>
  {
    return this.http.get<any>(`${ENV["backend-api-base-url"]}/account/admin/${ref}`);
  }
  getany():Observable<any[]>
  {
    return this.http.get<any[]>(`${ENV["backend-api-base-url"]}/account/admin/domains`);
  }
  getanyWithPageAndSize(page: number, size: number) {
    return this.http.get<GenericPageable>(`${ENV["backend-api-base-url"]}/account/admin?page=${page}&size=${size}`);
  }
  deleteUser(refToDelete: string) {
    return this.http.delete<any>(`${ENV["backend-api-base-url"]}/account/admin/${refToDelete}`);
  }

  assignRolesToUser(data:any)
  {
    return this.http.put<any>(`${ENV["backend-api-base-url"]}/account/admin/assign`, data, {
      headers: new HttpHeaders().set('Content-type', 'application/json'),
    });
  }

  constructor(private http:HttpClient) { }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from 'src/app/entities/auth/user-response';
import { GenericPageable } from 'src/app/entities/generic-pageable';
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
  getanyWithPageAndSize(page: number, size: number) {
    return this.http.get<GenericPageable<UserResponse>>(`${ENV["backend-api-base-url"]}/api/user/page?page=${page}&size=${size}`);
  }
  deleteUser(refToDelete: string) {
    return this.http.delete<any>(`${ENV["backend-api-base-url"]}/account/${refToDelete}`);
  }

  assignRolesToUser(data:any)
  {
    return this.http.put<any>(`${ENV["backend-api-base-url"]}/api/user/assign`, data, {
      headers: new HttpHeaders().set('Content-type', 'application/json'),
    });
  }

  constructor(private http:HttpClient) { }
}

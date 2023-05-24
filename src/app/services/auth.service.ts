import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponse } from '../entities/LoginResponse';
import {ENV} from "../../env";
import { RegisterModel } from '../entities/auth/register-model';
import { UserResponse } from '../entities/auth/user-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  updatePassword(data: any) {
    return this.http.put<any>(`${ENV["backend-api-base-url"]}/api/auth/password/change`, data, {
      headers: new HttpHeaders().set('Content-type', 'application/json'),
    });
  }

  userData$ = new BehaviorSubject<any>("");

  constructor(private http:HttpClient) { }

  login(loginData:any){
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<LoginResponse>(`${ENV["backend-api-base-url"]}/login`, 
    encodeURI(`username=${loginData.username}&password=${loginData.password}`), 
    { headers: new HttpHeaders().set('Content-type', 'application/x-www-form-urlencoded') });
  }

  register(data:RegisterModel)
  {
    return this.http.post<any>(`${ENV["backend-api-base-url"]}/auth/register/buyer`, data, {
      headers: new HttpHeaders().set('Content-type', 'application/json'),
    });
  }

  registerSupplier(data:any)
  {
    return this.http.post<any>(`${ENV["backend-api-base-url"]}/auth/register/supplier`, data, {
      headers: new HttpHeaders().set('Content-type', 'application/json'),
    });
  }

  askToReset(data:any)
  {
    return this.http.post<any>(`${ENV["backend-api-base-url"]}/auth/register/reset`, data, {
      headers: new HttpHeaders().set('Content-type', 'application/json'),
    });
  }

  reset(data:any)
  {
    return this.http.put<any>(`${ENV["backend-api-base-url"]}/auth/register/reset/change`, data, {
      headers: new HttpHeaders().set('Content-type', 'application/json'),
    });
  }

  setUserData(data){
    this.userData$.next(data);
  }

  getUserData(){
     this.userData$.subscribe((res)=>{
       return res;
     });
  }
  

  updateProfile(data:any)
  {
    return this.http.put<any>(`${ENV["backend-api-base-url"]}/api/auth/profile/change`, data, {
      headers: new HttpHeaders().set('Content-type', 'application/json'),
    });
  }

  updatePhoto(file:any)
  {
    const formData = new FormData();
    formData.append('photo',file);   
    return this.http.post(`${ENV["backend-api-base-url"]}/account/profile/photo/update`, formData,{ responseType: 'text' });
  }

  isLoggedIn()
  {
    return localStorage.getItem("token")!=null
    && localStorage.getItem("userData")!=null;
  }

  logOut()
  {
    localStorage.removeItem("token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("userData");
    localStorage.removeItem("expiredAt");
  }

  getToken()
  {
    return localStorage.getItem("token");
  }

  getUserDataLocalStorage()
  {
    return JSON.parse(localStorage.getItem("userData"));
  }

  getEmailLocalStorage()
  {
    let user = this.getUserDataLocalStorage();
    return user?user.email:null;
  }

  updateData(newData:any)
  {
    let old:any=JSON.parse(localStorage.getItem("userData"));
    if(newData["email"])
    {
      newData["user"]=newData["email"];
      delete newData["email"];
    }
    if(newData["firstname"]&&newData["lastname"])
      newData["fullname"]=newData["firstname"]+" "+newData["lastname"]?.toUpperCase();
    if(newData["token"])
    {
      localStorage.setItem("token",newData["token"]);
      delete newData["token"];
    }
    localStorage.setItem("userData",JSON.stringify({...old,...newData}));
  }

  getMe():Observable<UserResponse>
  {
    return this.http.get<UserResponse>(`${ENV["backend-api-base-url"]}/api/auth/me`);
  }

  uploadPhoto(data):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post<any>(`${ENV["backend-api-base-url"]}/api/auth/photo`,data, { headers });
  }
}

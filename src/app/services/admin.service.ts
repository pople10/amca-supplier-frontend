import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENV } from 'src/env';
import { AuditResponse } from '../entities/AuditResponse';
import { GenericPageable } from '../entities/generic-pageable';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }

  getAllAudit(page:number,size:number):Observable<GenericPageable<AuditResponse>>
  {
      return this.http.get<GenericPageable<AuditResponse>>(`${ENV["backend-api-base-url"]}/api/audit?page=${page}&size=${size}`);
  }
}

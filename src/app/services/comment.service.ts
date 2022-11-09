import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENV } from 'src/env';
import { CommentRequest } from '../entities/CommentRequest';
import { CommentResponse } from '../entities/CommentResponse';
import { GenericPageable } from '../entities/generic-pageable';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http:HttpClient) { }

  getMyComment(id:number):Observable<CommentResponse>
  {
      return this.http.get<CommentResponse>(`${ENV["backend-api-base-url"]}/api/buyer/comment/supplier/${id}`);
  }

  getMyComments(page:number,size:number):Observable<GenericPageable<CommentResponse>>
  {
      return this.http.get<GenericPageable<CommentResponse>>(`${ENV["backend-api-base-url"]}/api/buyer/comment?page=${page}&size=${size}`);
  }

  addComment(data:CommentRequest):Observable<CommentResponse>
  {
      return this.http.post<CommentResponse>(`${ENV["backend-api-base-url"]}/api/buyer/comment`,data);
  }

  updateComment(id:number,data:CommentRequest):Observable<CommentResponse>
  {
    return this.http.put<CommentResponse>(`${ENV["backend-api-base-url"]}/api/buyer/comment/${id}`,data);
  }

  getCommentById(id:number):Observable<CommentResponse>
  {
    return this.http.get<CommentResponse>(`${ENV["backend-api-base-url"]}/api/buyer/comment/${id}`);
  }

  deleteCommentById(id:number):Observable<void>
  {
    return this.http.delete<void>(`${ENV["backend-api-base-url"]}/api/buyer/comment/${id}`);

  }
}

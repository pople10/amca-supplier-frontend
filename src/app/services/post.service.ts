// post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostRequest } from '../entities/PostRequest';
import { UnitPostResponse, PostResponse } from '../entities/UnitPostResponse';
import { ENV } from '../../env';


@Injectable({
  providedIn: 'root',
})
export class PostService {

  private baseUrl = ENV["backend-api-base-url"]; 
  constructor(private http: HttpClient) {}

  createPost(post: PostRequest): Observable<UnitPostResponse> {
    return this.http.post<UnitPostResponse>(`${this.baseUrl}/api/forum/post`, post);
  }

  updatePost(post: PostRequest): Observable<UnitPostResponse> {
    return this.http.put<UnitPostResponse>(`${this.baseUrl}/api/forum/post/${post.id}`, post);
  }

  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/forum/post/${postId}`);
  }

  getPost(postId: number): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${this.baseUrl}/api/forum/post/${postId}`);
  }

  getPosts(page:number,size:number,sortType:string,keyword:string): Observable<any> {
    let param = keyword?`&keyword=${keyword}`:"";
    return this.http.get<UnitPostResponse[]>(`${this.baseUrl}/api/forum/posts?page=${page}&size=${size}&sortType=${sortType}${param}`);
  }
  
  
    // PUT /api/forum/comment/{id}
    updateComment(commentId: number, updatedComment: any): Observable<any> {
      return this.http.put<any>(`${this.baseUrl}/api/forum/comment/${commentId}`, updatedComment);
    }
  
    // DELETE /api/forum/comment/{id}
    deleteComment(commentId: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/api/forum/comment/${commentId}`);
    }
  
    // PUT /api/forum/comment/{id}/like
    likeComment(commentId: number,isLike:boolean): Observable<any> {
      if(isLike) return this.http.put<any>(`${this.baseUrl}/api/forum/comment/${commentId}/like`, {});
      return this.http.delete<any>(`${this.baseUrl}/api/forum/comment/${commentId}/like`);
    }
  
    // DELETE /api/forum/comment/{id}/like
    unlikeComment(commentId: number): Observable<any> {
      return this.http.delete<any>(`${this.baseUrl}/api/forum/comment/${commentId}/like`);
    }
  
    // POST /api/forum/comment/{id}/reply
    addReplyToComment(commentId: number, reply: any): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}/api/forum/comment/${commentId}/reply`, reply);
    }
  
    // POST /api/forum/post/{id}/comment
    addCommentToPost(postId: number, comment: any): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}/api/forum/post/${postId}/comment`, comment);
    }
  
    // PUT /api/forum/post/{id}/like
    likePost(postId: number,isLike:boolean): Observable<any> {
      if(isLike)return this.http.put<any>(`${this.baseUrl}/api/forum/post/${postId}/like`, {});
      return this.http.delete<any>(`${this.baseUrl}/api/forum/post/${postId}/like`);
    }
  
    // DELETE /api/forum/post/{id}/like
    unlikePost(postId: number): Observable<any> {
      return this.http.delete<any>(`${this.baseUrl}/api/forum/post/${postId}/like`);
    }
  
    // PUT /api/forum/reply/{id}
    updateReply(replyId: number, updatedReply: any): Observable<any> {
      return this.http.put<any>(`${this.baseUrl}/api/forum/reply/${replyId}`, updatedReply);
    }
  
    // DELETE /api/forum/reply/{id}
    deleteReply(replyId: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/api/forum/reply/${replyId}`);
    }
  
    // PUT /api/forum/reply/{id}/like
    likeReply(replyId: number,isLike:boolean): Observable<any> {
      if(isLike) return this.http.put<any>(`${this.baseUrl}/api/forum/reply/${replyId}/like`, {});
      return this.http.delete<any>(`${this.baseUrl}/api/forum/reply/${replyId}/like`);
    }
  
    // DELETE /api/forum/reply/{id}/like
    unlikeReply(replyId: number): Observable<any> {
      return this.http.delete<any>(`${this.baseUrl}/api/forum/reply/${replyId}/like`);
    }
  }
  


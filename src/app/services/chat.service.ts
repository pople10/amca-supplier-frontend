import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENV } from 'src/env';
import { GenericPageable } from '../entities/generic-pageable';
import { RoomRequest } from '../entities/RoomRequest';
import { RoomResponse } from '../entities/RoomResponse';
import { UserChatResponse } from '../entities/UserChatResponse';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http:HttpClient,private authService:AuthService) { }

  getMyRooms(page:number,size:number):Observable<GenericPageable<RoomResponse>>
  {
      return this.http.get<GenericPageable<RoomResponse>>(`${ENV["backend-api-base-url"]}/api/chat/rooms?page=${page}&size=${size}`);
  }

  getUsersByKeyword(keyword:string)
  {
    return this.http.get<UserChatResponse[]>(`${ENV["backend-api-base-url"]}/api/chat/user/${keyword}`);
  }

  addRoom(data:RoomRequest)
  {
    return this.http.post<RoomResponse>(`${ENV["backend-api-base-url"]}/api/chat/room`,data);
  }

  addPersons(data:RoomRequest,id:number):Observable<RoomResponse>
  {
    return this.http.put<RoomResponse>(`${ENV["backend-api-base-url"]}/api/chat/room/${id}`,data);
  }

  deletePersons(id:number,email:string):Observable<RoomResponse>
  {
    return this.http.delete<RoomResponse>(`${ENV["backend-api-base-url"]}/api/chat/room/${id}/persons/${email}`);
  }
    
  closeRoom(id:number)
  {
    return this.http.delete<void>(`${ENV["backend-api-base-url"]}/api/chat/room/${id}`);
  }

  getRoom(id:number)
  {
    return this.http.get<RoomResponse>(`${ENV["backend-api-base-url"]}/api/chat/room/${id}`);
  }

  getRoomWebSocket(id:number)
  {
    return new WebSocket(`${ENV["backend-api-websocket-url"]}/ws/chat/${id}?token=${this.authService.getToken()}&service=chat`);
  }
}

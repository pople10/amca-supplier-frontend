import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENV } from 'src/env';
import { GenericPageable } from '../entities/generic-pageable';
import { RoomResponse } from '../entities/RoomResponse';
import { UserChatResponse } from '../entities/UserChatResponse';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http:HttpClient) { }

  getMyRooms(page:number,size:number):Observable<GenericPageable<RoomResponse>>
  {
      return this.http.get<GenericPageable<RoomResponse>>(`${ENV["backend-api-base-url"]}/api/chat/rooms?page=${page}&size=${size}`);
  }

  getUsersByKeyword(keyword:string)
  {
    return this.http.get<UserChatResponse[]>(`${ENV["backend-api-base-url"]}/api/chat/user/${keyword}`);
  }

  addRoom(emails:string[])
  {
    return this.http.post<RoomResponse>(`${ENV["backend-api-base-url"]}/api/chat/room`,{emails});
  }

  addPersons(emails:string[],id:number)
  {
    return this.http.put<RoomResponse>(`${ENV["backend-api-base-url"]}/api/chat/room/${id}`,{emails});
  }
    
  closeRoom(id:number)
  {
    return this.http.delete<void>(`${ENV["backend-api-base-url"]}/api/chat/room/${id}`);
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnumModel } from 'src/app/entities/shared/EnumModel';
import { ENV } from 'src/env';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http:HttpClient,private authService:AuthService) { }

  getSupplierConsts() :Observable<EnumModel[]> {
    return this.http.get<EnumModel[]>(`${ENV["backend-api-base-url"]}/enum/supplier`);
  }

  getNotificationWebSocket()
  {
    return new WebSocket(`${ENV["backend-api-websocket-url"]}/ws/notification?token=${this.authService.getToken()}&service=notification`);
  }
}

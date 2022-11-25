import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENV } from 'src/env';
import { StatsticsModel } from '../entities/stats/StatisticsModel';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http:HttpClient) { }

  getStatsAdmin():Observable<StatsticsModel>
  {
      return this.http.get<StatsticsModel>(`${ENV["backend-api-base-url"]}/api/stats/admin`);
  }
}

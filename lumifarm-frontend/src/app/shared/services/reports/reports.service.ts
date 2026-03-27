import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DashboardStats } from '../../interfaces/models';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`);
  }

  getRevenue(year?: number): Observable<any> {
    const params: Record<string, string> = {};
    if (year) params['year'] = year.toString();
    return this.http.get<any>(`${this.apiUrl}/revenue`, { params });
  }

  getOccupancy(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/occupancy`);
  }

  getLeaseExpiry(days?: number): Observable<any> {
    const params: Record<string, string> = {};
    if (days) params['days'] = days.toString();
    return this.http.get<any>(`${this.apiUrl}/lease-expiry`, { params });
  }

  getDamages(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/damages`);
  }
}

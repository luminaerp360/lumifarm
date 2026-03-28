import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Equipment, PaginatedResponse } from '../../interfaces/models';

@Injectable({ providedIn: 'root' })
export class EquipmentService {
  private apiUrl = `${environment.apiUrl}/equipment`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 20, search?: string, status?: string, category?: string): Observable<PaginatedResponse<Equipment>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);
    if (category) params = params.set('category', category);
    return this.http.get<PaginatedResponse<Equipment>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.apiUrl}/${id}`);
  }

  getByFarm(farmId: string): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.apiUrl}/farm/${farmId}`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  getMaintenanceDue(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.apiUrl}/maintenance-due`);
  }

  create(data: Partial<Equipment>): Observable<Equipment> {
    return this.http.post<Equipment>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Equipment>): Observable<Equipment> {
    return this.http.put<Equipment>(`${this.apiUrl}/${id}`, data);
  }

  addMaintenance(id: string, data: any): Observable<Equipment> {
    return this.http.put<Equipment>(`${this.apiUrl}/${id}/maintenance`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

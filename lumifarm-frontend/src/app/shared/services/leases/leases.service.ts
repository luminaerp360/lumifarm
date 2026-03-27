import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Lease, PaginatedResponse } from '../../interfaces/models';

@Injectable({ providedIn: 'root' })
export class LeasesService {
  private apiUrl = `${environment.apiUrl}/leases`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 20, search?: string, status?: string): Observable<PaginatedResponse<Lease>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);
    return this.http.get<PaginatedResponse<Lease>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Lease> {
    return this.http.get<Lease>(`${this.apiUrl}/${id}`);
  }

  getByProperty(propertyId: string): Observable<Lease[]> {
    return this.http.get<Lease[]>(`${this.apiUrl}/by-property/${propertyId}`);
  }

  getByTenant(propertyTenantId: string): Observable<Lease[]> {
    return this.http.get<Lease[]>(`${this.apiUrl}/by-tenant/${propertyTenantId}`);
  }

  getExpiringSoon(days = 30): Observable<Lease[]> {
    return this.http.get<Lease[]>(`${this.apiUrl}/expiring-soon`, { params: { days } });
  }

  create(data: Partial<Lease>): Observable<Lease> {
    return this.http.post<Lease>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Lease>): Observable<Lease> {
    return this.http.put<Lease>(`${this.apiUrl}/${id}`, data);
  }

  activate(id: string): Observable<Lease> {
    return this.http.put<Lease>(`${this.apiUrl}/${id}/activate`, {});
  }

  terminate(id: string, reason: string): Observable<Lease> {
    return this.http.put<Lease>(`${this.apiUrl}/${id}/terminate`, { reason });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
}

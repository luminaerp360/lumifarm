import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CropIssue, PaginatedResponse } from '../../interfaces/models';

@Injectable({ providedIn: 'root' })
export class CropIssuesService {
  private apiUrl = `${environment.apiUrl}/crop-issues`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 20, search?: string, status?: string, severity?: string): Observable<PaginatedResponse<CropIssue>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);
    if (severity) params = params.set('severity', severity);
    return this.http.get<PaginatedResponse<CropIssue>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<CropIssue> {
    return this.http.get<CropIssue>(`${this.apiUrl}/${id}`);
  }

  getUnresolved(): Observable<CropIssue[]> {
    return this.http.get<CropIssue[]>(`${this.apiUrl}/unresolved`);
  }

  getCritical(): Observable<CropIssue[]> {
    return this.http.get<CropIssue[]>(`${this.apiUrl}/critical`);
  }

  create(data: Partial<CropIssue>): Observable<CropIssue> {
    return this.http.post<CropIssue>(this.apiUrl, data);
  }

  update(id: string, data: Partial<CropIssue>): Observable<CropIssue> {
    return this.http.put<CropIssue>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
}

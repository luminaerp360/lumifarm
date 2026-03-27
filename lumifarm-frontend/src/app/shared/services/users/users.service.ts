import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RentiumUser, PaginatedResponse, PermissionsResponse } from '../../interfaces/models';

export interface SaveUserPayload {
  name: string;
  email: string;
  phone?: string;
  role: string;
  password?: string;
  isActive?: boolean;
  tenantIds?: string[];
  activeTenantId?: string;
  permissions?: string[];
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 50, search = ''): Observable<PaginatedResponse<RentiumUser>> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<PaginatedResponse<RentiumUser>>(`${this.apiUrl}/users`, { params });
  }

  getById(id: string): Observable<RentiumUser> {
    return this.http.get<RentiumUser>(`${this.apiUrl}/users/${id}`);
  }

  create(data: SaveUserPayload): Observable<RentiumUser> {
    return this.http.post<RentiumUser>(`${this.apiUrl}/users`, data);
  }

  invite(data: SaveUserPayload): Observable<RentiumUser> {
    return this.http.post<RentiumUser>(`${this.apiUrl}/invite`, data);
  }

  update(id: string, data: Partial<SaveUserPayload>): Observable<RentiumUser> {
    return this.http.put<RentiumUser>(`${this.apiUrl}/users/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/users/${id}`);
  }

  approve(userId: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/users/${userId}/approve`, {});
  }

  reject(userId: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/users/${userId}/reject`, {});
  }

  getPermissions(): Observable<PermissionsResponse> {
    return this.http.get<PermissionsResponse>(`${this.apiUrl}/permissions`);
  }

  searchAll(query: string): Observable<RentiumUser[]> {
    const params = new HttpParams().set('q', query.trim());
    return this.http.get<RentiumUser[]>(`${this.apiUrl}/users/search-all`, { params });
  }

  getTenantMembers(tenantId: string): Observable<RentiumUser[]> {
    return this.http.get<RentiumUser[]>(`${this.apiUrl}/tenants/${tenantId}/members`);
  }

  addToTenant(userId: string, tenantId: string): Observable<RentiumUser> {
    return this.http.post<RentiumUser>(`${this.apiUrl}/users/${userId}/add-to-tenant`, { tenantId });
  }

  removeFromTenant(userId: string, tenantId: string): Observable<RentiumUser> {
    return this.http.post<RentiumUser>(`${this.apiUrl}/users/${userId}/remove-from-tenant`, { tenantId });
  }
}

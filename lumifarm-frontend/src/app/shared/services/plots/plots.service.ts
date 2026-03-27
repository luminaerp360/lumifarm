import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

export interface Unit {
  _id?: string;
  tenantId?: string;
  farmId: string;
  plotNumber: string;
  description?: string;
  status: string;
  areaInAcres: number;
  cropType?: string;
  soilQuality?: string;
  costToOperatePerCycle?: number;
  currency?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({ providedIn: "root" })
export class PlotsService {
  private apiUrl = `${environment.apiUrl}/plots`;

  constructor(private http: HttpClient) {}

  getAll(
    page = 1,
    limit = 20,
    farmId?: string,
    status?: string,
    search?: string,
  ): Observable<PaginatedResponse<Unit>> {
    let params = new HttpParams().set("page", page).set("limit", limit);
    if (farmId) params = params.set("farmId", farmId);
    if (status) params = params.set("status", status);
    if (search) params = params.set("search", search);
    return this.http.get<PaginatedResponse<Unit>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Unit> {
    return this.http.get<Unit>(`${this.apiUrl}/${id}`);
  }

  getByFarm(farmId: string): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiUrl}/farm/${farmId}`);
  }

  create(data: Partial<Unit>): Observable<Unit> {
    return this.http.post<Unit>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Unit>): Observable<Unit> {
    return this.http.put<Unit>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
}

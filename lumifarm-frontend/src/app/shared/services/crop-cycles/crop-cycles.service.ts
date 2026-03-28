import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { CropCycle, PaginatedResponse } from "../../interfaces/models";

@Injectable({ providedIn: "root" })
export class CropCyclesService {
  private apiUrl = `${environment.apiUrl}/crop-cycles`;

  constructor(private http: HttpClient) {}

  getAll(
    page = 1,
    limit = 20,
    search?: string,
    status?: string,
  ): Observable<PaginatedResponse<CropCycle>> {
    let params = new HttpParams().set("page", page).set("limit", limit);
    if (search) params = params.set("search", search);
    if (status) params = params.set("status", status);
    return this.http.get<PaginatedResponse<CropCycle>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<CropCycle> {
    return this.http.get<CropCycle>(`${this.apiUrl}/${id}`);
  }

  getByFarm(farmId: string): Observable<CropCycle[]> {
    return this.http.get<CropCycle[]>(`${this.apiUrl}/by-property/${farmId}`);
  }

  create(data: Partial<CropCycle>): Observable<CropCycle> {
    return this.http.post<CropCycle>(this.apiUrl, data);
  }

  update(id: string, data: Partial<CropCycle>): Observable<CropCycle> {
    return this.http.put<CropCycle>(`${this.apiUrl}/${id}`, data);
  }

  activate(id: string): Observable<CropCycle> {
    return this.http.put<CropCycle>(`${this.apiUrl}/${id}/activate`, {});
  }

  terminate(id: string, reason: string): Observable<CropCycle> {
    return this.http.put<CropCycle>(`${this.apiUrl}/${id}/terminate`, {
      reason,
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
}

import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { CropActivity, PaginatedResponse } from "../../interfaces/models";

@Injectable({ providedIn: "root" })
export class CropActivitiesService {
  private apiUrl = `${environment.apiUrl}/crop-activities`;

  constructor(private http: HttpClient) {}

  getAll(
    page = 1,
    limit = 20,
    search?: string,
    status?: string,
    cropCycleId?: string,
    activityType?: string,
  ): Observable<PaginatedResponse<CropActivity>> {
    let params = new HttpParams().set("page", page).set("limit", limit);
    if (search) params = params.set("search", search);
    if (status) params = params.set("status", status);
    if (cropCycleId) params = params.set("cropCycleId", cropCycleId);
    if (activityType) params = params.set("activityType", activityType);
    return this.http.get<PaginatedResponse<CropActivity>>(this.apiUrl, {
      params,
    });
  }

  getById(id: string): Observable<CropActivity> {
    return this.http.get<CropActivity>(`${this.apiUrl}/${id}`);
  }

  getByCropCycle(cropCycleId: string): Observable<CropActivity[]> {
    return this.http.get<CropActivity[]>(`${this.apiUrl}/cycle/${cropCycleId}`);
  }

  getCycleSummary(cropCycleId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cycle/${cropCycleId}/summary`);
  }

  getUpcoming(days = 7): Observable<CropActivity[]> {
    return this.http.get<CropActivity[]>(`${this.apiUrl}/upcoming`, {
      params: { days },
    });
  }

  getOverdue(): Observable<CropActivity[]> {
    return this.http.get<CropActivity[]>(`${this.apiUrl}/overdue`);
  }

  create(data: Partial<CropActivity>): Observable<CropActivity> {
    return this.http.post<CropActivity>(this.apiUrl, data);
  }

  update(id: string, data: Partial<CropActivity>): Observable<CropActivity> {
    return this.http.put<CropActivity>(`${this.apiUrl}/${id}`, data);
  }

  complete(id: string, data: Partial<CropActivity>): Observable<CropActivity> {
    return this.http.put<CropActivity>(`${this.apiUrl}/${id}/complete`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
}

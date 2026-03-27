import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({ providedIn: "root" })
export class TasksService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getAll(
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: string,
    priority?: string,
    category?: string,
    assignedToId?: string,
    farmId?: string,
    cropCycleId?: string,
  ): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("limit", limit.toString());
    if (search) params = params.set("search", search);
    if (status) params = params.set("status", status);
    if (priority) params = params.set("priority", priority);
    if (category) params = params.set("category", category);
    if (assignedToId) params = params.set("assignedToId", assignedToId);
    if (farmId) params = params.set("farmId", farmId);
    if (cropCycleId) params = params.set("cropCycleId", cropCycleId);
    return this.http.get(this.apiUrl, { params });
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getUpcoming(days: number = 7): Observable<any> {
    return this.http.get(`${this.apiUrl}/upcoming`, {
      params: new HttpParams().set("days", days.toString()),
    });
  }

  getOverdue(): Observable<any> {
    return this.http.get(`${this.apiUrl}/overdue`);
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getByCropCycle(cropCycleId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/cycle/${cropCycleId}`);
  }

  getByWorker(workerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/worker/${workerId}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  complete(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/complete`, {});
  }

  cancel(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/cancel`, {});
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

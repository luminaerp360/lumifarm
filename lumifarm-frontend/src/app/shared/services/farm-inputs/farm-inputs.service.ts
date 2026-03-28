import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  FarmInput,
  FarmInputSummary,
  PaginatedResponse,
} from "../../interfaces/models";

@Injectable({ providedIn: "root" })
export class FarmInputsService {
  private apiUrl = `${environment.apiUrl}/farm-inputs`;

  constructor(private http: HttpClient) {}

  getAll(
    page = 1,
    limit = 20,
    cropCycleId?: string,
    category?: string,
    search?: string,
  ): Observable<PaginatedResponse<FarmInput>> {
    let params = new HttpParams().set("page", page).set("limit", limit);
    if (cropCycleId) params = params.set("cropCycleId", cropCycleId);
    if (category) params = params.set("category", category);
    if (search) params = params.set("search", search);
    return this.http.get<PaginatedResponse<FarmInput>>(this.apiUrl, { params });
  }

  getByCropCycle(cropCycleId: string): Observable<FarmInput[]> {
    return this.http.get<FarmInput[]>(`${this.apiUrl}/cycle/${cropCycleId}`);
  }

  getSummary(cropCycleId: string): Observable<FarmInputSummary> {
    return this.http.get<FarmInputSummary>(
      `${this.apiUrl}/cycle/${cropCycleId}/summary`,
    );
  }

  getById(id: string): Observable<FarmInput> {
    return this.http.get<FarmInput>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<FarmInput>): Observable<FarmInput> {
    return this.http.post<FarmInput>(this.apiUrl, data);
  }

  update(id: string, data: Partial<FarmInput>): Observable<FarmInput> {
    return this.http.put<FarmInput>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

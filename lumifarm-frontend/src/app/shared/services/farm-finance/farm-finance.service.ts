import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  FarmFinance,
  FinancialSummary,
  PaginatedResponse,
} from "../../interfaces/models";

@Injectable({ providedIn: "root" })
export class FarmFinanceService {
  private apiUrl = `${environment.apiUrl}/farm-finance`;

  constructor(private http: HttpClient) {}

  getAll(
    page = 1,
    limit = 20,
    search?: string,
    transactionType?: string,
    category?: string,
  ): Observable<PaginatedResponse<FarmFinance>> {
    let params = new HttpParams().set("page", page).set("limit", limit);
    if (search) params = params.set("search", search);
    if (transactionType)
      params = params.set("transactionType", transactionType);
    if (category) params = params.set("category", category);
    return this.http.get<PaginatedResponse<FarmFinance>>(this.apiUrl, {
      params,
    });
  }

  getById(id: string): Observable<FarmFinance> {
    return this.http.get<FarmFinance>(`${this.apiUrl}/${id}`);
  }

  getSummary(): Observable<FinancialSummary> {
    return this.http.get<FinancialSummary>(`${this.apiUrl}/summary`);
  }

  getExpenses(): Observable<FarmFinance[]> {
    return this.http.get<FarmFinance[]>(`${this.apiUrl}/expenses`);
  }

  getIncome(): Observable<FarmFinance[]> {
    return this.http.get<FarmFinance[]>(`${this.apiUrl}/income`);
  }

  getPendingPayments(): Observable<FarmFinance[]> {
    return this.http.get<FarmFinance[]>(`${this.apiUrl}/pending-payments`);
  }

  getOverduePayments(): Observable<FarmFinance[]> {
    return this.http.get<FarmFinance[]>(`${this.apiUrl}/overdue-payments`);
  }

  create(data: Partial<FarmFinance>): Observable<FarmFinance> {
    return this.http.post<FarmFinance>(this.apiUrl, data);
  }

  update(id: string, data: Partial<FarmFinance>): Observable<FarmFinance> {
    return this.http.put<FarmFinance>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

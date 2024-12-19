import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from './common/api-response.interface';
import { Item } from './item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private baseUrl = `${environment.apiUrl}/items`;

  constructor(private http: HttpClient) { }

  getAllItems(options: GetOptions): Observable<ApiResponse<Item[]>> {
    let params = new HttpParams();
    Object.entries(options).forEach(([key, value]) => {
      params = params.append(key, value.toString());
    });

    return this.http.get<ApiResponse<Item[]>>(this.baseUrl, { params });
  }

  getItemById(id: string): Observable<ApiResponse<Item>> {
    return this.http.get<ApiResponse<Item>>(`${this.baseUrl}/${id}`);
  }

  createItem(body: any): Observable<ApiResponse<Item>> {
    return this.http.post<ApiResponse<Item>>(this.baseUrl, body);
  }

  updateItem(id: string, body: any): Observable<ApiResponse<Item>> {
    return this.http.put<ApiResponse<Item>>(`${this.baseUrl}/${id}`, body);
  }

  deleteItem(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }
}

export interface GetOptions {
  limit?: number;
  offset?: number;
  search?: string;
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../item/common/api-response.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  private baseUrl = `${environment.apiUrl}/lookups`;

  constructor(private http: HttpClient) { }

  getItems(type?: 'unit'): Observable<ApiResponse<{ id: string, name: string }[]>> {
    if (type) {
      return this.http.get<ApiResponse<{ id: string, name: string }[]>>(`${this.baseUrl}/items?type=unit`);
    }
    return this.http.get<ApiResponse<{ id: string, name: string }[]>>(`${this.baseUrl}/items`);
  }

}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../item/common/api-response.interface';
import { GetOptions } from '../item/item.service';
import { Client } from './client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) { }

  getAllClients(options: GetOptions): Observable<ApiResponse<Client[]>> {
    let params = new HttpParams();
    Object.entries(options).forEach(([key, value]) => {
      params = params.append(key, value.toString());
    });

    return this.http.get<ApiResponse<Client[]>>(this.baseUrl, { params });
  }

  getClientById(id: string): Observable<ApiResponse<Client>> {
    return this.http.get<ApiResponse<Client>>(`${this.baseUrl}/${id}`);
  }

  createClient(body: any): Observable<ApiResponse<Client>> {
    return this.http.post<ApiResponse<Client>>(this.baseUrl, body);
  }

  updateClient(id: string, body: any): Observable<ApiResponse<Client>> {
    return this.http.put<ApiResponse<Client>>(`${this.baseUrl}/${id}`, body);
  }

  deleteClient(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }

  deleteClientFile(id: string, filename: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}/files/${filename}`);
  }
}

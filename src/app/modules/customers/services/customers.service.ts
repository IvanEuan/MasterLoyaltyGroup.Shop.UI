import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {Customer} from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {

  private httpClient = inject(HttpClient);

  private baseUrl = `${environment.apiUrl}/customers`;

  public save(customer: Customer): Observable<number> {
    return this.httpClient.post<number>(`${this.baseUrl}/save`, customer);
  }

  public delete(id: number): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/delete`, { id });
  }

  public getAll(): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>(`${this.baseUrl}/get-all`);
  }
}

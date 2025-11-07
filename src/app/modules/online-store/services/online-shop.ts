import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Customer} from '../../customers/models/customer.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OnlineShop {

  private httpClient = inject(HttpClient);

  private baseUrl = `${environment.apiUrl}/online-shop`;

  public save(products: number[]): Observable<number> {
    return this.httpClient.post<number>(`${this.baseUrl}/save`, { products });
  }
}

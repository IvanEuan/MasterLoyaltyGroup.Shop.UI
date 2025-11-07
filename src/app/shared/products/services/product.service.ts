import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {Product} from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private httpClient = inject(HttpClient);

  private baseUrl = `${environment.apiUrl}/products`;

  public save(product: Product): Observable<number> {
    return this.httpClient.post<number>(`${this.baseUrl}/save`, product);
  }

  public delete(id: number): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/delete`, { id });
  }

  public getAll(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseUrl}/get-all`);
  }

}

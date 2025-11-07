import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {Store} from '../models/store.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {

  private httpClient = inject(HttpClient);

  private baseUrl = `${environment.apiUrl}/stores`;

  public save(store: Store): Observable<number> {
    return this.httpClient.post<number>(`${this.baseUrl}/save`, store);
  }

  public delete(id: number): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/delete`, { id });
  }

  public getAll(): Observable<Store[]> {
    return this.httpClient.get<Store[]>(`${this.baseUrl}/get-all`);
  }
}

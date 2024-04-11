import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private baseUrl = 'http://localhost:8080/ecomerce/categorias';

constructor (

 private httpClient: HttpClient

  ) {}

  private getAllategorias(): Observable<any>{
        return this.httpClient.get(this.baseUrl);

  }


}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../../model/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private baseUrl = 'http://localhost:8040/api/';

constructor (

 private http: HttpClient

  ) {}

  // public getAllCategorias(): Observable<any>{
  //       return this.http.get(this.baseUrl);
  //
  // }
 createCategoria(categoria: any){
    return this.http.post<Categoria>(this.baseUrl + 'Categoria',categoria);
  }

  getAllCategorias():Observable<any>{
      return this.http.get(this.baseUrl + 'Categorias')
    }


}

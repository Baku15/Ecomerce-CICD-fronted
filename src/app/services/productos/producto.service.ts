import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);

  list(){
      return this.http.get('http://localhost:8080/productos');
  }

  get(id: number){
    return this.http.get('http://localhost:8080/productos/${id}');
  }

  create(producto: any){
    return this.http.post('http://localhost:8080/productos',producto);

  }
  constructor() { }
}

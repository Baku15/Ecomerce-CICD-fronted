import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Marca } from '../../model/marca.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private baseUrl = 'http://localhost:8040/api/marca/';

constructor (

 private http: HttpClient

  ) {}

 createMarca(marca: any){
    return this.http.post<Marca>(this.baseUrl + 'crear',marca);
  }

  getAllMarcas():Observable<any>{
      return this.http.get(this.baseUrl + 'all')
    }


}

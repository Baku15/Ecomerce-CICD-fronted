import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private API_SERVER = "http://localhost:8080/api/v1/usuario";

  constructor(private httpClient: HttpClient) { }

  public getAllUsuarios(): Observable<any>{
    return this.httpClient.get(this.API_SERVER);
  }

  public registerNewUsuario(registroUsuario: any): Observable<any>{
    return this.httpClient.post(this.API_SERVER, registroUsuario)
  }
}


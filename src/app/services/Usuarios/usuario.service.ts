import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private API_SERVER = "http://localhost:8050/api/user";

  constructor(private httpClient: HttpClient) { }
  public login(credentials: any): Observable<any>{
    return this.httpClient.post(this.API_SERVER+"/auth/login", credentials);
  }
  public getAllUsuarios(): Observable<any>{
    return this.httpClient.get(this.API_SERVER);
  }

  public registerNewUsuario(registroUsuario: any): Observable<any>{
    return this.httpClient.post(this.API_SERVER, registroUsuario)
  }

  public deleteUsuariobyId(id: number): Observable<any>{
    return this.httpClient.delete(this.API_SERVER + '/' + id);
  }

  //servicio para user
  public registerNewUser(registroUsuario: any): Observable<any>{
    return this.httpClient.post('http://localhost:8050/api/BusquedasP/createG', registroUsuario)
  }
  //servicio para persona
  public registerNewPersona(registroUsuario: any): Observable<any>{
    return this.httpClient.post(this.API_SERVER, registroUsuario)
  }
}


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private API_SERVER = "http://localhost:8040/api/user";

  constructor(private httpClient: HttpClient) { }
  public login(credentials: any): Observable<any>{
    return this.httpClient.post(this.API_SERVER+"/auth/login", credentials);
  }
  public getAllUsuarios(): Observable<any>{
    return this.httpClient.get(this.API_SERVER);
  }

  public getAllUsers(): Observable<any>{
    return this.httpClient.get('http://localhost:8040/api/BusquedasP/todas');
  }
  public registerNewUsuario(registroUsuario: any): Observable<any>{
    return this.httpClient.post(this.API_SERVER, registroUsuario)
  } 

  public getAllCostumers(): Observable<any>{
    return this.httpClient.get('http://localhost:8040/api/BusquedasR/buscarRol/Comprador');
  }

  public getAllEmployees(): Observable<any>{
    return this.httpClient.get('http://localhost:8040/api/BusquedasR/buscarRol/EMPLEADO');
  }

  public changerole(id: number, rol: string): Observable<any>{
    const roles = `${rol}`;
    console.log(roles);
    return this.httpClient.put('http://localhost:8040/api/user/'+id+'/roles', [roles])
  } 

  public deleteUsuariobyId(id: number): Observable<any>{
    return this.httpClient.delete(this.API_SERVER + '/' + id);
  }

  //servicio para user
  public registerNewUser(registroUsuario: any): Observable<any>{
    return this.httpClient.post('http://localhost:8040/api/BusquedasP/createG', registroUsuario)
  }
  //servicio para persona
  public registerNewPersona(registroUsuario: any): Observable<any>{
    return this.httpClient.post(this.API_SERVER, registroUsuario)
  }
}


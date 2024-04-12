import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private http: HttpClient) { }

  generarPDF(email: string, descripcion: string, imagen: File) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('descripcion', descripcion);
    formData.append('imagen', imagen);

    return this.http.post<any>('http://localhost:8080/api/guardar-pdf', formData);
  }
}
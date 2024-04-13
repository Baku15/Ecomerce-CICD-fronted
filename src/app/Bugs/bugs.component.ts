import { Component } from '@angular/core';
import { PdfService } from './pdf.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {

  email: string;
  descripcion: string;
  imagen: File;

  constructor(private pdfService: PdfService) { }

  onSubmit() {
    if (!this.email || !this.descripcion || !this.imagen) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    this.pdfService.generarPDF(this.email, this.descripcion, this.imagen).subscribe(
      response => {
        console.log('PDF guardado exitosamente:', response);
        alert('PDF guardado exitosamente.');
      },
      error => {
        console.error('Error al guardar el PDF:', error);
        alert('Error al guardar el PDF. Por favor, inténtelo de nuevo.');
      }
    );
  }

  onFileSelected(event) {
    this.imagen = event.target.files[0];
  }

}
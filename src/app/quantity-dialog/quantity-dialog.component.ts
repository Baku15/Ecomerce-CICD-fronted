import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../material-module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quantity-dialog',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './quantity-dialog.component.html',
  styleUrl: './quantity-dialog.component.css'
})
export class QuantityDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<QuantityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { quantity: number, stock: number }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(this.data.quantity);
  }
}
